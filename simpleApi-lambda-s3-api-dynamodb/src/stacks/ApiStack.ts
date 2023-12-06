import { Stack, StackProps } from "aws-cdk-lib";
import { EventType } from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";

import { Construct } from "constructs";
import { createApiLambda } from "../services/lambda/ApiLambda";
import { createIamRole } from "../services/iam/iamRole";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { createApi } from "../services/api/api";
import { createDynamodb } from "../services/dynamodb/Dynamodb";
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = createDynamodb(this, "createDynamodb");

    const policies = [
      {
        action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resource: ["arn:aws:logs:*:*:*"],
      },
      {
        action: ["dynamodb:*"],
        resource: [database.tableArn],
      },
    ];

    const iam = createIamRole(this, "createIamRole", policies);
    const lambda = createApiLambda(this, "createApiLambda", iam);
    const api = createApi(this, "createApi", lambda);
  }
}
