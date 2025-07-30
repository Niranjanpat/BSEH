import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ROUTES} from '../../constants/routes';
import UserExpenseDetailScreen from '../../screens/Settings/user_expense/UserExpenseDetailScreen';
import UserExpenseListScreen from '../../screens/Settings/user_expense/UserExpenseListScreen';


const {Navigator, Screen} = createNativeStackNavigator();

const UserExpenseStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.user_expense_list}   
        component={UserExpenseListScreen}
        options={{headerTitle: 'User Expense list'}}
      />
      <Screen
        name={ROUTES.user_expense_detail}
        component={UserExpenseDetailScreen}
        options={{headerTitle: 'User Expense Detail'}}
      />
    </Navigator>
  );
};

export default UserExpenseStack;
