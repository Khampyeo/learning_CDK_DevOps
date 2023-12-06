import { Construct } from "constructs";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";

export const createLambda = (construct: Construct, id: string, role: any) => {
  const lambda = new Function(construct, id, {
    functionName: "s3uploadefile-lambda",
    runtime: Runtime.NODEJS_16_X, // Bạn có thể điều chỉnh phiên bản Node.js tùy thuộc vào yêu cầu của bạn.
    handler: "index.handler",
    code: Code.fromAsset(join(__dirname, "..", "..", "..", "app")),
    role: role,
    environment: {
      BUCKET_NAME: process.env.BUCKET_NAME || "default-bucket-khamma12",
    },
  });

  return lambda;
};
