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
    const stockCount = stockResults.find((stockItem) => {
      return stockItem.product_id == product.id;
    });
    return {
      ...product,
      count: stockCount.count ? stockCount.count : 0,
    };
  });

  return {
    statusCode: 200,
    body: JSON.stringify(productsWithCount),
  };
};

module.exports.getProductsById = async (event) => {
  const pId = event.pathParameters.productId;
  const scanResult = await scanProducts();
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
