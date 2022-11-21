const { awscdk, github } = require("projen");
const project = new awscdk.AwsCdkConstructLibrary({
  author: "Lora Reames",
  authorAddress: "lora.reames@vendr.com",
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  name: "account-closure",
  repositoryUrl: "https://github.com/Blissfully/account-closure.git",
  description:
    "cdk construct for automating AWS account closure and dealing with the AWS close account quota",

  deps: ["@aws-solutions-constructs/aws-eventbridge-stepfunctions"],
  devDeps: ["node@16"],
  // packageName: undefined,  /* The "name" in package.json. */
  prettier: true,
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp(),
  },
});
project.synth();
