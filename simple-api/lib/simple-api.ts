import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { Fn } from "aws-cdk-lib";
import { createApiLambda } from "./lambda/SimpleApiLambda";
import { createBucket } from "./s3/SimpleApiS3";
import { createIamRole } from "./iam/IamRole";

export class SimpleApi extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.initializeAsyncStuff().then(() => {  
      console.log("Initialization completed.");
    });
  }

  private async initializeAsyncStuff(): Promise<void> {
    // Các hoạt động không đồng bộ ở đây
    const lambdafc = await createApiLambda(this, "ApiLambda");
    const bucket = await createBucket(this, "ApiBucket");
    const role = await createIamRole(this, "ApiRole");
  }
}
