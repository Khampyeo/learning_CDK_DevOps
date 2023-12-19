import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

const roomPath = "/room";
const roomsPath = "/rooms";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  console.log("event:", event);
  let response;

  try {
    switch (true) {
      case event.httpMethod === "GET" && event.path === roomPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "POST" && event.path === roomPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "PATCH" && event.path === roomPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "DELETE" && event.path === roomPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "GET" && event.path === roomsPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;

      default:
        response = buildResponse(200, { Message: "SUCCESS" });
    }
    return response;
  } catch (err) {
    return buildResponse(404, { message: JSON.stringify(err) });
  }
};
const getRooms = async () => {
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_ROOMS_TABLE,
    });

    const response = await docClient.send(command);

    return buildResponse(200, {
      action: "GET",
      message: "SUCCESS",
      data: response.Items,
    });
  } catch (error) {
    return buildResponse(404, {
      action: "GET",
      message: "FAIL: " + JSON.stringify(error),
    });
  }
};
const getRoom = async (roomId: string) => {
  try {
    const command = new GetCommand({
      TableName: process.env.DYNAMODB_ROOMS_TABLE,
      Key: {
        roomId,
      },
    });

    const response = await docClient.send(command);
    console.log("data: ", response);

    const body = {
      action: "GET",
      message: "SUCCESS",
      data: response.Item,
    };

    return buildResponse(200, body);
  } catch (error) {
    return buildResponse(404, {
      action: "GET",
      message: "FAIL: " + JSON.stringify(error),
    });
  }
};
const buildResponse = (statusCode: Number, body: Object) => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
      "Access-Control-Allow-Credentials": "true", // Required for cookies, authorization headers with HTTPS
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
};
