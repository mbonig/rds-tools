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
const project = new AwsCdkConstructLibrary({
  author: 'Matthew Bonig',
  authorAddress: 'matthew.bonig@gmail.com',
  cdkVersion: '1.89.0',
  cdkVersionPinning: true,
  defaultReleaseBranch: 'master',
  jsiiFqn: 'matthewbonig.rdsTools',
  name: '@matthewbonig/rds-tools',
  repositoryUrl: 'https://github.com/mbonig/rds-tools.git',
  cdkDependencies: cdkDeps,
  bundledDeps: ['mssql'],
  deps: [],
  devDeps: ['eslint', 'esbuild'],
  peerDeps: cdkDeps,
  npmAccess: 'public',
});

project.addFields({
  awscdkio: {
    twitter: 'mattbonig',
  },
});

project.gitignore.exclude('cdk.context.json', '.cdk.staging/', '.idea/', 'cdk.out/');
project.npmignore.exclude('cdk.context.json', '.cdk.staging/', '.idea/', 'cdk.out/');
project.npmignore.include('./lib/handlers/*');

project.compileTask.exec('npm i', { cwd: path.join('.', 'src', 'layer', 'nodejs') });
project.compileTask.exec('jsii --silence-warnings=reserved-word --no-fix-peer-dependencies && jsii-docgen && cp src/handlers/*.ts lib/handlers/');


project.synth();
