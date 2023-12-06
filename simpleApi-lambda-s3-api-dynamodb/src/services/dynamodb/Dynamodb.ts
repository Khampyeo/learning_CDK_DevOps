import { Construct } from "constructs";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";

export const createDynamodb = (construct: Construct, id: string) => {
  console.log(process.env.DYNAMODB_TABLE);

  const table = new Table(construct, "SimpleCrudApiTable", {
    tableName: process.env.DYNAMODB_TABLE,
    partitionKey: { name: "id", type: AttributeType.STRING },
    removalPolicy: RemovalPolicy.DESTROY,
  });

  return table;
};
