const path = require('path');
const { awscdk } = require('projen');

const cdkVersion = '2.0.0';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Matthew Bonig',
  authorAddress: 'matthew.bonig@gmail.com',
  cdkVersion: cdkVersion,
  defaultReleaseBranch: 'main',
  jsiiFqn: 'matthewbonig.rdsTools',
  name: '@matthewbonig/rds-tools',
  repositoryUrl: 'https://github.com/mbonig/rds-tools.git',
  devDeps: [
    'eslint',
    'esbuild',
  ],
  peerDeps: ['aws-cdk-lib'],
  npmAccess: 'public',
  releaseWorkflow: false,
  projenDuringBuild: false,
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
