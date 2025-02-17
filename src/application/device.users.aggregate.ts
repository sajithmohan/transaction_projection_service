export class DeviceUsersAggregate {
    users:  Set<number>

    constructor(public devideId: string) {
        this.users = new Set()
    }

    apply(event: TransactionRecordedEventPayload) {
        this.users.add(event.customerId)
    }
}