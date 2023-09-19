import { EventbridgeToStepfunctions } from "@aws-solutions-constructs/aws-eventbridge-stepfunctions";
import { Duration } from "aws-cdk-lib";
import { Schedule } from "aws-cdk-lib/aws-events";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  Choice,
  Map,
  Pass,
  Result,
  Succeed,
  Condition,
  JsonPath,
  DefinitionBody,
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
        AccountId: JsonPath.arrayGetItem(
          JsonPath.stringSplit(JsonPath.stringAt("$.ResourceARN"), "/"),
          2
        ),
      },
      iamResources: ["arn:aws:organizations::*:account/o-*/*"],
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
        PaginationToken: JsonPath.stringAt("$.PaginationToken"),
        ResourceTypeFilters: ["organizations:account"],
        TagFilters: [
          {
            Key: "organizations:account-closure",
            Values: ["REQUESTED"],
          },
        ],
      },
      iamResources: ["*"],
      additionalIamStatements: [
        new PolicyStatement({
          sid: "TagPolicy",
          actions: ["tag:*"],
          effect: Effect.ALLOW,
          resources: ["*"],
        }),
      ],
    });

    const tagAcknowledged = new CallAwsService(this, "tagAcknowledged", {
      service: "organizations",
      action: "tagResource",
      parameters: {
        ResourceId: JsonPath.stringAt("$.Account.Id"),
        Tags: [
          {
            Key: "organizations:account-closure",
            Value: "ACKNOWLEDGED",
          },
        ],
      },
      iamResources: ["*"],
    });

    const closeAccount = new CallAwsService(this, "closeAccount", {
      service: "organizations",
      action: "closeAccount",
      iamResources: ["arn:aws:organizations::*:account/o-*/*"],
      parameters: {
        AccountId: JsonPath.stringAt("$.Account.Id"),
      },
    })
      .addRetry({
        backoffRate: 1,
        errors: ["Organizations.TooManyRequestsException"],
        interval: Duration.seconds(20),
        maxAttempts: 2,
      })
      .addCatch(new Succeed(this, "AccountClosureLimitReached"), {
        errors: ["Organizations.ConstraintViolationException"],
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
            Condition.stringEquals("$.PaginationToken", ""),
            new Succeed(this, "Done Paginating")
          )
          .otherwise(findAccounts)
      );

    new EventbridgeToStepfunctions(this, "AccountClosureStepFunction", {
      stateMachineProps: {
        definitionBody: DefinitionBody.fromChainable(definition),
      },
      eventRuleProps: {
        schedule: Schedule.rate(Duration.hours(1)),
      },
    });
  }
}
