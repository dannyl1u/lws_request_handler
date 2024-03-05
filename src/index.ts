import { Express } from "express";
import { Storage } from "@google-cloud/storage";
import path from 'path';

const storage = new Storage({
    projectId: 'cmpt471',
    keyFilename: './cloud_credentials.json'
});

const express = require("express");
const app: Express = express();

const bucketName = 'lws-bucket-1'

app.get("/*", async (req: any, res: any) => {
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path.substring(1);

    console.log(`Request for ${id}/${filePath}`);

    const gcsFilePath = `dist/output/${id}/${filePath}`;

    try {
        const file = storage.bucket(bucketName).file(gcsFilePath);
        const [contents] = await file.download();
        
        const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
        res.set("Content-Type", type);

        res.send(contents);
    } catch (error) {
        console.error(error);
        res.status(404).send('File not found');
    }
});

app.listen(8002, () => {
  console.log("Server is running on port 8002");
});
