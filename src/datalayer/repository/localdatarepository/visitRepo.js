import Realm from 'realm';
import {OfflineQueue} from '../../offlineQueue/OfflineQueue';
import {mapExternalToLocal, mapExternalToNetwork} from '../visitmapper';
import {getSchemaByKey} from './getschema';

const VisitRepository = {
  addVisitData: async (externalUser, key) => {
    const RealmInstance = new Realm({schema: [getSchemaByKey(key)]});
    const localUser = mapExternalToLocal.key(externalUser);
      RealmInstance.write(() => {
        RealmInstance.create(key, localUser);
      });
    OfflineQueue.savePendingWrite(externalUser.id);
    console.log('[WRITE] Offline, queuing...');
    RealmInstance.close();
  },

  getAllVisitData: async key => {
    const RealmInstance = new Realm({schema: [getSchemaByKey(key)]});
    console.log('Offline, reading from local DB');
    const localData = RealmInstance.objects(key);
    const userArray = JSON.parse(JSON.stringify(localData));
    RealmInstance.close();
    return userArray;
  },

  deleteVisitData: async (id, key) => {
    const RealmInstance = new Realm({schema: [getSchemaByKey(key)]});
    const exist = RealmInstance.objectForPrimaryKey(key, id) || false;
    if (exist) {
      RealmInstance.write(() => {
        RealmInstance.delete(exist);
      });
    }
    OfflineQueue.deletePendingWrite(id, key);
    RealmInstance.close();
  },

  updateVisitData: async (externalUser, key) => {
    const RealmInstance = new Realm({schema: [getSchemaByKey(key)]});
    const localUser = mapExternalToLocal.key(externalUser);
    const exist = RealmInstance.objectForPrimaryKey(key, id) || false;
    if (exist) {
      RealmInstance.write(() => {
        for (const key in exist) {
          if (Object.prototype.hasOwnProperty.call(localUser, key)) {
            localUser[key] = exist[key];
          } else {
            console.warn(`'${key}' not in schema '${schemaName}'`);
          }
        }
      });
    } else {
      console.log('No data found to update');
    }
    OfflineQueue.updatePendingWrite(externalUser.id, key);
    RealmInstance.close();
  },
};

export default VisitRepository;
