aws dynamodb batch-write-item --request-items file://products.json
aws dynamodb scan --table-name products
aws dynamodb batch-write-item --request-items file://stocks.json
aws dynamodb scan --table-name stocks
