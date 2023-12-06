import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket, BlockPublicAccess } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export const createS3 = (construct: Construct, id: string, lambda: any) => {
  const bucket = new Bucket(construct, id, {
    bucketName: process.env.BUCKET_NAME,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  });
  bucket.grantReadWrite(lambda);
  return bucket;
};
