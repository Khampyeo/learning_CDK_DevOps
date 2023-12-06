#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { MainStack } from "../stack/MainStack";
dotenv.config();

const app = new App();

new MainStack(app, "MainStack");
