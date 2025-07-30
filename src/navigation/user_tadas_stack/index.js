import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ROUTES} from '../../constants/routes';
import UserTadasListScreen from  '../../screens/Settings/user_tadas/UserTadasListScreen';
import UserTadasDetailScreen from '../../screens/Settings/user_tadas/UserTadasDetailScreen';


const {Navigator, Screen} = createNativeStackNavigator();

const UserTadasStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.user_ta_das_list}   
        component={UserTadasListScreen}
        options={{headerTitle: 'User TaDas list'}}
      />
      <Screen
        name={ROUTES.user_ta_das_detail}
        component={UserTadasDetailScreen}
        options={{headerTitle: 'User TaDas Detail'}}
      />
    </Navigator>
  );
};

export default UserTadasStack;
