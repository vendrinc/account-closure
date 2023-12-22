import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Construct } from "constructs";
import { AccountClosureStepFunction } from "../src/index";

describe("Account Closure Construct", () => {
  const app = new cdk.App();

  class TestStack extends Stack {
    constructor(scope: Construct, id: string) {
      super(scope, id);
      new AccountClosureStepFunction(
        this,
        "AccountClosureStepFunctionConstruct",
        {
          privilegedRoleArn: "arn:aws:iam::123456789012:role/PrivilegedRole",
        }
      );
    }
  }
  const testStack = new TestStack(app, "TestStack");
  const template = Template.fromStack(testStack);

  it("should create step function and event rule", async () => {
    template.hasResource("AWS::StepFunctions::StateMachine", {});
    template.hasResourceProperties("AWS::Events::Rule", {
      ScheduleExpression: "rate(1 hour)",
    });
  });
});
