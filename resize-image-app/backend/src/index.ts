import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = process.env.BUCKET_NAME;
const region = process.env.REGION;

export const handler = async (event) => {
  console.log(event);
  if (!event.body) return buildResponse(404, { message: "File not exist" });
  if (!event.queryStringParameters)
    return buildResponse(404, { message: "parameter not exist" });

  const width = Number(event.queryStringParameters.width);
  const height = Number(event.queryStringParameters.height);

  try {
    const client = new S3Client({ region });

    const parsedBody = JSON.parse(event.body);
    const base64File = parsedBody.file;
    const type = parsedBody.type;
    const name = parsedBody.name;

    const decodedFile = Buffer.from(
      base64File.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const image = await sharp(decodedFile).resize(width, height).toBuffer();

    const params = {
      Bucket: bucketName,
      Key: name || "null.png",
      Body: image,
      ContentType: type || "image/png",
    };

    const command = new PutObjectCommand(params);

    const uploadResult = await client.send(command);
    if (uploadResult.$metadata.httpStatusCode === 200) {
      const url = await getPresignedUrlToDownload(name);
      console.log(url);
      return buildResponse(200, { url: url });
    } else return buildResponse(404, { message: "Resize Failed" });
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
    return buildResponse(404, { message: "Resize Failed" });
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
