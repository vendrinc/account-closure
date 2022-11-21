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
        "AccountClosureStepFunctionConstruct"
      );
    }
  }
  const testStack = new TestStack(app, "AccountClosureStepFunctionTestStack");
  const template = Template.fromStack(testStack);

  it("should create step function and event rule", async () => {
    template.hasResourceProperties("AWS::StepFunctions::StateMachine", {
      StateMachineType: "EXPRESS",
    });
    template.hasResourceProperties("AWS::Events::Rule", {
      ScheduleExpression: "rate(1 hour)",
    });
  });
});
