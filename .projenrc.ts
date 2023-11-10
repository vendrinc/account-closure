import { VendrCdkConstruct } from "@vendrinc/projen";
import { javascript } from "projen";

const project = new VendrCdkConstruct({
  author: "Lora Reames",
  authorAddress: "lora.reames@vendr.com",
  cdkVersion: "2.96.2",
  defaultReleaseBranch: "main",
  name: "account-closure",
  packageName: "@vendrinc/account-closure",
  minNodeVersion: "18.18.0",
  npmAccess: javascript.NpmAccess.PUBLIC,
  repositoryUrl: "https://github.com/vendrinc/account-closure.git",
  npmRegistryUrl: "https://npm.pkg.github.com",
  description:
    "cdk construct for automating AWS account closure and dealing with the AWS close account quota",
  // bundledDeps: ["@aws-solutions-constructs/aws-eventbridge-stepfunctions"],
  deps: ["@aws-solutions-constructs/aws-eventbridge-stepfunctions"],
  devDeps: [
    "node@18",
    "@types/node@18",
    "aws-cdk-lib@2.96.2",
    "@vendrinc/projen@0.0.92",
    "projen@0.73.26",
  ],
  prettier: true,
  eslint: true,
});

project.synth();
