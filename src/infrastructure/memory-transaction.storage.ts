import { TransactionRecordedEventStorage } from "../application/transaction.storage";

export class MemoryTransactionStorage implements TransactionRecordedEventStorage{
    
    private transactions : TransactionRecordedEventPayload[]

    constructor(){
        this.transactions = []
    }
    
    async save(event: TransactionRecordedEventPayload): Promise<void> {
        this.transactions.push(event)
    }
    async findEventsByCustomerId(customerId: number): Promise<TransactionRecordedEventPayload[]> {
        return this.transactions.filter(transaction=> transaction.customerId === customerId)
    }
    async findEvents(): Promise<TransactionRecordedEventPayload[]> {
        return this.transactions
    }
    async findEventsById(id: number){
       return this.transactions.find(transaction=> transaction.transactionId === id)
    }
}