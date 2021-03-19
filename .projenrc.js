const path = require('path');
const { AwsCdkConstructLibrary } = require('projen');

let cdkDeps = [
  '@aws-cdk/core',
  '@aws-cdk/aws-ec2',
  '@aws-cdk/aws-rds',
  '@aws-cdk/aws-events',
  '@aws-cdk/aws-events-targets',
  '@aws-cdk/aws-lambda',
  '@aws-cdk/aws-lambda-nodejs',
  '@aws-cdk/aws-logs',
  '@aws-cdk/aws-rds',
  '@aws-cdk/aws-secretsmanager',
];
const cdkVersion = process.env.CDK_VERSION || '1.90.0';
const project = new AwsCdkConstructLibrary({
  author: 'Matthew Bonig',
  authorAddress: 'matthew.bonig@gmail.com',
  cdkVersion: cdkVersion,
  cdkVersionPinning: true,
  defaultReleaseBranch: 'master',
  jsiiFqn: 'matthewbonig.rdsTools',
  name: '@matthewbonig/rds-tools',
  repositoryUrl: 'https://github.com/mbonig/rds-tools.git',
  cdkDependencies: cdkDeps,
  devDeps: [
    'eslint',
    'esbuild',
  ],
  peerDeps: cdkDeps,
  npmAccess: 'public',
  releaseWorkflow: false,
});

project.addFields({
  awscdkio: {
    twitter: 'mattbonig',
  },
});

project.gitignore.exclude('cdk.context.json', '.cdk.staging/', '.idea/', 'cdk.out/', 'npm-cache/');
project.npmignore.exclude('cdk.context.json', '.cdk.staging/', '.idea/', 'cdk.out/');
project.npmignore.include('./lib/handlers/*');

project.compileTask.exec('jsii --silence-warnings=reserved-word --no-fix-peer-dependencies && jsii-docgen && cp src/handlers/*.ts lib/handlers/ && cp src/handlers/cfn-response.js lib/handlers/ && cp -R src/layer lib/layer');


project.synth();
