import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { WebSocketApi, WebSocketStage } from "aws-cdk-lib/aws-apigatewayv2";
import { routes } from "./wsRouters";

export const createWsApi = (
  construct: Construct,
  id: string,
  lambda: IFunction
) => {
  const webSocketApi = new WebSocketApi(construct, id, {
    apiName: "chatting-wsapi",
    connectRouteOptions: {
      integration: new WebSocketLambdaIntegration("ConnectIntegration", lambda),
    },
    disconnectRouteOptions: {
      integration: new WebSocketLambdaIntegration(
        "DisconnectIntegration",
        lambda
      ),
    },
    defaultRouteOptions: {
      integration: new WebSocketLambdaIntegration("DefaultIntegration", lambda),
    },
  });
  new WebSocketStage(construct, "mystage", {
    webSocketApi,
    stageName: "dev",
    autoDeploy: true,
  });

  routes.forEach((route) =>
    webSocketApi.addRoute(route, {
      integration: new WebSocketLambdaIntegration(
        "SendMessageIntegration",
        lambda
      ),
    })
  );
  return webSocketApi;
};
