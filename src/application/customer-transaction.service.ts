import { CustomerRelationsnBuilderService } from "./customer-relations-builder.service";
import { CustomerTransactionBuilder } from "./customer-transaction-builder.service";
import { DeviceUsersBuilderService } from "./device-users-builder.service";
import { TransactionRecordedEventStorage } from "./transaction.storage";

export class CustomerTransactionService {
    constructor(private transactionStorage: TransactionRecordedEventStorage) {

    }
    async getTransactionsByCustomer(customerId: number) {
        const transactionEvents = await this.transactionStorage.findEventsByCustomerId(customerId)
        /**
         * TODO: We create and store snapshots at specific intervals or upon receiving each event, 
         * reducing the need to rebuild from scratch every time.
         */
        const preCalculatedSnapShot = new Map()
        const transactions = [...CustomerTransactionBuilder.build(preCalculatedSnapShot, transactionEvents).values()]
        return transactions
    }
    async getRelatedCustomers(customerId: number) {
        const transactionEvents = await this.transactionStorage.findEvents()
        /**
         * TODO: We create and store snapshots at specific intervals or upon receiving each event, 
         * reducing the need to rebuild from scratch every time.
         */
        const preCalculatedSnapShot = new Map()
        const customerRelationsnBuilderService = new CustomerRelationsnBuilderService(this.transactionStorage)
        const deviceUsers = await DeviceUsersBuilderService.build(new Map(), transactionEvents)
        const snapshots = await customerRelationsnBuilderService.build(preCalculatedSnapShot, transactionEvents, deviceUsers)
        const relatedCustomers = (snapshots.get(customerId)?.relatedCustomers ?? [])
        return relatedCustomers.flatMap(c => {
            return [...c.relationTypes].map(relationType => {
                return {
                    relatedCustomerId: c.relatedCustomerId,
                    relationType
                }
            })

        })
    }
}