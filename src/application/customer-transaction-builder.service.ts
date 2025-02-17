import { TransactionAggregate } from "./transaction.aggregate";

export class CustomerTransactionBuilder {

    static build(snapshots: Map<number, TransactionAggregate>, transactionEvents: TransactionRecordedEventPayload[]) {
        for (const transactionEvent of transactionEvents) {

            let snapshot: TransactionAggregate | undefined = snapshots.get(transactionEvent.transactionId);
            if (!['P2P_SEND', 'P2P_RECEIVE'].includes(transactionEvent.transactionType) && transactionEvent.metadata.relatedTransactionId !== undefined) {
                const relatedTransactionId = transactionEvent.metadata.relatedTransactionId
                snapshot = snapshots.get(relatedTransactionId) ?? [...snapshots.values()].find(aggregate => aggregate.timeline.some(relatedTransaction => relatedTransaction.transactionId === relatedTransactionId))
            }

            if (snapshot === undefined) {
                snapshot = new TransactionAggregate(transactionEvent.transactionId)
            }
            snapshot.apply(transactionEvent)
            snapshots.set(snapshot.transactionId, snapshot)

        }
        return snapshots
    }
}