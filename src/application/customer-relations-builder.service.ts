import { CustomerRelationAggregate } from "./customer-relations.aggregate";
import { DeviceUsersAggregate } from "./device.users.aggregate";
import { TransactionRecordedEventStorage } from "./transaction.storage";

export class CustomerRelationsnBuilderService {
  constructor(private transactionRecordedEventStorage: TransactionRecordedEventStorage) { }

  async build(snapshots: Map<number, CustomerRelationAggregate>, transactionEvents: TransactionRecordedEventPayload[], deviceUsers: Map<string, DeviceUsersAggregate>) {
    for (const transactionEvent of transactionEvents) {

      const snapShot = snapshots.get(transactionEvent.customerId) ?? new CustomerRelationAggregate(transactionEvent.customerId)
      if (['P2P_SEND', 'P2P_RECEIVE'].includes(transactionEvent.transactionType) && transactionEvent.metadata.relatedTransactionId) {
        const relatedCustomerTransaction = await this.transactionRecordedEventStorage.findEventsById(transactionEvent.metadata.relatedTransactionId)
        if (relatedCustomerTransaction !== undefined) {
          snapShot.applyRelatedCustomerTransaction(relatedCustomerTransaction)
        }
      }
      snapshots.set(snapShot.customerId, snapShot)

      if(transactionEvent.metadata.deviceId){

        const deviceUserSet = deviceUsers.get(transactionEvent.metadata.deviceId)?.users??new Set()

        const deviceUserIds = [...deviceUserSet]

        for(const relatedUsierId of deviceUserIds){
          const relatedSnapshot= snapshots.get(relatedUsierId) ?? new CustomerRelationAggregate(relatedUsierId)
          relatedSnapshot.addRelatedDeviceUsers(transactionEvent, deviceUserIds)
          snapshots.set(relatedSnapshot.customerId, relatedSnapshot)
        }
      }
    }
    return snapshots
  }
}