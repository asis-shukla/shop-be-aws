'use strict';

const productsData = [{ "id": 1, "name": "Crab - Soft Shell", "description": "Fish - Soup Base, Bouillon", "price": "$7.65", "availableDate": "6/5/2022" },
{ "id": 2, "name": "Heavy Duty Dust Pan", "description": "Pails With Lids", "price": "$8.95", "availableDate": "6/5/2022" },
{ "id": 3, "name": "Puree - Kiwi", "description": "Pork - Loin, Center Cut", "price": "$9.74", "availableDate": "11/10/2021" },
{ "id": 4, "name": "Banana - Green", "description": "Juice - Clam, 46 Oz", "price": "$4.82", "availableDate": "2/20/2022" },
{ "id": 5, "name": "Table Cloth 90x90 White", "description": "Tart - Lemon", "price": "$6.35", "availableDate": "7/18/2022" },
{ "id": 6, "name": "Ice Cream Bar - Drumstick", "description": "Chips - Assorted", "price": "$2.89", "availableDate": "4/22/2022" },
{ "id": 7, "name": "Flower - Dish Garden", "description": "Mustard - Seed", "price": "$7.71", "availableDate": "10/26/2021" },
{ "id": 8, "name": "Broom - Push", "description": "Coffee - Cafe Moreno", "price": "$6.48", "availableDate": "6/15/2022" },
{ "id": 9, "name": "Soup Campbells", "description": "Nantucket - 518ml", "price": "$7.20", "availableDate": "2/8/2022" },
{ "id": 10, "name": "Dikon", "description": "Icecream Cone - Areo Chocolate", "price": "$3.26", "availableDate": "6/5/2022" },
{ "id": 11, "name": "Fudge - Cream Fudge", "description": "Lid - High Heat, Super Clear", "price": "$6.92", "availableDate": "4/4/2022" },
{ "id": 12, "name": "Nantucket Orange Juice", "description": "Soup - Knorr, French Onion", "price": "$1.85", "availableDate": "12/29/2021" },
{ "id": 13, "name": "Olives - Kalamata", "description": "Pastry - Choclate Baked", "price": "$3.68", "availableDate": "5/9/2022" },
{ "id": 14, "name": "Alize Gold Passion", "description": "Tea - Herbal - 6 Asst", "price": "$4.00", "availableDate": "12/14/2021" }];

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(productsData)
  }
}

module.exports.getProductsById = async (event) => {
  const pId = event.pathParameters.productId;
  const product = productsData.find((item) => {
    return item.id == pId
  })
  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify(`Product with ${pId} does not exist`)
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify(product)
  }
}
