import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../../constants/routes';
import ProductListStockUpdate from '../../screens/Settings/suppliers/stock_update/ProductListStockUpdate';
import StockUpdateCartIcon from '../../components/StockUpdateCartIcon';
import StockUpdateCartScreen from '../../screens/Settings/suppliers/stock_update/StockUpdateCartScreen';
import ViewProductStockScreen from '../../screens/Settings/suppliers/stock_update/ViewProductStockScreen';
import BrandListScreen from '../../screens/Settings/myvisits/BrandListScreen';

const {Navigator, Screen} = createNativeStackNavigator();

export const StockUpdateStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.brand}
        component={BrandListScreen}
        options={({route}) => ({
          title: route.params?.data?.name ||    'Brand List',
        })}
      />

      <Screen
        name={ROUTES.product_list_stock_update}
        component={ProductListStockUpdate}
        options={({route}) => ({
          title: route.params?.data?.name || 'Product List',
          headerRight: () => <StockUpdateCartIcon />,
        })}
      />

      <Screen
        name={ROUTES.stock_update_cart}
        component={StockUpdateCartScreen}
        options={{
          title: 'Stock Update Details',
        }}
      />

      <Screen
        name={ROUTES.view_stock}
        component={ViewProductStockScreen}
        options={{
          title: 'Product Stocks',
        }}
      />
    </Navigator>
  );
};
