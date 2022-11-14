"use strict";
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const queryProducts = async (id) => {
  const queryResult = await dynamo
    .query({
      TableName: process.env.TABLE_NAME_ONE,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": id },
    })
    .promise();
  return queryResult;
};

const getProductsById = async (event) => {
  console.log("getProductsById Lambda function...", event.productId);
  const pId = event.pathParameters.productId;
  try {
    const product = await queryProducts(pId);
    if (product.Count == 0) {
      return {
        statusCode: 404,
        body: JSON.stringify(`Product with ${pId} does not exist`),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(product.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export { getProductsById };
