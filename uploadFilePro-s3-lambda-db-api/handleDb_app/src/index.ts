import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log(event);
  try {
    const item = event.detail.object;
    switch (event["detail-type"]) {
      case "Object Deleted":
        await deleteItem(item.key);
        break;
      case "Object Created":
        console.log(item);

        const arr = item.key.split("/");
        const name = arr.pop();
        const path = arr.join("/");

        const newItem = {
          key: item.key,
          name: name,
          path: path,
          size: item.size,
        };

        await saveItem(newItem);
        break;
      default:
        break;
    }
    return buildResponse(200, { message: "SUSSCESS" });
  } catch (error) {
    return buildResponse(404, { message: JSON.stringify(error) });
  }
};

async function saveItem(item) {
  let body;
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: item,
    };

    const command = new PutCommand(params);

    await docClient.send(command);

    body = {
      Operation: "Saved",
      Message: "SUCCESS",
      Item: item,
    };
  } catch (error) {
    body = {
      Operation: "Can't Save",
      Message: "ERROR",
      Error: JSON.stringify(error),
    };
  }
  return body;
}

const deleteItem = async (key) => {
  let body;
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        key: key,
      },
    };

    const command = new DeleteCommand(params);

    await docClient.send(command);

    body = {
      Operation: "Delete",
      Message: "SUCCESS",
    };
  } catch (error) {
    body = {
      Operation: "Can't Delete",
      Message: "ERROR",
      Error: JSON.stringify(error),
    };
  }
};

const buildResponse = (statusCode: Number, body: Object) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};
