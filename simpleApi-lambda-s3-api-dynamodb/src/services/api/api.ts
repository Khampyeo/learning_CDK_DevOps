import { Construct } from "constructs";
import { IFunction } from "aws-cdk-lib/aws-lambda";

import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { resources } from "./resources";

export const createApi = (
  construct: Construct,
  id: string,
  lambda: IFunction
) => {
  const api = new RestApi(construct, id);

  resources.map((resource) => {
    const spacesResource = api.root.addResource(resource.name);

    resource.methods.forEach((method) => {
      spacesResource.addMethod(method, new LambdaIntegration(lambda));
    });
  });

  return api;
};
