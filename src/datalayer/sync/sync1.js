import NetInfo from '@react-native-community/netinfo';
import Realm from 'realm';
import {mapExternalToNetwork} from '../repository/visitmapper';
import {OfflineQueue} from '../offlineQueue/OfflineQueue';
import {pushUserToServer} from '../repository/networkdatarepository/user';
import {executeSaveFunction} from  './networkcall';

export const trySync = async () => {
  console.log('Syncing...');
  const state = await NetInfo.fetch();
  const queue =await OfflineQueue.getPendingWrites();
  console.log('Pending queue:',queue);
  if (state.isConnected && queue.length > 0 && false) {
    for (let i = queue.length - 1; i >= 0; i--) {
      const id = queue[i].id;
      const key =queue[i].schema;
      const RealmInstance=new Realm({ schema: [key] });
      const pendingWrite = RealmInstance.objectForPrimaryKey(key, id);
      const  externalTodo= JSON.parse(JSON.stringify(pendingWrite));
      const networkTodo = mapExternalToNetwork.key(externalTodo);
     try {
        await executeSaveFunction(key,networkTodo);
        queue.splice(i, 1);
      } catch (err) {
        console.log('[WRITE] Sync failed, retrying...');
        await OfflineQueue.savePendingQueue(queue);
        break;
      }
      RealmInstance.close();
    }
    await OfflineQueue.savePendingQueue(queue); // Should be empty now
  } else {
    console.log(' Offline, skipping sync');
  } 
};
