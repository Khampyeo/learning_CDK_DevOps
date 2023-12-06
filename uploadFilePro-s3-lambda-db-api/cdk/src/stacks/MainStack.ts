import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { createApi } from "../services/api/Api";
import { createIamRole } from "../services/iam/iamRole";
import { createLambdaUploader } from "../services/lambda/LambdaUploader";
import { createS3 } from "../services/s3/S3";
import { createDynamodb } from "../services/dynamo/Dynamo";
import { createLambdaMetadata } from "../services/lambda/LambdaMetadata";
import { createRule } from "../services/eventBridge/S3ToLambda";

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const policies = [
      {
        action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resource: ["arn:aws:logs:*:*:*"],
      },
    ];

    const iam = createIamRole(this, "UploadFileIamRole", policies);
    const lambdaUploader = createLambdaUploader(this, "UploadFileApi", iam);
    const lambdaMetadata = createLambdaMetadata(
      this,
      "UploadFileMetadataLambda",
      iam
    );
    const api = createApi(this, "UploadFileLambda", lambdaUploader);
    const s3 = createS3(this, "UploadFileS3", lambdaUploader);
    const database = createDynamodb(this, "UploadFileDatabase", lambdaMetadata);
    const rule = createRule(this, "UploadFileRule", lambdaMetadata);
  }
}
