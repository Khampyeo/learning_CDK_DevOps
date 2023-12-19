import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";

import {
  RestApi,
  LambdaIntegration,
  Cors,
  EndpointType,
} from "aws-cdk-lib/aws-apigateway";
import { userResources, roomResource } from "./restResource";

export const createRestApi = (
  construct: Construct,
  id: string,
  userlambda: IFunction,
  roomLambda: IFunction
) => {
  const api = new RestApi(construct, id, {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: Cors.DEFAULT_HEADERS,
    },
    endpointTypes: [EndpointType.REGIONAL],
  });

  userResources.map((resource: any) => {
    const spacesResource = api.root.addResource(resource.name);

    resource.methods.forEach((method: any) => {
      spacesResource.addMethod(method, new LambdaIntegration(userlambda, {}));
    });
  });
  roomResource.map((resource: any) => {
    const spacesResource = api.root.addResource(resource.name);

    resource.methods.forEach((method: any) => {
      spacesResource.addMethod(method, new LambdaIntegration(roomLambda, {}));
    });
  });

  return api;
};
