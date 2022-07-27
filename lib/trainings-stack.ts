import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CDKContext } from "../types";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TrainingsStack extends Stack {
  constructor(scope: Construct, id: string, context: CDKContext, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //s3 bucket
    const bucket = new s3.Bucket(this, 'demoBucket', {
      bucketName: `${context.appName}-${context.environment}`,
      encryption: context.s3Encrypt ? s3.BucketEncryption.S3_MANAGED : s3.BucketEncryption.UNENCRYPTED,
    });
    //dynamo table
    const table = new dynamodb.Table(this, 'demoTable', {
      tableName: `${context.appName}-${context.environment}`,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: context.ddbPITRecovery,
      sortKey: { name: 'rangeKey', type: dynamodb.AttributeType.STRING},
      partitionKey: { name: 'hashKey', type: dynamodb.AttributeType.STRING },
    });
    //stack outputs
    new CfnOutput(this, 'demoBucketArn', {
      value: bucket.bucketArn,
      exportName: `${context.appName}-demoBucketArn-${context.environment}`
    });
    new CfnOutput(this, 'demoTableArn',{
      value: table.tableArn,
      exportName: `${context.appName}-demoTableArn-${context.environment}`
    })
  }
}
