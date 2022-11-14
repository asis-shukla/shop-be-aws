"use strict";
import { SNS, DynamoDB } from "aws-sdk";

const dynamo = new DynamoDB.DocumentClient();
const sns = new SNS({ region: process.env.REGION });

const productsFromRecords = (records) => {
  const products = records.map(({ body }) => JSON.parse(body));

  const productsWithKeys = products.map((p) => {
    const values = Object.values(p);

    return {
      id: values[0],
      title: values[1],
      description: values[2],
      price: values[3],
      count: values[4],
    };
  });

  return productsWithKeys;
};

const createProducts = async (products) => {
  const productRecords = [];

  products.forEach((item) => {
    productRecords.push({
      PutRequest: {
        Item: item,
      },
    });
  });

  const params = {
    RequestItems: {
      [process.env.TABLE_NAME_ONE]: productRecords,
    },
  };

  const writeResults = dynamo.batchWrite(params).promise();
  return writeResults;
};

const sendNotification = async (products, limitedQuantity = false) => {
  try {
    const result = await sns
      .publish({
        Subject: `New ${
          limitedQuantity ? "limited" : ""
        } products are created!`,
        Message: JSON.stringify(products),
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          IsExpensive: {
            DataType: "String",
            StringValue: limitedQuantity.toString(),
          },
        },
      })
      .promise();

    console.log("Send notification for ", products, " with result ", result);
  } catch (error) {
    console.log("Send notification for ", products, "with error ", error);
  }
};

export const sendProductsNotification = async (products) => {
  const limitedProducts = [];
  const regularProducts = [];

  products.forEach((product) => {
    if (products.count < 4) {
      limitedProducts.push(product);
    } else {
      regularProducts.push(product);
    }
  });

  if (limitedProducts.length) {
    await sendNotification(limitedProducts, true);
  }

  if (regularProducts.length) {
    await sendNotification(regularProducts, false);
  }
  return "Product notification";
};

const catalogBatchProcess = async (event) => {
  console.log("catalogBatchProcess event: ", event);
  const products = productsFromRecords(event.Records);

  try {
    const createResponse = await createProducts(products);
    const snsResponse = await sendProductsNotification(products);
    console.log("create response: ", createResponse);
    console.log("notification sent response: ", snsResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({ createResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

export { catalogBatchProcess };
