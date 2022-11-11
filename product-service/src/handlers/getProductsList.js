"use strict";
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

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

const getProductsList = async (event) => {
  console.log("getProductsList Lambda functon ...");
  try {
    const productsResult = await scanProducts();
    const stockResults = await scanStocks();
    const productsWithCount = productsResult.map((product) => {
      let stockCount = stockResults.find((stockItem) => {
        return stockItem.product_id == product.id;
      });
      if (!stockCount) {
        stockCount = { count: product.count ? product.count : 0 };
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
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export { getProductsList };
