#🖼️ Automating Image Resizing with AWS Lambda, S3, and Sharp
In modern applications, image optimization is crucial for improving performance and user experience. Whether you're building an e-commerce platform, a social media app, or a content management system, resizing images efficiently can make a significant difference.

Recently, I worked on a serverless image transformation pipeline using AWS Lambda, S3, and Sharp to automatically generate thumbnails whenever an image is uploaded to an S3 bucket. Here’s how I did it.



# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
