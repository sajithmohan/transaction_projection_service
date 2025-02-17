import { DeviceUsersAggregate } from "./device.users.aggregate"

export class CustomerRelationAggregate {
    relatedCustomers: {
        relatedCustomerId: number,
        relationTypes: Set<string>
    }[]

    constructor(public customerId: number) {
        this.relatedCustomers = []
    }


    applyRelatedCustomerTransaction(event: TransactionRecordedEventPayload) {
        const relatedCustomer = this.relatedCustomers.find(customer => customer.relatedCustomerId === event.customerId)
        if (relatedCustomer) {
            relatedCustomer.relationTypes.add(event.transactionType)
            return
        }
        this.relatedCustomers.push({
            relatedCustomerId: event.customerId,
            relationTypes: new Set([event.transactionType])
        })
    }

    addRelatedDeviceUsers(event: TransactionRecordedEventPayload, userIds: number[]) {
        const relatedUsers = userIds.filter(id => id != this.customerId)

        for(const userId of relatedUsers){
            const relatedCustomer = this.relatedCustomers.find(customer => customer.relatedCustomerId === userId)

            if (relatedCustomer) {
                relatedCustomer.relationTypes.add('DEVICE')
                continue
            }
            this.relatedCustomers.push({
                relatedCustomerId: userId,
                relationTypes: new Set(['DEVICE'])
            })
        }
    }
}