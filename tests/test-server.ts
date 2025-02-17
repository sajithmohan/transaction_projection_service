import { MemoryTransactionStorage } from '../src/infrastructure/memory-transaction.storage'
import { ApiTransactionSyncService } from '../src/infrastructure/api-transaction-sync-service'
import { CustomerTransactionService } from '../src/application/customer-transaction.service'
import { startServer } from '../src/server'
import { FastifyInstance } from 'fastify'

export class TestServer {
    instance: FastifyInstance | undefined

    async start() {
        const transactionStorage = new MemoryTransactionStorage()
        const transactionSyncService = new ApiTransactionSyncService(transactionStorage)
        const customerTransactionService = new CustomerTransactionService(transactionStorage)

        this.instance = await startServer({
            transactionStorage,
            transactionSyncService,
            customerTransactionService
        })
    }

    async stop() {
        if (!this.instance) return
        await this.instance.close()
    }
}