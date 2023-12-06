import { Construct } from "constructs";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";

export const createApiLambda = (
  construct: Construct,
  id: string,
  role: any
) => {
  const lambda = new Function(construct, id, {
    functionName: "Api-lambda",
    runtime: Runtime.NODEJS_16_X, // Bạn có thể điều chỉnh phiên bản Node.js tùy thuộc vào yêu cầu của bạn.
    handler: "index.handler",
    code: Code.fromAsset(join(__dirname, "..", "..", "..", "app")),
    role: role,
    environment: {
      DYNAMODB_TABLE: process.env.DYNAMODB_TABLE || "DYNAMODB_TABLE",
    },
  });

  // lambda.addPermission("allow-invoke-apigateway", {
  //   principal: new ServicePrincipal("apigateway.amazonaws.com"),
  //   action: "lambda:InvokeFunction",

  // });

  return lambda;
};
