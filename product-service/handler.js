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

const scanProducts = async () => {
  const scanResult = await dynamo
    .scan({
      TableName: process.env.TABLE_NAME_ONE,
    })
    .promise();
  return scanResult.Items;
};

const scanStocks = async () => {
  const result = await dynamo
    .scan({
      TableName: process.env.TABLE_NAME_TWO,
    })
    .promise();
  return result.Items;
};

module.exports.getProductsList = async (event) => {
  const productsResult = await scanProducts();
  const stockResults = await scanStocks();
  const productsWithCount = productsResult.map((product) => {
    let stockCount = stockResults.find((stockItem) => {
      return stockItem.product_id == product.id;
    });
    if (!stockCount) {
      stockCount = { count: 0 };
    }
    return {
      ...product,
      count: stockCount.count,
    };
  });

  return {
    statusCode: 200,
    body: JSON.stringify(productsWithCount),
  };
};

const putProduct = async (item) => {
  const putResults = await dynamo
    .put({
      TableName: process.env.TABLE_NAME_ONE,
      Item: item,
    })
    .promise();
  return putResults;
};

module.exports.createProduct = async (event) => {
  const itemToInsert = JSON.parse(event.body);
  const putProductResults = await putProduct(itemToInsert);
  return putProductResults;
};

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

module.exports.getProductsById = async (event) => {
  const pId = event.pathParameters.productId;
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
};
