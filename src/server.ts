import fastify from "fastify"
import { CustomerRelationsController } from "./api/customer-relations.controller"
import { CustomerTransactionController } from "./api/customer-transactions.controller"
import { CustomerTransactionService } from "./application/customer-transaction.service"
import { ApiTransactionSyncService } from "./infrastructure/api-transaction-sync-service"
import { MemoryTransactionStorage } from "./infrastructure/memory-transaction.storage"

export type Dependancies = {
    transactionStorage: MemoryTransactionStorage
    transactionSyncService: ApiTransactionSyncService
    customerTransactionService: CustomerTransactionService
}

export async function startServer(dependancies: Dependancies) {
    const server = fastify()

    new CustomerRelationsController(server, dependancies.customerTransactionService)
    new CustomerTransactionController(server, dependancies.customerTransactionService)

    await dependancies.transactionSyncService.run()

    server.listen({ port: 8080 }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`Server listening at ${address}`)
    })
    return server
}