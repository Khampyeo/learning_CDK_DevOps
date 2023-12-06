import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { createApi } from "../services/api/Api";
import { createIamRole } from "../services/iam/iamRole";
import { createLambda } from "../services/lambda/Lambda";
import { createS3 } from "../services/s3/S3";

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
    const lambda = createLambda(this, "UploadFileApi", iam);
    const api = createApi(this, "UploadFileLambda", lambda);
    const s3 = createS3(this, "UploadFileS3", lambda);
  }
}
