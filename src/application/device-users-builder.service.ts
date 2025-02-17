import { CustomerRelationAggregate } from "./customer-relations.aggregate";
import { DeviceUsersAggregate } from "./device.users.aggregate";
import { TransactionRecordedEventStorage } from "./transaction.storage";

export class DeviceUsersBuilderService {

  static async build(snapshots: Map<string, DeviceUsersAggregate>, transactionEvents: TransactionRecordedEventPayload[]) {
    for (const transactionEvent of transactionEvents) {
      if (!transactionEvent.metadata.deviceId) {
        continue
      }
      const snapshot = snapshots.get(transactionEvent.metadata.deviceId) ?? new DeviceUsersAggregate(transactionEvent.metadata.deviceId)
      snapshot.apply(transactionEvent)
      snapshots.set(snapshot.devideId, snapshot)
    }
    return snapshots
  }
}