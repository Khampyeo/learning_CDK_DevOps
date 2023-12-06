import { Construct } from "constructs";
import {
  EventBus,
  Rule,
  CfnRule,
  RuleTargetInput,
  EventField,
  IRuleTarget,
} from "aws-cdk-lib/aws-events";

import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export const createRule = (construct: Construct, id: string, lambda: any) => {
  const rule = new Rule(construct, id, {
    ruleName: "S3ToLambdaRule",
    enabled: true,
    eventPattern: {
      source: ["aws.s3"],
      detail: {
        bucket: {
          name: [process.env.BUCKET_NAME],
        },
      },
      detailType: ["Object Created", "Object Deleted"],
    },
  });

  rule.addTarget(new LambdaFunction(lambda));
  return rule;
};
