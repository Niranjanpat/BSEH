import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../../../constants/routes';
import SuperStockistListScreen from '../../../screens/Settings/suppliers/super_stockist/SuperStockistListScreen';
import SuperStockistDetailScreen from '../../../screens/Settings/suppliers/super_stockist/SuperStockistDetailScreen';
import SuperStockistUpdateScreen from '../../../screens/Settings/suppliers/super_stockist/SuperStockistUpdateScreen';
import {IconButton} from 'react-native-paper';
import EditHeaderButton from '../../../components/settings/supplier/EditHeaderButton';
import { StockUpdateStack } from '../StockUpdateStack';

const {Navigator, Screen} = createNativeStackNavigator();

export const SuperStockistStack = ({route}) => {
  const id = route.params?.id;
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.super_stockist_list}
        component={SuperStockistListScreen}
        options={{title: 'Super Stockists'}}
        initialParams={{id}}
      />
      <Screen
        name={ROUTES.super_stockist_detail}
        component={SuperStockistDetailScreen}
        options={({route, navigation}) => ({
          title: route.params?.title ?? 'Super Stockist Detail',
          headerRight: () =>
            route.params?.data && Object.values(route.params?.data).length ? !id && (
              <EditHeaderButton
                onPress={() =>
                  navigation.navigate(ROUTES.super_stockist_update, {
                    title: route.params?.title ?? 'Update',
                    data: route.params?.data ?? '',
                    id: route.params?.id ?? '',
                  })
                }
              />
            ) : null,
        })}
      />
      <Screen
        name={ROUTES.super_stockist_update}
        component={SuperStockistUpdateScreen}
        options={({route}) => ({
          title: route.params?.title ?? 'Super Stockist Update',
        })}
      />

      <Screen
        name={ROUTES.stock_update_stack}
        component={StockUpdateStack}
        options={{headerShown: false}}
      />
    </Navigator>
  );
};
