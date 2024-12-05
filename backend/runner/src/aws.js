import {
    CopyObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import fs from "fs/promises";
import path, { dirname } from "path";
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

//Copy S3 folder to local path
async function fetchS3Folder(key, localPath,continuationToken=null) {
    console.log("key: ",key);
    console.log("Locale path: ",localPath)
    
    try {

        const listParams = {
            Bucket: process.env.S3_BUCKET,
            Prefix: key,
            ContinuationToken: continuationToken
        }
        const command = new ListObjectsV2Command(listParams);
        const { Contents, IsTruncated, NextContinuationToken } = await s3Client.send(command);

        if (!Contents || Contents.length === 0) return;
        
        
        
        for (const file of Contents) {
            const fileKey = file.Key;
            if (fileKey) {
                const params = { Bucket: process.env.S3_BUCKET, Key: fileKey };
                const command = new GetObjectCommand(params);
                const data = await s3Client.send(command);
        
                if (data.Body) {
                    const fileData = data.Body;
                    const filePath = `${localPath}/${fileKey.replace(key, "")}`;
                    await writeFile(filePath, fileData);
                }
            }
        }
        if(IsTruncated){
            fetchS3Folder(key,localPath,NextContinuationToken)
        }
        
    } catch (error) {
        console.error("Error in loading file to local path:", error);
    }
}

async function writeFile(filePath, file) {
    try {
        await createFolder(path.dirname(filePath));
        await fs.writeFile(filePath, file);
    }
    catch (error) {
        throw new Error("Unable to write file: ", error.message);
    }
}

async function createFolder(dirPath) {
    try {
        fs.mkdir(dirPath, { recursive: true });
    }
    catch (error) {
        throw new Error("Unable to create folder: ", error.message);
    }
}


//Saving files to s3 bucket
async function saveToS3(key, filePath, content) {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `${key}${filePath}`,
            Body: content,
        };

        await s3Client.send(new PutObjectCommand(params));
        console.log("Saving to s3");
        
    } catch (error) {
        console.log(`Error in saving to S3 : ${error}`);
    }
}

export { copyS3Folder, saveToS3, writeFile, createFolder, fetchS3Folder };
