import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";

import {
  RestApi,
  LambdaIntegration,
  Cors,
  EndpointType,
  ContentHandling,
} from "aws-cdk-lib/aws-apigateway";
import { Resources } from "./Resource";

export const createApi = (
  construct: Construct,
  id: string,
  lambda: IFunction
) => {
  const api = new RestApi(construct, id, {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: Cors.DEFAULT_HEADERS,
    },
    endpointTypes: [EndpointType.REGIONAL],
  });

  Resources.map((resource: any) => {
    const spacesResource = api.root.addResource(resource.name);

    resource.methods.forEach((method: any) => {
      spacesResource.addMethod(
        method,
        new LambdaIntegration(lambda, {
          contentHandling: ContentHandling.CONVERT_TO_BINARY,
        })
      );
    });
  });
  return api;
};
