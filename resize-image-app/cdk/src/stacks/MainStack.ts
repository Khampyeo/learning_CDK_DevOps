import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { createIamRole } from "../services/iam/iamRole";
import { createLambda } from "../services/lambda/handleResize";
import { createApi } from "../services/api/Api";
import { CreateMetadata } from "../services/dynamodb/metadata";
import { createS3 } from "../services/s3/ResizeImgStorage";

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

    const iam = createIamRole(this, "ResizeImgIamRole", policies);
    const lambda = createLambda(this, "ResizeImgLambda", iam);

    const api = createApi(this, "ResizeImgApi", lambda);
    const s3 = createS3(this, "ResizeImgS3", lambda);
    const database = CreateMetadata(this, "ResizeImgDMetadata", lambda);
  }
}
