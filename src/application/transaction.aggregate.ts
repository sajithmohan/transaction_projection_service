export class TransactionAggregate {
    authorizationCode: string | undefined
    createdAt: Date | undefined
    updatedAt: Date | undefined
    status: string | undefined
    description: string | undefined
    transactionType: string | undefined
    metadata: any
    timeline: {
        createdAt: Date,
        status: string,
        amount: number
        transactionId: number
        transactionType: string
        customerId: number
    }[] = []
    constructor(public transactionId: number) {
    }
    private isMainTransaction(event:TransactionRecordedEventPayload){
        return event.transactionId === this.transactionId
    }
    apply(event: TransactionRecordedEventPayload) {

        if (this.isMainTransaction(event)) {
            this.createdAt = new Date(event.transactionDate)
            this.authorizationCode = event.authorizationCode
            this.status = event.transactionStatus
            this.description = event.description
            this.transactionType = event.transactionType
            this.metadata = event.metadata

        } else {
            this.updatedAt = new Date(event.transactionDate)
        }
        this.timeline.push({
            createdAt: new Date(event.transactionDate),
            status: event.transactionStatus,
            amount: event.amount,
            transactionId: event.transactionId,
            transactionType: event.transactionType,
            customerId: event.customerId
        })
    }
}

