const AWS = require("aws-sdk"); // AWS SDK for accessing S3
const sharp = require("sharp"); // Sharp for image transformation

const S3 = new AWS.S3(); // Initialize the S3 client
const TRANSFORMED_BUCKET = process.env.TRANSFORMED_BUCKET; // Bucket to store transformed images
const MAX_WIDTH = 300; // Thumbnail max width
const MAX_HEIGHT = 300; // Thumbnail max height

exports.handler = async (event) => {
  try {
    // Parse the S3 event to get bucket name and object key
    const record = event.Records[0]; // Assume one record per event
    const sourceBucket = record.s3.bucket.name;
    const sourceKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    
    console.log(`Processing file from bucket: ${sourceBucket}, key: ${sourceKey}`);

    // Step 1: Retrieve the original image from the source bucket
    const originalImage = await S3.getObject({
      Bucket: sourceBucket,
      Key: sourceKey,
    }).promise();

    console.log("Original image retrieved successfully.");
    // Step 2: Generate the thumbnail using Sharp
    const thumbnailBuffer = await sharp(originalImage.Body)
    .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "fill", position: "center" }).toBuffer();

    console.log("Thumbnail created successfully.");

    // Step 3: Save the thumbnail to the transformed bucket
    const thumbnailKey = `thumbnail_${sourceKey}`; // Prefix the original key with 'thumbnail_'
    await S3.putObject({
      Bucket: TRANSFORMED_BUCKET,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: "image/png", // Adjust content type based on your requirements
    }).promise();

    console.log(`Thumbnail saved successfully to ${TRANSFORMED_BUCKET}/${thumbnailKey}`);

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Thumbnail created and uploaded successfully.",
        transformedKey: thumbnailKey,
      }),
    };
  } catch (err) {
    console.error("Error processing S3 event:", err , "💀💀💀💀💀💀");

    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: err.message,
      }),
    };
  }
};
