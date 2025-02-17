import { TransactionRecordedEventStorage } from "./transaction.storage"

export abstract class TransactionSyncService {
    abstract run(storage: TransactionRecordedEventStorage): Promise<void>
}