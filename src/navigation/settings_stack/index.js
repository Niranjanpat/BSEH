import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ROUTES} from '../../constants/routes';
import OrderCartIcon from '../../components/OrderCartIcon';
import ReturnCartIcon from '../../components/ReturnCartIcon';

import MyVisitScreen from '../../screens/Settings/myvisits/MyVisitScreen';
import UpdateCustomerLocationScreen from '../../screens/Settings/myvisits/UpdateCustomerLocationScreen';
import MyVisitDetailsScreen from '../../screens/Settings/myvisits/MyVisitDetailsScreen';
import FeedBackScreen from '../../screens/Settings/myvisits/FeedBackScreen';
import ProductDetailScreen from '../../screens/Settings/myvisits/ProductDetailScreen';

// Order stacks
import VerticalListScreen from '../../screens/Settings/myvisits/VerticalListScreen';
import BrandListScreen from '../../screens/Settings/myvisits/BrandListScreen';
import ProductListScreen from '../../screens/Settings/myvisits/ProductListScreen';
import OrderCartScreen from '../../screens/Settings/myvisits/OrderCartScreen';
import CheckOutScreen from '../../screens/Settings/myvisits/CheckOutScreen';

// Return stacks
import ReturnVerticalListScreen from '../../screens/Settings/return_stack/ReturnVerticalListScreen';
import ReturnProductListScreen from '../../screens/Settings/return_stack/ReturnProductListScreen';
import ReturnBrandListScreen from '../../screens/Settings/return_stack/ReturnBrandListScreen';
import ReturnCartScreen from '../../screens/Settings/return_stack/ReturnCartScreen';
import ReturnCheckOutScreen from '../../screens/Settings/return_stack/ReturnCheckOutScreen';
import UserJointWorkList from '../../screens/Settings/joint_work_tracking/UserJointWorkList';
import UserJointWorkMap from '../../screens/Settings/joint_work_tracking/UserJointWorkMap';
import EditCustomerScreen from '../../screens/Settings/myvisits/EditCustomerScreen';
import OTPScreen from '../../screens/Settings/myvisits/OTPScreen';
import EditOwnerNumberScreen from '../../screens/Settings/myvisits/EditOwnerNumberScreen';
import PromoterProductsScreen from '../../screens/Settings/myvisits/promoter/PromoterProductsScreen';
import AddOrderScreen from '../../screens/Settings/myvisits/promoter/AddOrderScreen';
import AddSalesScreen from '../../screens/Settings/myvisits/promoter/AddSalesScreen';
import AddInvoiceScreen from '../../screens/Settings/myvisits/promoter/AddInvoiceScreen';
import AddPromoterStockScreen from '../../screens/Settings/myvisits/promoter/AddPromoterStockScreen';
import CustomerPromotionalItems from '../../screens/Settings/promotional_items/CustomerPromotionalItems';
import UserPromotionalItems from '../../screens/Settings/promotional_items/UserPromotionalItems';

//complaint
import ComplaintListScreen from '../../screens/Settings/complaints/ComplaintListScreen';
import AddComplaintScreen from '../../screens/Settings/complaints/AddComplaintScreen';
import ExpensesListScreen from '../../screens/Settings/expenses/ExpensesScreen';
import AddExpensesScreen from '../../screens/Settings/expenses/AddExpensesScreen';
import ExpenseDetailScreen from '../../screens/Settings/expenses/ExpenseDetailScreen';
import TaDasListScreen from '../../screens/Settings/tadas/TaDasListScreen';
import TaDasDetailScreen from '../../screens/Settings/tadas/TaDasDetailScreen';
import UserComplaintListScreen from '../../screens/Settings/user_complaint/UserComplaintListScreen';
import UserComplaintDetailScreen from '../../screens/Settings/user_complaint/UserComplaintDetailScreen';
import ComplaintDetailScreen from '../../screens/Settings/complaints/ComplaintDetailScreen';
import SampleCheckOutScreen from '../../screens/Settings/myvisits/SampleCheckOutScreen';
import UpdateComplaintScreen from '../../screens/Settings/user_complaint/UpdateComplaintScreen';

