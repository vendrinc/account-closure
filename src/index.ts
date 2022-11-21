import { EventbridgeToStepfunctions } from "@aws-solutions-constructs/aws-eventbridge-stepfunctions";
import { Duration } from "aws-cdk-lib";
import { Schedule } from "aws-cdk-lib/aws-events";
import {
  Choice,
  Condition,
  Map,
  Pass,
  Result,
  StateMachineType,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { CallAwsService } from "aws-cdk-lib/aws-stepfunctions-tasks";
import { Construct } from "constructs";

export class AccountClosureStepFunction extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const describeAccount = new CallAwsService(this, "describeAccount", {
      comment: "Describe Account",
      service: "organizations",
      action: "describeAccount",
      parameters: {
        "AccountId.$":
          "States.ArrayGetItem(States.StringSplit($.ResourceARN, '/'), 2)",
      },
      iamResources: ["arn:aws:states:::aws-sdk:organizations:describeAccount"],
    }).addCatch(
      new Succeed(this, "AccountNotFoundException", {
        comment: "Nothing to do, Potential eventual consistency issue",
      }),
      {
        errors: ["Organizations.AccountNotFoundException"],
      }
    );

    const forEachAccountTagged = new Map(this, "forEachAccountTagged", {
      comment: "For each account tagged REQUESTED",
      itemsPath: "$.ResourceTagMappingList",
      maxConcurrency: 1,
      resultPath: "$._MapResult",
    });

    const findAccounts = new CallAwsService(this, "findAccounts", {
      comment: "Find accounts tagged for closure",
      service: "resourcegroupstaggingapi",
      action: "getResources",
      parameters: {
        "PaginationToken.$": "$PaginationToken",
        resourceTypeFilters: ["organizations:account"],
        TagFilters: [
          {
            Key: "organizations:account-closure",
            Values: ["REQUESTED"],
          },
        ],
      },
      iamResources: [
        "arn:aws:states:::aws-sdk:resourcegroupstaggingapi:getResources",
      ],
    });

    const tagAcknowledged = new CallAwsService(this, "tagAcknowledged", {
      service: "organizations",
      action: "tagResource",
      parameters: {
        "ResourceId.$": "$.Account.Id",
        Tags: [
          {
            Key: "organizations:account-closure",
            Value: "ACKNOWLEDGED",
          },
        ],
      },
      iamResources: ["arn:aws:states:::aws-sdk:organizations:tagResource"],
    });

    const closeAccount = new CallAwsService(this, "closeAccount", {
      service: "organizations",
      action: "closeAccount",
      iamResources: ["arn:aws:states:::aws-sdk:organizations:closeAccount"],
      parameters: {
        "AccountId.$": "$.Account.Id",
      },
    })
      .addRetry({
        backoffRate: 1,
        errors: ["Organizations.TooManyRequestsException"],
        interval: Duration.seconds(20),
        maxAttempts: 2,
      })
      .addCatch(new Succeed(this, "AccountClosureLimitReached"), {
        errors: ["Organizations.TooManyRequestsException"], // wrong error code
      });

    const definition = new Pass(this, "Set empty pagination token", {
      result: Result.fromObject({ PaginationToken: "" }),
    })
      .next(findAccounts)
      .next(
        forEachAccountTagged.iterator(
          describeAccount.next(
            new Choice(this, "isAccountActive")
              .when(
                Condition.stringEquals("$.Account.Status", "ACTIVE"),
                closeAccount
              )
              .otherwise(tagAcknowledged)
          )
        )
      )
      .next(
        new Choice(this, "Additional Pages?")
          .when(
            Condition.stringEquals("$.Paginationtoken", ""),
            new Succeed(this, "Done Paginating")
          )
          .otherwise(findAccounts)
      );

    new EventbridgeToStepfunctions(this, "AccountClosureStepFunction", {
      stateMachineProps: {
        definition,
        stateMachineType: StateMachineType.EXPRESS,
      },
      eventRuleProps: {
        schedule: Schedule.rate(Duration.hours(1)),
      },
    });
  }
}
