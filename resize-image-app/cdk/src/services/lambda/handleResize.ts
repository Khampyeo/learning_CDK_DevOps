import { Construct } from "constructs";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { Duration } from "aws-cdk-lib";

export const createLambda = (construct: Construct, id: string, role: any) => {
  const lambda = new Function(construct, id, {
    functionName: "handleResizeImg-lambda",
    runtime: Runtime.NODEJS_20_X,
    handler: "index.handler",
    timeout: Duration.minutes(5),
    code: Code.fromAsset(
      join(__dirname, "..", "..", "..", "..", "app", "backend", "archive.zip")
    ),
    role: role,
    environment: {
      DYNAMODB_ROOMS_TABLE:
        process.env.DYNAMODB_TABLE_NAME || "RESIZE_IMG_METADATA",
    },
  });

  return lambda;
};
