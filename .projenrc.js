const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Lora Reames',
  authorAddress: 'lora.reames@vendr.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'account-closure',
  repositoryUrl: 'https://github.com/shes.lora.reames/account-closure.git',

  // deps: [],                /* Runtime dependencies of this module. */
  deps: ['@aws-solutions-constructs/aws-eventbridge-stepfunctions'],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  devDeps: [
    'node@16',
  ],
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
