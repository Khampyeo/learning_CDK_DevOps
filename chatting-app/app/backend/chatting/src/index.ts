import {
  PostToConnectionCommand,
  ApiGatewayManagementApiClient,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { log } from "console";

const endpoint =
  // process.env.END_POINT?.replace("wss://", "") + "/dev" ||
  "https://e224k6k33d.execute-api.ap-southeast-1.amazonaws.com/dev/";

const client = new ApiGatewayManagementApiClient({ endpoint });

const clientdb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(clientdb);

let arr: any[] = [];

export const handler = async (event: any) => {
  console.log(event);

  if (event.requestContext) {
    const connectionId = event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;

    let body = {
      userName: null,
      message: null,
    };

    try {
      if (event.body) {
        body = JSON.parse(event.body);
      }
    } catch (error) {
      console.log("getBodyErr: ", error);
    }
    switch (routeKey) {
      case "$connect":
        arr.push({
          id: connectionId,
          userName: null,
        });
        break;
      case "$disconnect":
        console.log("DISCONNECT");
        let userNameToDelete: any = null;
        arr = arr.filter((item) => {
          if (item.id !== connectionId) return true;
          else {
            if (item.userName) userNameToDelete = item.userName;
            return false;
          }
        });
        if (userNameToDelete)
          await removeConnectionId(userNameToDelete, connectionId);

        const newBody = {
          name: "connectionChanged",
          action: "someOneLogOut",
          userName: userNameToDelete,
        };

        await sendToAll(arr, newBody);

        break;
      case "$default":
        break;
      case "setConnectionId":
        const userName = body.userName;
        if (userName !== null) {
          arr.map((item) => {
            if (item.id === connectionId) item.userName = userName;
          });
          log(arr);
          await setConnectionId(userName, connectionId);

          const newBody = {
            name: "connectionChanged",
            action: "someOneLogIn",
            userName,
          };

          await sendToAll(arr, newBody);
        }
        break;
      case "sendMessageToAll":
        if (body.userName && body.message) {
          const newBody = {
            name: "message",
            action: "sendMessage",
            userName: body.userName,
            message: body.message,
          };

          await sendToAll(arr, newBody);
        } else {
          await sendToAll(arr, {
            message: "you need signIn to send messages!",
          });
        }
        break;
      default:
        break;
    }
  }

  // return buildResponse(200, {});
  // const response =
  return {};
};

const sendToOne = async (id: any, body: any) => {
  try {
    const requestParams = {
      ConnectionId: id,
      Data: JSON.stringify(body),
    };

    const command = new PostToConnectionCommand(requestParams);

    await client.send(command);
  } catch (err) {
    console.log("sendToOneErr: ", err);
  }
};
const sendToAll = async (arr: any, body: any) => {
  console.log("SENDTOALL");
  const all = arr.map(async (item: any) => await sendToOne(item.id, body));
  return Promise.all(all);
};

const setConnectionId = async (userName: string, conenctionId: string) => {
  let user;
  let connectionsIds;
  if (userName) {
    const response = await getUser(userName);
    user = response?.Item;

    connectionsIds = user?.connectionIds;
    if (!connectionsIds.includes(conenctionId))
      connectionsIds.push(conenctionId);
  }

  if (user) {
    await updateUser(userName, connectionsIds, true);
  }
};

const removeConnectionId = async (userName: string, connectionId: string) => {
  console.log("removeConnectionId");

  try {
    let user;
    let connectionsIds;

    const response = await getUser(userName);
    user = response?.Item;

    connectionsIds = user?.connectionIds;

    if (connectionsIds.includes(connectionId))
      connectionsIds = connectionsIds.filter(
        (id: string) => id !== connectionId
      );

    if (user) {
      if (connectionsIds.length > 0)
        await updateUser(userName, connectionsIds, true);
      else await updateUser(userName, connectionsIds, false);
    }
  } catch (error) {
    console.log(JSON.stringify(error));
  }
};

const getUser = async (userName: string) => {
  try {
    const command = new GetCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: {
        userName: userName,
      },
    });

    const response = await docClient.send(command);

    return response;
  } catch (error) {
    console.log(JSON.stringify(error));
    return;
  }
};

const updateUser = async (
  userName: string,
  connectionIds: any,
  isOnline: boolean
) => {
  try {
    console.log("UPDATE");

    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: {
        userName: userName,
      },
      UpdateExpression:
        "SET connectionIds = :connectionIds, isOnline = :isOnline",

      ExpressionAttributeValues: {
        ":connectionIds": connectionIds,
        ":isOnline": isOnline,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
