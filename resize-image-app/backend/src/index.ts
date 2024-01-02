import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const bucketName = process.env.BUCKET_NAME;
const region = process.env.REGION;

const imagePath = "/image";
const imagesPath = "/images";

export const handler = async (event) => {
  console.log("CI/CD");
  console.log(event);

  let response;

  switch (true) {
    case event.httpMethod === "GET" && event.path === imagePath:
      if (!event.queryStringParameters)
        return buildResponse(404, { message: "parameter not exist" });
      const key = event.queryStringParameters.key;
      const url = await getPresignedUrlToDownload(key);

      response = buildResponse(200, { url: url });
      break;
    case event.httpMethod === "POST" && event.path === imagePath:
      if (!event.body) return buildResponse(404, { message: "File not exist" });

      if (!event.queryStringParameters)
        return buildResponse(404, { message: "parameter not exist" });
      const query = event.queryStringParameters;
      const parsedBody = JSON.parse(event.body);

      response = editImage(query, parsedBody);
      break;
    case event.httpMethod === "GET" && event.path === imagesPath:
      response = await getItems();
      break;

    default:
      response = buildResponse(404, "404 Not Found");
  }

  return response;
};

const editImage = async (query, parsedBody) => {
  const width = Number(query.width);
  const height = Number(query.height);
  const grayscale = query.grayscale === "True" ? true : false;
  const type = query.type;
  const crop = query.crop === "True" ? true : false;
  const quality = Number(query.quality);

  try {
    const client = new S3Client({ region });

    const base64File = parsedBody.file;
    const ContentType = parsedBody.type;
    let name = parsedBody.name;

    const decodedFile = Buffer.from(
      base64File.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const current = Math.round(new Date().getTime() / 1000);

    let result = name.split(".").pop();
    name = name.replace(`.${result}`, `-${current}.${type}`);
    let image;
    switch (type) {
      case "png":
        image = await sharp(decodedFile)
          .resize({
            width: width,
            height: height,
            withoutEnlargement: crop,
            fit: crop ? "cover" : "fill",
          })
          .toFormat("png")
          .png({ quality: quality })
          .grayscale(grayscale)
          .toBuffer();
        break;
      case "jpeg":
        image = await sharp(decodedFile)
          .resize({
            width: width,
            height: height,
            withoutEnlargement: crop,
            fit: crop ? "cover" : "fill",
          })
          .toFormat("jpeg")
          .jpeg({ quality: quality })
          .grayscale(grayscale)
          .toBuffer();
        break;
      case "jpg":
        image = await sharp(decodedFile)
          .resize({
            width: width,
            height: height,
            withoutEnlargement: crop,
            fit: crop ? "cover" : "fill",
          })
          .toFormat("jpg")
          .jpeg({ quality: quality })
          .grayscale(grayscale)
          .toBuffer();
        break;
      default:
        break;
    }

    const params = {
      Bucket: bucketName,
      Key: name || "null.png",
      Body: image,
      ContentType: ContentType || "image/png",
    };

    const command = new PutObjectCommand(params);

    const uploadResult = await client.send(command);
    if (uploadResult.$metadata.httpStatusCode === 200) {
      const url = await getPresignedUrlToDownload(name);

      const item = {
        name: name,
        ContentType: ContentType,
        height,
        width,
        grayscale,
        crop,
        quality,
        created_at: current,
        expired_on: current + 604800,
      };

      await addItemToDynamoDb(item);

      return buildResponse(200, { url: url });
    } else return buildResponse(404, { message: "FAILED" });
  } catch (e) {
    return buildResponse(404, { message: JSON.stringify(e) });
  }
};

const getPresignedUrlToDownload = async (key) => {
  try {
    const client = new S3Client({ region });

    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const url = await getSignedUrl(client, command, { expiresIn: 500 });
    return url;
  } catch (error) {
    return buildResponse(404, { message: "Can't get Presigned Url" });
  }
};

const addItemToDynamoDb = async (item) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: item,
  });

  const response = await docClient.send(command);

  return response;
};

const getItems = async () => {
  const client = new DynamoDBClient();
  const docClient = DynamoDBDocumentClient.from(client);

  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };

  const command = new ScanCommand(params);

  const data = await docClient.send(command);

  return buildResponse(200, {
    items: data.Items,
  });
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
