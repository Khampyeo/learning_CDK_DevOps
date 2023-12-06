#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ApiStack } from "../stacks/ApiStack";
import * as dotenv from "dotenv";
dotenv.config();

const app = new App();

new ApiStack(app, "ApiStack");
