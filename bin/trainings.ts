#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TrainingsStack } from '../lib/trainings-stack';
import * as gitBranch from 'git-branch';
import { CDKContext } from '../types'

// const app = new cdk.App();

const createStack = async () => {
  try {
    const app = new cdk.App();
    const context = await getContext(app);
    const tags: any = {
      Environment: context.environment,
    };
    const stackProps: cdk.StackProps = {
      env: {
        region: context.region,
        account: context.accountNumber
      },
      stackName: `${context.appName}-stack-${context.environment}`,
      description: 'This is a description',
      tags
    }
    new TrainingsStack(app, `${context.appName}-stack-${context.environment}`, context, stackProps);

  } catch (error) {
    console.error(error);
  }


}
export const getContext = async (app: cdk.App): Promise<CDKContext> => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentBranch = await gitBranch();
      console.log(`Current git branch: ${currentBranch}`);
      const environment = app.node.tryGetContext('environments').find((e: any) => e.branchName === currentBranch);
      console.log(`Current env: ${JSON.stringify(environment, null, 2)}`);
      const globals = app.node.tryGetContext('globals');
      console.log(`globals: ${JSON.stringify(globals, null, 2)}`);
      return resolve({ ...globals, ...environment });

    } catch (error) {
      console.error(error);
      return reject();
    }
  })

}
createStack()