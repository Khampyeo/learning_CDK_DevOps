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
  const parseBody = JSON.parse(event.body);

  let response;
  try {
    switch (true) {
      case event.httpMethod === "GET" && event.path === roomPath:
        const params = event.queryStringParameters;
        const body = await getRoom(params.roomId);
        if (body.status === "SUCCESS") {
          response = buildResponse(200, body);
        } else response = buildResponse(404, body);

        break;

      case event.httpMethod === "POST" && event.path === roomPath:
        response = createRoom(parseBody.roomId);
        break;
      case event.httpMethod === "PATCH" && event.path === roomPath:
        response = updateMessageHistory(parseBody.roomId, parseBody.message);
        break;
      case event.httpMethod === "DELETE" && event.path === roomPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "GET" && event.path === roomsPath:
        response = getRooms();
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

    const body = {
      action: "GET",
      status: "SUCCESS",
      message: "Get item success!",
      data: response.Item || {},
    };

    return body;
  } catch (error) {
    return {
      action: "GET",
      status: "FAIL",
      message: JSON.stringify(error),
      data: "",
    };
  }
};
const createRoom = async (roomId: string) => {
  try {
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_ROOMS_TABLE,
      Item: {
        roomId: roomId,
        messagesHistory: [],
      },
    });

    const response = await docClient.send(command);

    const body = {
      action: "CREATE",
      message: "SUCCESS",
    };

    return buildResponse(200, body);
  } catch (error) {
    return buildResponse(404, {
      action: "CREATE",
      message: "FAIL: " + JSON.stringify(error),
    });
  }
};

const updateMessageHistory = async (roomId, message) => {
  const response = await getRoom(roomId);
  if (response.status === "SUCCESS") {
    const data = response.data;
    const messagesHistory = data["messagesHistory"];

    messagesHistory.push(message);

    await updateRoom(roomId, messagesHistory);

    return buildResponse(200, { message: "update SUCCESS" });
  } else buildResponse(400, { message: "update ERROR" });
};

const updateRoom = async (roomId: string, messagesHistory: Array<Object>) => {
  try {
    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_ROOMS_TABLE,
      Key: {
        roomId,
      },
      UpdateExpression: "SET messagesHistory = :messagesHistory",

      ExpressionAttributeValues: {
        ":messagesHistory": messagesHistory,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);

    const body = {
      action: "UPDATE",
      message: "SUCCESS",
    };

    return buildResponse(200, body);
  } catch (error) {
    return buildResponse(404, {
      action: "UPDATE",
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
