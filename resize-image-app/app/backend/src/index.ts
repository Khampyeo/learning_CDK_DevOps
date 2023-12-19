const healthPath = "/health";
const imagePath = "/image";
const imagesPath = "/images";

export const handler = async (event) => {
  console.log("event:", event);
  let response;
  try {
    switch (true) {
      case event.httpMethod === "GET" && event.path === healthPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "POST" && event.path === imagePath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "GET" && event.path === imagePath:
        const { key } = event.queryStringParameters;
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "DELETE" && event.path === imagePath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;
      case event.httpMethod === "GET" && event.path === imagesPath:
        response = buildResponse(200, { Message: "SUCCESS" });
        break;

      default:
        response = buildResponse(404, "404 Not Found");
    }
    return response;
  } catch (err) {
    return buildResponse(404, "404 Not Found");
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
