import { Construct } from "constructs";
import { Function, Runtime, Code, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { Duration } from "aws-cdk-lib";

export const createLambda = (construct: Construct, id: string, role: any) => {
  const sharpLayer = new LayerVersion(construct, "sharp-layer", {
    compatibleRuntimes: [Runtime.NODEJS_20_X],
    code: Code.fromAsset(
      join(__dirname, "..", "..", "..", "..", "backend", "sharp.zip")
    ),
  });

  const lambda = new Function(construct, id, {
    functionName: "handleResizeImg-lambda",
    runtime: Runtime.NODEJS_20_X,
    handler: "index.handler",
    timeout: Duration.minutes(5),
    code: Code.fromAsset(
      join(__dirname, "..", "..", "..", "..", "backend", "archive.zip")
    ),
    role: role,
    environment: {
      BUCKET_NAME: process.env.BUCKET_NAME || "acv",
      DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || "avc",
      REGION: "ap-southeast-1",
    },
    layers: [sharpLayer],
  });

  return lambda;
};
