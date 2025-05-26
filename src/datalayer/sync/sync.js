import NetInfo from '@react-native-community/netinfo';
import {mapExternalToNetwork} from '../repository/usermapper';
import {OfflineQueue} from '../offlineQueue/OfflineQueue';
import {pushUserToServer} from '../repository/networkdatarepository/user';
import {cleanupRealm, getUserRealmInstance} from '../datamodal/localdatamodal/user';

export const trySync = async () => {
  console.log('Syncing...');
  const state = await NetInfo.fetch();
  const queue =await OfflineQueue.getPendingWrites();
  console.log('Pending queue:',queue);
  const realm = getUserRealmInstance();
  if (state.isConnected && queue.length > 0 && false) {
    for (let i = queue.length - 1; i >= 0; i--) {
      const id = queue[i].id;
      const pendingWrite = realm.objectForPrimaryKey('User', id);
      const  externalTodo= JSON.parse(JSON.stringify(pendingWrite));
      const networkTodo = mapExternalToNetwork(externalTodo);
     try {
        await pushUserToServer(networkTodo);
        queue.splice(i, 1);
      } catch (err) {
        console.log('[WRITE] Sync failed, retrying...');
        await OfflineQueue.savePendingQueue(queue);
        break;
      }
    }
    await OfflineQueue.savePendingQueue(queue); // Should be empty now
  } else {
    console.log(' Offline, skipping sync');
  } 
  cleanupRealm();
};
