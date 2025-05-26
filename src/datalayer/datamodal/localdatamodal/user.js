import Realm from 'realm';
import {schema} from '../schema';

export const UserSchema = {
  name: schema.USER,
  primaryKey: 'id',
  properties: {
    id: 'string',
    user: 'string',
    completed: 'bool',
  },
};

let userRealmInstance;

export const getUserRealmInstance = () => {
  if (!userRealmInstance) {
    userRealmInstance = new Realm({ schema: [UserSchema] });
  }
  return userRealmInstance;
};

export const cleanupRealm = () => {
  if (userRealmInstance) {
    userRealmInstance.close();
    userRealmInstance = null;
  }
}
