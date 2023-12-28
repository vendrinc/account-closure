import { Stack, Duration, App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Schedule } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import { AccountClosureStepFunction } from "../src/index";

describe("Account Closure Construct", () => {
  it("should create step function and event rule", async () => {
    const app = new App();
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

    template.hasResource("AWS::StepFunctions::StateMachine", {});
    template.hasResourceProperties("AWS::Events::Rule", {
      ScheduleExpression: "rate(1 day)",
    });
  });

  it("should allow customization of schedule for event rule", async () => {
    const app = new App();
    class TestStack extends Stack {
      constructor(scope: Construct, id: string) {
        super(scope, id);
        new AccountClosureStepFunction(
          this,
          "AccountClosureStepFunctionConstruct",
          {
            privilegedRoleArn: "arn:aws:iam::123456789012:role/PrivilegedRole",
            schedule: Schedule.rate(Duration.hours(1)),
          }
        );
      }
    }
    const testStack = new TestStack(app, "TestStack");
    const template = Template.fromStack(testStack);

    template.hasResource("AWS::StepFunctions::StateMachine", {});
    template.hasResourceProperties("AWS::Events::Rule", {
      ScheduleExpression: "rate(1 hour)",
    });
  });
});
