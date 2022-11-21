// import * as cdk from "aws-cdk-lib";
// import { Match, Template } from "aws-cdk-lib/assertions";
// import { AccountClosureStepFunction } from "../src/index";

// describe("Account Closure Construct", () => {
//   const app = new cdk.App();
//   const accountClosureStepFunctionTestStack = new AccountClosureStepFunction(
//     app,
//     "AccountClosureStepFunctionTestStack"
//   );
//   const template = Template.fromStack(accountClosureStepFunctionTestStack);

//   it("Should Create Permission Sets And Group Assignments", async () => {
//     template.hasResourceProperties("AWS::SSO::PermissionSet", {
//       Name: "DevAdmin",
//       Description: "Full Administrator Access",
//       SessionDuration: "PT8H",
//       ManagedPolicies: Match.arrayWith([
//         "arn:aws:iam::aws:policy/AdministratorAccess",
//       ]),
//     });
//     template.hasResourceProperties("AWS::SSO::PermissionSet", {
//       Name: "ProdAdmin",
//       Description: "Full Administrator Access",
//       SessionDuration: "PT8H",
//       ManagedPolicies: Match.arrayWith([
//         "arn:aws:iam::aws:policy/AdministratorAccess",
//       ]),
//     });

//     template.hasResourceProperties("AWS::SSO::PermissionSet", {
//       Name: "DevOpsRead",
//       Description: "Read only access",
//       SessionDuration: "PT8H",
//       CustomerManagedPolicyReferences: Match.arrayWith([
//         Match.objectLike({ Name: "ECRReadOnly" }),
//         Match.objectLike({ Name: "ListTagsOnSQSQueue" }),
//       ]),
//       InlinePolicy: Match.objectLike({
//         Version: "2012-10-17",
//         Statement: [
//           {
//             Sid: "VisualEditor0",
//             Effect: "Allow",
//             Action: [
//               "cloudwatch:DescribeAlarmHistory",
//               "cloudwatch:GetDashboard",
//               "cloudwatch:GetInsightRuleReport",
//               "cloudwatch:DescribeAlarms",
//               "cloudwatch:GetMetricStream",
//             ],
//             Resource: [
//               "arn:aws:cloudwatch:*:317367216472:metric-stream/*",
//               "arn:aws:cloudwatch::317367216472:dashboard/*",
//               "arn:aws:cloudwatch:*:317367216472:insight-rule/*",
//               "arn:aws:cloudwatch:*:317367216472:alarm:*",
//             ],
//           },
//           {
//             Sid: "VisualEditor1",
//             Effect: "Allow",
//             Action: [
//               "cloudwatch:DescribeInsightRules",
//               "cloudwatch:GetMetricData",
//               "cloudwatch:DescribeAlarmsForMetric",
//               "cloudwatch:GetMetricStatistics",
//               "cloudwatch:GetMetricWidgetImage",
//               "cloudwatch:DescribeAnomalyDetectors",
//             ],
//             Resource: "*",
//           },
//         ],
//       }),
//       ManagedPolicies: Match.arrayWith([
//         "arn:aws:iam::aws:policy/job-function/SupportUser",
//         "arn:aws:iam::aws:policy/AWSXrayReadOnlyAccess",
//         "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess",
//         "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess",
//         "arn:aws:iam::aws:policy/CloudWatchLogsReadOnlyAccess",
//         "arn:aws:iam::aws:policy/AmazonRDSReadOnlyAccess",
//         "arn:aws:iam::aws:policy/AWSStepFunctionsReadOnlyAccess",
//       ]),
//     });

//     template.hasResourceProperties("AWS::SSO::Assignment", {
//       PermissionSetArn: {
//         "Fn::GetAtt": ["adminPermissionSet", "PermissionSetArn"],
//       },
//       PrincipalType: "GROUP",
//       PrincipalId: oktaGroups.admins,
//       TargetType: "AWS_ACCOUNT",
//     });

//     template.hasResourceProperties("AWS::SSO::Assignment", {
//       PermissionSetArn: {
//         "Fn::GetAtt": ["devopsReadPermissionSet", "PermissionSetArn"],
//       },
//       PrincipalType: "GROUP",
//       PrincipalId: oktaGroups.admins,
//       TargetType: "AWS_ACCOUNT",
//     });

//     template.hasResourceProperties("AWS::SSO::Assignment", {
//       PermissionSetArn: {
//         "Fn::GetAtt": ["devopsReadPermissionSet", "PermissionSetArn"],
//       },
//       PrincipalType: "GROUP",
//       PrincipalId: oktaGroups.devOpsRead,
//       TargetType: "AWS_ACCOUNT",
//     });
//   });

//   it("Should create permissionSets with properties matching allowed patterns", async () => {
//     const permissionSets = template.findResources("AWS::SSO::PermissionSet");

//     // expect permissionSet properties to match allowed patterns
//     for (const index in permissionSets) {
//       const permissionSet = permissionSets[index];
//       // Name
//       expect(permissionSet?.Properties.Name).toMatch(/[\w=,.@-]+/);
//       expect(permissionSet?.Properties.Name).not.toMatch(/\s/);
//     }
//   });

//   it("Should create an assignment for each account in existingAccounts", async () => {
//     for (const { uuid, account } of existingAccounts) {
//       template.hasResourceProperties("AWS::SSO::Assignment", {
//         PermissionSetArn: {
//           "Fn::GetAtt": ["devAdminPermissionSet", "PermissionSetArn"],
//         },
//         TargetId: account,
//         PrincipalType: "USER",
//         PrincipalId: uuid,
//         TargetType: "AWS_ACCOUNT",
//       });
//     }
//   });

//   it("Existing account entries should be unique", async () => {
//     for (const {
//       uuid: targetUUID,
//       account: targetAccount,
//       userEmail: targetEmail,
//     } of existingAccounts) {
//       const accounts = existingAccounts.filter(
//         ({ account }) => account === targetAccount
//       );
//       const uuids = existingAccounts.filter(({ uuid }) => uuid === targetUUID);
//       const emails = existingAccounts.filter(
//         ({ userEmail }) => userEmail === targetEmail
//       );

//       expect(accounts.length).toBe(1);
//       expect(uuids.length).toBe(1);
//       expect(emails.length).toBe(1);
//     }
//   });

//   it("Should create account provisioning lambdas", async () => {
//     template.hasResourceProperties("AWS::Lambda::Function", {
//       FunctionName: "OktaCreateUserAccount",
//     });
//     template.hasResourceProperties("AWS::Lambda::Function", {
//       FunctionName: "OktaDisableUserAccount",
//     });
//   });
// });
