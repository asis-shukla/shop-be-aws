import csv from "csv-parser";
import { S3 } from "aws-sdk";
import { UPLOADED_FOLDER, PARSED_FOLDER, BUCKET } from "../../common/constants";

const s3 = new S3({
  region: REGION,
  httpOptions: {
    timeout: 60,
  },
});

const csvParse = async ({ stream, key: fileKey }) => {
  return new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on("data", (data) => {
        console.log("Data_chunk: ", data);
      })
      .on("end", async () => {
        console.log(`Copy from ${BUCKET}/${fileKey}.`);

        const newFileKey = fileKey.replace(UPLOADED_FOLDER, PARSED_FOLDER);

        console.log(`New file key: `, newFileKey);

        await s3
          .copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${fileKey}`,
            Key: newFileKey,
          })
          .promise();

        await s3
          .deleteObject({
            Bucket: BUCKET,
            Key: fileKey,
          })
          .promise();

        resolve();
      })
      .on("error", (err) => {
        console.log("CSV_PARSE_ERROR: ", data);
        reject(err);
      });
  });
};

const getS3Streams = async (records) => {
  return records.map((record) => {
    const params = {
      Bucket: BUCKET,
      Key: record.s3.object.key,
    };

    return {
      stream: s3.getObject(params).createReadStream(),
      key: record.s3.object.key,
    };
  });
};

const importFileParser = async (event) => {
  console.log(event);

  try {
    const streams = await getS3Streams(event?.Records);
    await Promise.all(streams.map((stream) => csvParse(stream)));
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(eve),
    };
  }
};

export { importFileParser };
