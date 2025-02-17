import { TransactionRecordedEventStorage } from "../application/transaction.storage"

export class ApiTransactionSyncService {
    constructor(private readonly storage: TransactionRecordedEventStorage, ) {

    }
    async run(): Promise<void> {
        const endpoint =process.env.TRANSACTIONS_API_ENDPOINT
        if (endpoint == undefined) {
            throw Error('TRANSACTIONS_API_ENDPOINT not configured')
        }
        const response = await fetch(endpoint)
        const transactions = await response.json()
        for(const transaction of transactions){
            await this.storage.save(transaction)
        }
    }
}