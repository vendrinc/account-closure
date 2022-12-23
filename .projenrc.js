const { awscdk, github } = require("projen")
const project = new awscdk.AwsCdkConstructLibrary({
  author: "Lora Reames",
  authorAddress: "lora.reames@vendr.com",
  cdkVersion: "2.37.1",
  defaultReleaseBranch: "main",
  name: "account-closure",
  packageName: "@blissfully/account-closure",
  minNodeVersion: "16.18.1",
  repositoryUrl: "https://github.com/Blissfully/account-closure.git",
  description:
    "cdk construct for automating AWS account closure and dealing with the AWS close account quota",
  deps: ["aws-cdk-lib"],
  bundledDeps: ["@aws-solutions-constructs/aws-eventbridge-stepfunctions"],
  devDeps: ["node@16"],
  prettier: true,
  eslint: true,
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp(),
  },
})
project.eslint.addRules({ semi: 0 })
project.prettier.settings.semi = false
project.synth()
