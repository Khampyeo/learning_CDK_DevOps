#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SimpleApi } from "../lib/simple-api";

const app = new cdk.App();
const deployStacksSequentially = async () => {
  try {
    // Chạy các công việc theo thứ tự
    await new SimpleApi(app, "SimpleApi");

    console.log("Deployment completed successfully.");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
};

deployStacksSequentially();
