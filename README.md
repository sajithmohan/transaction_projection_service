# Transaction Projection Service
## Description

This project reads transaction records and aggregates them into projections—one for customer transaction APIs and another for related customers of a customer. It also experiments with event sourcing by reading transaction events to rebuild states from stored events. A great use case to explore and learn event sourcing concepts!


### Application Flow

1. **Transaction Sync Service**:  
   The project initiates transaction synchronization by running the transaction sync service. This service calls the transaction API and stores all transactions in memory.

2. **Customer Transaction API**:  
   On a customer transaction list API call, it reads through the new transactions and builds the state.  
   The state can be pre-built, and the process of building the current state is decoupled, enabling it to be plugged in after writing each transaction or allowing for custom snapshot logic.

3. **Event Building**:  
   Building new events on top of the stored snapshot is not currently implemented, but the code is structured in a way that this can be added with minimal changes.

---

### Considerations

- **Layered Architecture**:  
   The project uses a layered architecture to ensure future maintainability and flexibility, keeping concerns isolated within specific layers.

- **Event Sourcing**:  
   It applies event sourcing concepts to build projections (states or views) from stored events.

- **Integration Testing**:  
   Integration tests are included to verify system behavior.

- **Dependency Inversion**:  
   The implementation follows the Dependency Inversion Principle, allowing for flexibility in changing lower-level components.

- **Infrastructure Abstraction**:  
   The abstraction of infrastructure layer details through interfaces enables easy swapping of components like in-memory storage or transaction sync services. This allows changing to different databases or message queues without altering the application layer logic.

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
List customers who share the same device or have initiated a P2P transfer.

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