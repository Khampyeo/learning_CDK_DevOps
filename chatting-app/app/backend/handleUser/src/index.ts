import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const healthPath = "/health";
const userPath = "/user";
const usersPath = "/users";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  console.log("event:", event);
  let response;
  console.log("queryStringParameters:", event.queryStringParameters);

  let body = null;
  if (event.body) body = JSON.parse(event.body);
  let params = null;
  if (event.queryStringParameters) params = event.queryStringParameters;
  console.log(params);

  try {
    switch (true) {
      case event.httpMethod === "GET" && event.path === healthPath:
        response = buildResponse(200, { Message: "SUCCESS" });

        break;
      case event.httpMethod === "GET" && event.path === userPath:
        response = getUser(params.userName);
        break;
      case event.httpMethod === "POST" && event.path === userPath:
        response = createUser(body.userName);
        break;
      case event.httpMethod === "PATCH" && event.path === userPath:
        response = updateUser(body.userName, body.isOnline);
        break;
      case event.httpMethod === "DELETE" && event.path === userPath:
        response = deleteUser(body.userName);
        break;
      case event.httpMethod === "GET" && event.path === usersPath:
        response = getUsers();
        break;

      default:
        response = buildResponse(200, { Message: "SUCCESS" });
    }
    return response;
  } catch (err) {
    return buildResponse(404, { message: JSON.stringify(err) });
  }
};

const getUsers = async () => {
  try {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
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
const getUser = async (userName: string) => {
  try {
    const command = new GetCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: {
        userName: userName,
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
const deleteUser = async (userName: string) => {
  try {
    const command = new DeleteCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: {
        userName: userName,
      },
    });

    const response = await docClient.send(command);
    const body = {
      action: "DELETE",
      message: "SUCCESS",
    };

    return buildResponse(200, body);
  } catch (error) {
    return buildResponse(404, {
      action: "DELETE",
      message: "FAIL: " + JSON.stringify(error),
    });
  }
};
const updateUser = async (userName: string, isOnline: boolean) => {
  try {
    const command = new UpdateCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: {
        userName: userName,
      },
      UpdateExpression: "SET isOnline = :isOnline",

      ExpressionAttributeValues: {
        ":isOnline": isOnline,
      },
      ReturnValues: "ALL_NEW",
    });

    const response = await docClient.send(command);

    const body = {
      action: "UPDATE",
      message: "SUCCESS",
      isOnline,
    };

    return buildResponse(200, body);
  } catch (error) {
    return buildResponse(404, {
      action: "UPDATE",
      message: "FAIL: " + JSON.stringify(error),
    });
  }
};

const createUser = async (userName: string) => {
  try {
    const command = new PutCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Item: {
        userName: userName,
        isOnline: false,
        connectionIds: [],
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
