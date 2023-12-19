import { Construct } from "constructs";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { Duration } from "aws-cdk-lib";

export const createUserLambda = (
  construct: Construct,
  id: string,
  role: any
) => {
  const lambda = new Function(construct, id, {
    functionName: "handleUser-chatting-app-lambda",
    runtime: Runtime.NODEJS_20_X,
    handler: "index.handler",
    timeout: Duration.minutes(5),
    code: Code.fromAsset(
      join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "app",
        "backend",
        "handleUser",
        "archive.zip"
      )
    ),
    role: role,
    environment: {
      DYNAMODB_USERS_TABLE: process.env.DYNAMODB_USERS_TABLE || "USERSTABLE",
      DYNAMODB_ROOMS_TABLE: process.env.DYNAMODB_ROOMS_TABLE || "ROOMSTABLE",
    },
  });

  return lambda;
};
