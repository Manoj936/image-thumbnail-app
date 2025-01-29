import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class ImageThumbnailAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props); // ✅ Always call super() first!

    // 1. Create Source S3 Bucket
    const SourceBucket = new cdk.aws_s3.Bucket(this, "sourceBucket20258989", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(30), // Delete objects after 30 days
          enabled: true,
        },
      ],
    });

    //2. Create Destination Bucket
    const DestinationBucket = new cdk.aws_s3.Bucket(
      this,
      "destBucket20258989",
      {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        versioned: false,
        lifecycleRules: [
          {
            expiration: cdk.Duration.days(30), // Delete objects after 30 days
            enabled: true,
          },
        ],
      }
    );

    // 3. Define Lambda Function

    const LambdaFunction = new cdk.aws_lambda.Function(
      this,
      "ImageProcessingLambda",
      {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        handler: "index.handler",
        architecture: cdk.aws_lambda.Architecture.X86_64,
        code: cdk.aws_lambda.Code.fromAsset("lambdaWorkspace"),
        environment: {
          TRANSFORMED_BUCKET: DestinationBucket.bucketName,
        },
        memorySize: 512, // Setting the memory size to 512 MB
      }
    );

    // 4. Grant Lambda Permissions to Access S3 Buckets
    SourceBucket.grantRead(LambdaFunction);
    DestinationBucket.grantWrite(LambdaFunction);

    // 5. Add S3 Event Notification to Trigger Lambda
    SourceBucket.addEventNotification(
      cdk.aws_s3.EventType.OBJECT_CREATED,
      new cdk.aws_s3_notifications.LambdaDestination(LambdaFunction)
    );


  }
}
