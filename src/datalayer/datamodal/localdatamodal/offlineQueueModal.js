import Realm from 'realm';

// Define Realm schema 
export const offlineQueueSchema = {
  name: 'pending_writes',
  primaryKey: 'id',
  properties: {
    id: 'string',
    schema: {type:'string', optional:true}
  },
};

let offlineRealmInstance;

export const getOfflineQueueRealmInstance = () => {
  if (!offlineRealmInstance) {
    offlineRealmInstance = new Realm({ schema: [offlineQueueSchema] });
  }
  return offlineRealmInstance;
};

export const cleanupOfflineRealm = () => {
  if (offlineRealmInstance) {
    offlineRealmInstance.close();
    offlineRealmInstance = null;
  }
}
