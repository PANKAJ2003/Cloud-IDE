import { CopyObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { configDotenv } from "dotenv";
configDotenv();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.S3_ENDPOINT,
});

async function copyS3Folder(sourcePrefix, destinationPrefix, continuationToken) {
    try {

        //List all objects in the source folder
        const listParams = {
            Bucket: process.env.S3_BUCKET,
            Prefix: sourcePrefix,
            ContinuationToken: continuationToken
        }
        const command = new ListObjectsV2Command(listParams);
        const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(command);

        if (!Contents || Contents.length === 0) return;


        //Copy each object to the new location 
        //copying all object in parallel
        await Promise.all(
            Contents.map(({ Key }) => {
                if (!Key) return;
                return s3Client.send(
                    new CopyObjectCommand({
                        Bucket: process.env.S3_BUCKET,
                        CopySource: `${process.env.S3_BUCKET}/${Key}`,
                        Key: `${destinationPrefix}${Key.substring(sourcePrefix.length)}`
                    })
                )
            })
        )

        if (IsTruncated) {
            await copyS3Folder(sourcePrefix, destinationPrefix, NextContinuationToken)
        }
        return Contents
    }
    catch (error) {
        console.log(`Error Copying Folder : `, error);

    }
}

//Saving files to s3 bucket
async function saveToS3(key, filePath, content) {

    try {

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `${key}${filePath}`,
            Body: content
        }

        await s3Client.send(new PutObjectCommand(params))
    }
    catch (error) {
        console.log(`Error in saving to S3 : ${error}`);

    }
}


export { copyS3Folder, saveToS3 };
