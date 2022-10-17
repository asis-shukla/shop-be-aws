"use strict";
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const scan = async () => {
  const scanResult = await dynamo
    .scan({
      TableName: process.env.TABLE_NAME_ONE,
    })
    .promise();
  return scanResult.Items;
};

module.exports.getProductsList = async (event) => {
  const scanResult = await scan();
  return {
    statusCode: 200,
    body: JSON.stringify(scanResult),
  };
};

module.exports.getProductsById = async (event) => {
  const pId = event.pathParameters.productId;
  const scanResult = await scan();
  const product = scanResult.find((item) => {
    return item.id == pId;
  });
  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify(`Product with ${pId} does not exist`),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
