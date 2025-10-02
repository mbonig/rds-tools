import { awscdk } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const cdkVersion = '2.200.0'; // Required minimum CDK version of consumers of the library
const cdkCliVersion = '2.1029.2';
const minNodeVersion = '20.19.5';
const jsiiVersion = '~5.8.0'; // Does not directly affect consumers of the library
const projenVersion = '^0.95.4'; // Does not affect consumers of the library
const minConstructsVersion = '10.0.5'; // Minimum version to support CDK v2
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Matthew Bonig',
  authorAddress: 'matthew.bonig@gmail.com',
  description: 'A construct for working with RDS SQL servers',
  cdkVersion: cdkVersion,
  projenVersion: projenVersion,
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  minNodeVersion: minNodeVersion,
  name: '@matthewbonig/rds-tools',
  homepage: 'https://github.com/mbonig/rds-tools',
  repositoryUrl: 'https://github.com/mbonig/rds-tools.git',
  jsiiVersion: jsiiVersion,
  peerDeps: [
    'aws-cdk-lib', // recommend using version 189 or greater due to security updates
  ],
  devDeps: [
    `aws-cdk@${cdkCliVersion}`,
    `aws-cdk-lib@${cdkVersion}`,
    `constructs@^${minConstructsVersion}`,
    'eslint@^9',
    '@typescript-eslint/eslint-plugin@^8',
    '@typescript-eslint/parser@^8',
    'esbuild',
    'projen',
  ],
  bundledDeps: [
    'aws-sdk',
    'mssql',
    'pg',
    'promise-mysql',
  ],
  license: 'MIT',
  depsUpgrade: false,
  npmAccess: NpmAccess.PUBLIC,
  keywords: [
    'aws', 'awscdk', 'RDS', 'SQL',
  ],
  publishToNuget: {
    dotNetNamespace: 'MBonig.RdsTools',
    packageId: 'MBonig.RdsTools',
  },
  publishToPypi: {
    distName: 'mbonig-rds-tools',
    module: 'mbonig.rds_tools',
  },
});

project.addFields({
  awscdkio: {
    twitter: 'mattbonig',
  },
});


// Ensure Assets get copied properly since some files don't get copied in normal compile stage because they are not .ts files
project.compileTask.exec('cp src/handlers/*.js lib/handlers/ || true');
project.compileTask.exec('cp src/handlers/package*.json lib/handlers/ || true');
project.compileTask.exec('cp -r src/layer lib/ || true');

project.synth();
