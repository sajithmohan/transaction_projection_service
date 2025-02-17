import dotenv from 'dotenv'
dotenv.config()
import fastify from 'fastify'
import { ApiTransactionSyncService } from './infrastructure/api-transaction-sync-service'
import { MemoryTransactionStorage } from './infrastructure/memory-transaction.storage'
import { CustomerTransactionService } from './application/customer-transaction.service'
import { CustomerRelationsController } from './api/customer-relations.controller'
import { CustomerTransactionController } from './api/customer-transactions.controller'
import { startServer } from './server'



async function run(){
  const transactionStorage = new MemoryTransactionStorage()
  const transactionSyncService = new ApiTransactionSyncService(transactionStorage)
  const customerTransactionService = new CustomerTransactionService(transactionStorage)

  await startServer({
    transactionStorage,
    transactionSyncService,
    customerTransactionService
  })
}


run()