import { Construct } from "constructs";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";

export const createLambdaMetadata = (
  construct: Construct,
  id: string,
  role: any
) => {
  const lambda = new Function(construct, id, {
    functionName: "handleMetadata-lambda",
    runtime: Runtime.NODEJS_20_X,
    handler: "index.handler",
    code: Code.fromAsset(
      join(__dirname, "..", "..", "..", "..", "handleDb_app", "archive.zip")
    ),
    role: role,
    environment: {
      REGION: process.env.REGION || "ap-southeast-1",
      BUCKET_NAME: process.env.BUCKET_NAME || "default-bucket-khamma12",
      DYNAMODB_TABLE: process.env.DYNAMODB_TABLE || "default_table",
    },
  });

  return lambda;
};
