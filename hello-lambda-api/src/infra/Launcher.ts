import { DataStack } from "../stacks/DataStack";
import { App } from "aws-cdk-lib";
import { LambdaStack } from "../stacks/LambdaStacks";
import { ApiStack } from "../stacks/ApiStack";

const app = new App();
new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack");
new ApiStack(app, "ApiStack", {
  hellolambdaIntegration: lambdaStack.hellolambdaIntegration,
});
