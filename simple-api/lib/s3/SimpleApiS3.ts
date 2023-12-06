import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Fn } from "aws-cdk-lib";

export const createBucket = (construct: Construct, id: string) => {
  return new Bucket(construct, id, {
    bucketName: "simple-api-bucket-khama121",
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    lifecycleRules: [
      {
        expiration: cdk.Duration.days(1),
      },
    ],
  });
};
