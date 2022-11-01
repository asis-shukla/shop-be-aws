import {
  UPLOADED_FOLDER,
  BUCKET,
  EXPIRES_IN,
  REGION,
} from "../../common/constants";
import { S3 } from "aws-sdk";

const importProductsFile = async (event) => {
  console.log(event);

  try {
    const fileName = event?.pathParameters?.fileName || null;
    const filePath = `${UPLOADED_FOLDER}/${fileName}`;
    const s3 = new S3({
      region: REGION,
      httpOptions: {
        timeout: 60,
      },
    });

    const params = {
      Bucket: BUCKET,
      Key: filePath,
      Expires: EXPIRES_IN,
      ContentType: "text/csv",
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export { importProductsFile };
