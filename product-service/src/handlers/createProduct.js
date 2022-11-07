"use strict";
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

const putProduct = async (item) => {
  const putResults = await dynamo
    .put({
      TableName: process.env.TABLE_NAME_ONE,
      Item: item,
    })
    .promise();
  return putResults;
};

const createProduct = async (event) => {
  console.log("createProduct Lambda function...", event.body);
  let itemToInsert = {};
  try {
    itemToInsert = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify("Bad Payload"),
    };
  }
  let res;
  try {
    res = await putProduct(itemToInsert);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(res),
    };
  }
  return {
    statusCode: 201,
    body: JSON.stringify(itemToInsert),
  };
};

export { createProduct };
