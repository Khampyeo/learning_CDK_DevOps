import { Construct } from "constructs";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { IGrantable } from "aws-cdk-lib/aws-iam";

export const CreateMetadata = (
  construct: Construct,
  id: string,
  lambda: IGrantable
) => {
  const table = new Table(construct, id, {
    tableName: process.env.DYNAMODB_TABLE_NAME,
    partitionKey: { name: "name", type: AttributeType.STRING },
    sortKey: { name: "created_at", type: AttributeType.NUMBER },
    removalPolicy: RemovalPolicy.DESTROY,
    timeToLiveAttribute: "expired_on",
  });
  table.grantFullAccess(lambda);

  return table;
};
