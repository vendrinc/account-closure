import { VendrCdkConstruct } from "@blissfully/projen";
import { javascript } from "projen";
import { JobStep, JobPermission } from "projen/lib/github/workflows-model";

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
  npmRegistryUrl: "https://npm.pkg.github.com",
  description:
    "cdk construct for automating AWS account closure and dealing with the AWS close account quota",
  deps: ["aws-cdk-lib"],
  bundledDeps: ["@aws-solutions-constructs/aws-eventbridge-stepfunctions"],
  devDeps: ["node@16", "aws-cdk-lib", "@blissfully/projen"],
  prettier: true,
  eslint: true,
  releaseToNpm: false,
});
project.eslint!.addRules({ semi: 0 });
// project.prettier!.settings.semi = false

export const createReleaseToNpmSteps = (): ReadonlyArray<JobStep> => {
  const jobSteps: ReadonlyArray<JobStep> = [
    {
      uses: "actions/setup-node@v3",
      with: {
        "node-version": "14.x",
      },
    },
    {
      name: "Download build artifacts",
      uses: "actions/download-artifact@v3",
      with: {
        name: "build-artifact",
        path: "dist",
      },
    },
    {
      name: "Download build artifacts",
      uses: "actions/download-artifact@v3",
      with: {
        name: "build-artifact",
        path: "dist",
      },
    },
    {
      name: "Restore build artifact permissions",
      run: "cd dist && setfacl --restore=permissions-backup.acl",
      continueOnError: true,
    },
    {
      name: "Prepare repository",
      run: "mv dist .repo",
    },

    {
      name: "Setup NPM registry and token",
      run: "npm config set @blissfully:registry=https://npm.pkg.github.com/ && npm config set //npm.pkg.github.com/:_authToken=${NPM_TOKEN}",
      env: {
        NPM_TOKEN: "${{ secrets.GH_PACKAGE_READ_TOKEN }}",
      },
    },
    {
      name: "Install Dependencies",
      run: "cd .repo && npm ci",
    },
    {
      name: "Create js artifact",
      run: "cd .repo && npx projen package:js",
    },
    {
      name: "Collect js Artifact",
      run: "mv .repo/dist dist",
    },
    {
      name: "Release",
      run: "npx -p publib@latest publib-npm",
      env: {
        NPM_DIST_TAG: "latest",
        NPM_REGISTRY: "npm.pkg.github.com",
        NPM_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
      },
    },
  ];

  return jobSteps;
};

project.github!.tryFindWorkflow("release")?.addJob("npm_release", {
  runsOn: ["ubuntu-latest"],
  needs: ["release"],
  permissions: {
    packages: JobPermission.WRITE,
    contents: JobPermission.READ,
  },
  steps: [...createReleaseToNpmSteps()],
});

project.synth();
