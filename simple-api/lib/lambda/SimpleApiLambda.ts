import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { join } from "path";

export const createApiLambda = (construct: Construct, id: string) => {
  return new lambda.Function(construct, id, {
    functionName: "SimpleApi-lambda",
    runtime: lambda.Runtime.NODEJS_20_X, // Bạn có thể điều chỉnh phiên bản Node.js tùy thuộc vào yêu cầu của bạn.
    handler: "index.handler",
    code: lambda.Code.fromAsset(join(__dirname, "..", "..", "src")),
  });
};
