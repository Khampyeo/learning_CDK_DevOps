import { aws_iam } from "aws-cdk-lib";
import { Construct } from "constructs";
import path = require("path");

export const createIamRole = (construct: Construct, id: string) => {
  //   const policiesDocument = new aws_iam.PolicyDocument({
  //     statements: [
  //       new aws_iam.PolicyStatement({
  //         effect: aws_iam.Effect.ALLOW,
  //         resources: ["s3:*"],
  //         actions: ["s3:*"],
  //       }),
  //     ],
  //   });
  const role = new aws_iam.Role(construct, id, {
    roleName: id,
    assumedBy: new aws_iam.ServicePrincipal("lambda.amazonaws.com"),
    description: "Api lambda role",
  });

  role.addManagedPolicy(
    aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
  );
  return role;
};
