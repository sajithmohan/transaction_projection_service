export abstract class TransactionRecordedEventStorage {
    abstract save(event: TransactionRecordedEventPayload):Promise<void>
    abstract findEvents(): Promise<TransactionRecordedEventPayload[]>
    abstract findEventsById(id: number): Promise<TransactionRecordedEventPayload|undefined>
    abstract findEventsByCustomerId(customerId:number): Promise<TransactionRecordedEventPayload[]>

    
}