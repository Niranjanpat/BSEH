import {
  getUserRealmInstance,
  cleanupRealm,
} from '../../datamodal/localdatamodal/user';
import NetInfo from '@react-native-community/netinfo';
import {
  getUserFromServer,
} from '../networkdatarepository/user';
import {OfflineQueue} from '../../offlineQueue/OfflineQueue';
import {mapExternalToLocal, mapExternalToNetwork} from '../usermapper';

const UserRepository = {
  addTodo: async externalUser => {
    const realm = getUserRealmInstance();
    const localUser = mapExternalToLocal(externalUser);
    const exist = realm.objectForPrimaryKey('User', id) || false;
    if (exist) {
      exist.user=externalUser.user;
      exist.completed=externalUser.completed;
    }else{
       realm.write(() => {
      realm.create('User', localUser);
    });
  }
    OfflineQueue.savePendingWrite(externalUser.id);
    console.log('[WRITE] Offline, queuing...');
    cleanupRealm();
  },

  getAllTodos: async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected && false) {
      try {
        getUserFromServer();
      } catch (err) {
        console.log('[READ] Failed to sync, fallback to local');
      }
    } else {
      const realm = getUserRealmInstance();
      console.log('Offline, reading from local DB');
      const localUser = realm.objects('User');
      const userArray = JSON.parse(JSON.stringify(localUser));
       cleanupRealm();
      return userArray;
    }
    cleanupRealm();
  },
};

export default UserRepository;
