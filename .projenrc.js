const path = require('path');
const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Matthew Bonig',
  authorAddress: 'matthew.bonig@gmail.com',
  description: 'A construct for working with RDS SQL servers',
  cdkVersion: '2.50.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'matthewbonig.rdsTools',
  name: '@matthewbonig/rds-tools',
  homepage: 'https://github.com/mbonig/rds-tools',
  repositoryUrl: 'https://github.com/mbonig/rds-tools.git',
  jsiiVersion: '^5.1.1',
  devDeps: [
    'eslint',
    'esbuild',
  ],
  license: 'MIT',
  depsUpgrade: false,
  npmAccess: 'public',
  keywords: [
    'aws', 'awscdk', 'RDS', 'SQL',
  ],
});

project.addFields({
  awscdkio: {
    twitter: 'mattbonig',
  },
});

project.gitignore.exclude('cdk.context.json', '.cdk.staging/', '.idea/', 'cdk.out/', 'npm-cache/');
project.npmignore.exclude('cdk.context.json', '.cdk.staging/', '.idea/', 'cdk.out/');
project.npmignore.include('./lib/handlers/*');

project.compileTask.exec('jsii --silence-warnings=reserved-word --no-fix-peer-dependencies && jsii-docgen && cp src/handlers/*.ts lib/handlers/ && cp src/handlers/cfn-response.js lib/handlers/ && cp -R src/layer lib/layer && cp src/handlers/package* lib/handlers/');


project.synth();
