# Transaction Projection Service
## Description

This project reads transaction records and aggregates them into projections—one for customer transaction APIs and another for related customers of a customer. It also experiments with event sourcing by reading transaction events to rebuild states from stored events. A great use case to explore and learn event sourcing concepts!

## Project setup

```bash
$ npm install
```
Create a .env file and define TRANSACTIONS_API_ENDPOINT, or rename .env.example accordingly.
```
TRANSACTIONS_API_ENDPOINT=https://cdn.seen.com/challenge/transactions-v2.1.json
```
## Compile and run the project

```bash
# build
$ npm run build

# development
$ npm run start

# watch mode
$ npm run dev

# test
$ npm run test
```
## Api Documentation

### basic url
```
http://localhost:8080/
```

### List Customer transactions
List transactions by customer id

**Endpoint:** `GET /customers/:id/transactions`

**Response:**  
```json
{
    "data": [
        {
            "transactionId": 18,
            "timeline": [
                {
                    "createdAt": "2022-09-06T13:05:00.000Z",
                    "status": "SETTLED",
                    "amount": 10000,
                    "transactionId": 18,
                    "transactionType": "P2P_RECEIVE",
                    "customerId": 5
                }
            ],
            "createdAt": "2022-09-06T13:05:00.000Z",
            "authorizationCode": "F10008",
            "status": "SETTLED",
            "description": "Transfer from Adam",
            "transactionType": "P2P_RECEIVE",
            "metadata": {
                "relatedTransactionId": 17
            }
        }
    ]
}
```

### List Related Customers of a customer
List customers that share same device or initiated P2P transfer

**Endpoint:** `GET /customers/:id/relations`

**Response:**  
```json
{
    "data": [
        {
            "relatedCustomerId": 4,
            "relationType": "P2P_RECEIVE"
        }
    ]
}
```