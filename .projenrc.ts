import { VendrCdkConstruct } from "@blissfully/projen";
import { javascript } from "projen";

const project = new VendrCdkConstruct({
  author: "Lora Reames",
  authorAddress: "lora.reames@vendr.com",
  cdkVersion: "2.37.1",
  defaultReleaseBranch: "main",
  name: "account-closure",
  packageName: "@blissfully/account-closure",
  minNodeVersion: "16.18.1",
  npmAccess: javascript.NpmAccess.PUBLIC,
  repositoryUrl: "https://github.com/Blissfully/account-closure.git",
  description:
    "cdk construct for automating AWS account closure and dealing with the AWS close account quota",
  deps: ["aws-cdk-lib", "@blissfully/projen"],
  bundledDeps: ["@aws-solutions-constructs/aws-eventbridge-stepfunctions"],
  devDeps: ["node@16", "aws-cdk-lib"],
  prettier: true,
  eslint: true,
});
project.eslint!.addRules({ semi: 0 });
// project.prettier!.settings.semi = false
project.synth();