const {Navigator, Screen} = createNativeStackNavigator();

export const MyVisitStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.myvisit}
        component={MyVisitScreen}
        options={{title: 'My Visits'}}
      />
      <Screen
        name={ROUTES.edit_customer_location}
        component={UpdateCustomerLocationScreen}
        options={({route}) => {
          const title = route.params?.title || 'Customer';

          return {title: `Edit ${title}`};
        }}
      />
      <Screen
        name={ROUTES.edit_customer}
        component={EditCustomerScreen}
        options={({route}) => {
          const title = route.params?.title || 'Customer';

          return {title: `Edit ${title}`};
        }}
      />
      <Screen
        name={ROUTES.myvisit_details}
        component={MyVisitDetailsScreen}
        options={({route}) => ({
          title: route.params?.title || 'My Visit Details',
        })}
      />
      <Screen
        name={ROUTES.vertical}
        component={VerticalListScreen}
        options={{
          title: 'Vertical List',
        }}
      />
      <Screen
        name={ROUTES.brand}
        component={BrandListScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Brand List',
        })}
      />
      <Screen
        name={ROUTES.product}
        component={ProductListScreen}
        options={({route}) => ({
          title:
            route.params?.channel === 'sample' ? 'Sample List' : 'Product List',
          headerRight: () => <OrderCartIcon />,
        })}
      />
      <Screen
        name={ROUTES.product_detail}
        component={ProductDetailScreen}
        options={({route}) => ({
          title: 'Sample Detail',
        })}
      />
      <Screen
        name={ROUTES.sample_checkout}
        component={SampleCheckOutScreen}
        options={{
          title: 'Confirm items & proceed',
        }}
      />
      <Screen
        name={ROUTES.order_cart}
        component={OrderCartScreen}
        options={{
          title: 'Cart Details',
        }}
      />
      <Screen
        name={ROUTES.order_checkout}
        component={CheckOutScreen}
        options={{
          title: 'Confirm items & proceed',
        }}
      />
      <Screen
        name={ROUTES.feedback}
        component={FeedBackScreen}
        options={{
          title: 'Feedback',
        }}
      />
      <Screen
        options={{headerShown: false}}
        name={ROUTES.return_stack}
        component={ReturnOrderStack}
      />
      <Screen
        name={ROUTES.verify_otp}
        component={OTPScreen}
        options={{
          title: 'Verify OTP',
        }}
      />
      <Screen
        name={ROUTES.owner_number}
        component={EditOwnerNumberScreen}
        options={{
          title: 'Edit owner number',
        }}
      />
      <Screen
        name={ROUTES.promoter_products}
        component={PromoterProductsScreen}
        options={() => ({
          title: 'Product List',
        })}
      />
      <Screen
        name={ROUTES.add_promoter_order}
        component={AddOrderScreen}
        options={() => ({
          title: 'Order details',
        })}
      />
      <Screen
        name={ROUTES.add_promoter_sales}
        component={AddSalesScreen}
        options={() => ({
          title: 'Add sales details',
        })}
      />
      <Screen
        name={ROUTES.add_promoter_invoice}
        component={AddInvoiceScreen}
        options={() => ({
          title: 'Invoice details',
        })}
      />
      <Screen
        name={ROUTES.add_promoter_stock}
        component={AddPromoterStockScreen}
        options={() => ({
          title: 'Add closing stock',
        })}
      />
      <Screen
        name={ROUTES.complaint}
        component={AddComplaintScreen}
        options={() => ({
          title: 'Add Complaint',
        })}
      />
      <Screen
        name={ROUTES.customer_promotional_items}
        component={CustomerPromotionalItems}
        options={() => ({
          title: 'Customer Promotional Items',
        })}
      />
      <Screen
        name={ROUTES.user_promotional_items}
        component={UserPromotionalItems}
        options={() => ({
          title: 'Promotional Items',
          headerRight: () => <OrderCartIcon />,
        })}
      />
    </Navigator>
  );
};
export const JointTrackingStack = () => {
  return (
    <Navigator
      screenOptions={{animation: 'slide_from_right'}}
      initialRouteName={ROUTES.joint_work_list}>
      <Screen
        name={ROUTES.joint_work_list}
        component={UserJointWorkList}
        options={{
          title: 'Joint Work List',
          headerShown: false,
        }}
      />
      <Screen
        name={ROUTES.joint_work_map}
        component={UserJointWorkMap}
        options={{
          title: 'Joint Work Map',
        }}
      />
    </Navigator>
  );
};
const ReturnOrderStack = () => {
  return (
    <Navigator
      screenOptions={{animation: 'slide_from_right'}}
      initialRouteName={ROUTES.return_vertical}>
      <Screen
        name={ROUTES.return_vertical}
        component={ReturnVerticalListScreen}
        options={{
          title: 'Vertical List',
          headerRight: () => <ReturnCartIcon />,
        }}
      />

      <Screen
        name={ROUTES.return_brand}
        component={ReturnBrandListScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Brand List',
          headerRight: () => <ReturnCartIcon />,
        })}
      />

      <Screen
        name={ROUTES.return_products}
        component={ReturnProductListScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Product List',
          headerRight: () => <ReturnCartIcon />,
        })}
      />

      <Screen
        name={ROUTES.return_cart}
        component={ReturnCartScreen}
        options={{
          title: 'Return Cart Details',
        }}
      />

      <Screen
        name={ROUTES.return_checkout}
        component={ReturnCheckOutScreen}
        options={{
          title: 'Confirm return items & proceed',
        }}
      />
    </Navigator>
  );
};

