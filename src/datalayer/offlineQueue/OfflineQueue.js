
import {getOfflineQueueRealmInstance,cleanupOfflineRealm} from '../datamodal/localdatamodal/offlineQueueModal';

const PENDING_KEY = 'pending_writes';

export class OfflineQueue {
  static async savePendingWrite(id ,key) {
    const realm = getOfflineQueueRealmInstance();
    const exist = realm.objectForPrimaryKey(PENDING_KEY, id) || false ;
    if(!exist){
         realm.write(() => {
          realm.create(PENDING_KEY, {id:id});
        });
    }
    cleanupOfflineRealm();
  }

  static async savePendingQueue(queue) {
    queue.forEach( (item) => {
       this.savePendingWrite(item.id);
    });
  }


  static async getPendingWrites() {
    const realm = getOfflineQueueRealmInstance();
    const pendingWrites = realm.objects(PENDING_KEY);
    console.log('Pending writes:', pendingWrites);
    const writesArray = JSON.parse(JSON.stringify(pendingWrites));
    cleanupOfflineRealm();
    return writesArray;
  }

  static async clearPendingWrites() {
    const realm = getOfflineQueueRealmInstance();
    realm.deleteFile({ schema:PENDING_KEY });
    cleanupOfflineRealm();
  }
}
