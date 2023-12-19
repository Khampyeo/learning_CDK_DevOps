import { RemovalPolicy } from "aws-cdk-lib";
import { IGrantable } from "aws-cdk-lib/aws-iam";
import { Bucket, BlockPublicAccess, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export const createS3 = (
  construct: Construct,
  id: string,
  lambda: IGrantable
) => {
  const bucket = new Bucket(construct, id, {
    bucketName: process.env.BUCKET_NAME,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    eventBridgeEnabled: true,
    cors: [
      {
        allowedMethods: [HttpMethods.GET, HttpMethods.POST, HttpMethods.PUT],
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
      },
    ],
  });
  bucket.grantReadWrite(lambda);
  return bucket;
};
