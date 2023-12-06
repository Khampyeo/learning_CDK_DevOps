import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const healthPath = "/health";
const filePath = "/file";
const filesPath = "/files";

const bucketName = process.env.BUCKET_NAME;

export const handler = async (event) => {
  console.log("event:", event);
  let response;
  try {
    switch (true) {
      case event.httpMethod === "GET" && event.path === healthPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "POST" && event.path === filePath:
        response = await getPresignedUrlToUpload(event.body);
        break;
      case event.httpMethod === "GET" && event.path === filePath:
        const { key } = event.queryStringParameters;
        response = await getPresignedUrlToDownload(key);
        break;
      case event.httpMethod === "DELETE" && event.path === filePath:
        response = await deleteItem(JSON.parse(event.body).key);
        break;
      case event.httpMethod === "GET" && event.path === filesPath:
        response = await getItems();
        break;

      default:
        response = buildResponse(404, "404 Not Found");
    }
    return response;
  } catch (err) {
    return buildResponse(404, "404 Not Found");
  }
};

const getPresignedUrlToUpload = async (requestBody) => {
  const region = process.env.REGION;
  const bucket = bucketName;
  const key = JSON.parse(requestBody).fileName;
  let body = {};

  try {
    const client = new S3Client({ region });

    const command = new PutObjectCommand({ Bucket: bucket, Key: key });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    body = {
      status: "SUCCESS",
      key: key,
      url: url,
    };
  } catch (error) {
    body = {
      status: "FAIL",
      error: JSON.stringify(error),
    };
  }
  return buildResponse(200, body);
};

const getPresignedUrlToDownload = async (key) => {
  const region = process.env.REGION;
  const bucket = bucketName;

  let body = {};
  let status;

  try {
    const client = new S3Client({ region });

    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    status = 200;
    body = {
      status: "SUCCESS",
      key: key,
      url: url,
    };
  } catch (error) {
    status = 404;
    body = {
      status: "FAIL",
      error: JSON.stringify(error),
    };
  }
  return buildResponse(status, body);
};

const getItems = async () => {
  const client = new DynamoDBClient();
  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  const command = new ScanCommand(params);

  const data = await docClient.send(command);

  return buildResponse(200, {
    items: data.Items,
  });
};

const deleteItem = async (key) => {
  const region = process.env.REGION;
  console.log("key: ", key);

  let body = {};

  let status;
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const client = new S3Client({ region });
    const response = await client.send(command);

    status = 200;
    body = {
      Operation: "DELETE",
      Status: "SUCCESS",
    };
  } catch (err) {
    status = 404;
    body = {
      Operation: "DELETE",
      Status: "ERROR",
      Error: JSON.stringify(err),
    };
  }

  return buildResponse(status, body);
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
