import { Resource, Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { createIamRole } from "../services/iam/iamRole";
import { createWsApi } from "../services/api/WsApi";
import { roomTable } from "../services/dynamodb/roomTable";
import { userTable } from "../services/dynamodb/userTable";
import { createUserLambda } from "../services/lambda/HandleUser";
import { createWsLambda } from "../services/lambda/HandleWs";
import { createRestApi } from "../services/api/RestApi";
import { createRoomLambda } from "../services/lambda/HandleRoom";

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
      {
        action: ["execute-api:Invoke", "execute-api:ManageConnections"],
        resource: ["arn:aws:execute-api:*:*:*"],
      },
      {
        action: ["dynamodb:*"],
        resource: ["*"],
      },
    ];

    const iam = createIamRole(this, "chattingRole", policies);
    const WsLambda = createWsLambda(this, "WsLambda", iam);
    const userLambda = createUserLambda(this, "userLambda", iam);
    const roomLambda = createRoomLambda(this, "roomLambda", iam);
    const wsApi = createWsApi(this, "wsApi", WsLambda);
    const restApi = createRestApi(this, "restApi", userLambda, roomLambda);

    const room = roomTable(this, "roomtable", roomLambda);
    const user = userTable(this, "usertable", userLambda);

    WsLambda.addEnvironment("END_POINT", wsApi.apiEndpoint);
  }
}