export const ComplaintStack = () => {
  return (
    <Navigator
      initialRouteName={ROUTES.complaint}
      screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.complaint}
        component={ComplaintListScreen}
        options={{
          title: 'Complaints',
        }}
      />
      <Screen
        name={ROUTES.add_complaint}
        component={AddComplaintScreen}
        options={{
          title: 'Add Complaints',
        }}
      />
      <Screen
        name={ROUTES.complaint_detail}
        component={ComplaintDetailScreen}
        options={{
          title: 'Complaint Detail',
        }}
      />
      <Screen
        name={ROUTES.update_complaint}
        component={AddComplaintScreen}
        options={{
          title: 'Update Compliants',
        }}
      />
    </Navigator>
  );
};

export const ExpenseStack = () => {
  return (
    <Navigator
      initialRouteName={ROUTES.expenses}
      screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.expenses}
        component={ExpensesListScreen}
        options={{
          title: 'Expenses',
        }}
      />
      <Screen
        name={ROUTES.add_expenses}
        component={AddExpensesScreen}
        options={{
          title: 'Add Expenses',
        }}
      />
      <Screen
        name={ROUTES.update_complaint}
        component={AddExpensesScreen}
        options={{
          title: 'Update Expenses',
        }}
      />
      <Screen
        name={ROUTES.expenses_detail}
        component={ExpenseDetailScreen}
        options={{
          title: 'Expense Detail',
        }}
      />
    </Navigator>
  );
};

export const TaDasStack = () => {
  return (
    <Navigator
      initialRouteName={ROUTES.ta_das}
      screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.ta_das}
        component={TaDasListScreen}
        options={{
          title: 'TaDas',
        }}
      />
      <Screen
        name={ROUTES.ta_das_detail}
        component={TaDasDetailScreen}
        options={{
          title: 'TaDas Detail',
        }}
      />
    </Navigator>
  );
};

export const UserComplaintStack = () => {
  return (
    <Navigator
      initialRouteName={ROUTES.user_complaint}
      screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.user_complaint}
        component={UserComplaintListScreen}
        options={{
          title: 'Sub-Ordinate Complaints',
        }}
      />
      <Screen
        name={ROUTES.update_user_complaint}
        component={UpdateComplaintScreen}
        options={{
          title: 'Update Sub-Ordinate Complaints',
        }}
      />
      <Screen
        name={ROUTES.detail_user_complaint}
        component={UserComplaintDetailScreen}
        options={{
          title: 'Sub-Ordinate Complaint Detail',
        }}
      />
    </Navigator>
  );
};
