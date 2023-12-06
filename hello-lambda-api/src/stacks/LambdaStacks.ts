import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

import * as lambda from "aws-cdk-lib/aws-lambda";
import path = require("path");

export class LambdaStack extends Stack {
  public readonly hellolambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambda = new lambda.Function(this, "HelloLambda", {
      functionName: "HelloLambda",
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "services")),
    });

    this.hellolambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
