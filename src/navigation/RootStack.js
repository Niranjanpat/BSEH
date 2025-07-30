import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InvoiceDetailScreen from '../screens/Activity/Today/Invoice/InvoiceDetailScreen';
import InvoiceOrderScreen from '../screens/Activity/Today/InvoiceOrderScreen';
import OrderDetail from '../screens/Activity/Today/Order/OrderDetail';
import UpdateOrder from '../screens/Activity/Today/Order/UpdateOrder';
import OrderScreen from '../screens/Activity/Today/OrderScreen';
import RouteMapScreen from '../screens/Activity/Today/RouteMapScreen';
import SaleReturnDetail from '../screens/Activity/Today/SaleReturn/SaleReturnDetail';
import SalesReturn from '../screens/Activity/Today/SalesReturn';
import TotalVisitedDetail from '../screens/Activity/Today/TotalVisited/TotalVisitedDetail';
import TotalVisitedScreen from '../screens/Activity/Today/TotalVisitedScreen';
import WeeklyInvoiceOrderScreen from '../screens/Activity/Weekly/WeeklyInvoiceOrderScreen';
import WeeklyOrderScreen from '../screens/Activity/Weekly/WeeklyOrderScreen';
import WeeklyRouteMapScreen from '../screens/Activity/Weekly/WeeklyRouteMapScreen';
import WeeklySalesReturn from '../screens/Activity/Weekly/WeeklySalesReturn';
import WeeklyTotalVisitedScreen from '../screens/Activity/Weekly/WeeklyTotalVisitedScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AddShop from '../screens/AddShop';
import AttendanceScreen from '../screens/Home/AttendanceScreen';
import AttendanceDetail from '../screens/Home/Attendance/AttendanceDetail';
import HomeScreen from '../screens/Home/HomeScreen';
import RetailerMaster from '../screens/RetailerMaster/RetailerMaster';
import RetailerMasterDetailScreen from '../screens/RetailerMaster/RetailerMasterDetailsScreen';
import AboutPalanjali from '../screens/Settings/AboutPatanjali';
import ProfileScreen from '../screens/Settings/ProfileScreen';
import SettingScreen from '../screens/Settings/SettingScreen';
import {PerformanceStack} from './performance_stack';
import {TrackingStack} from './tracking_stack';
import {UserHierarchyStack} from './user_hierarchy_stack';
import VerticalListScreen from '../screens/Settings/myvisits/VerticalListScreen';
import BrandListScreen from '../screens/Settings/myvisits/BrandListScreen';
import ProductListScreen from '../screens/Settings/myvisits/ProductListScreen';
import ProductDetailScreen from '../screens/Settings/myvisits/ProductDetailScreen';
import {ROUTES} from '../constants/routes';
import UpdateProfileScreen from '../screens/Settings/UpdateProfileScreen';
import AboutUs from '../screens/Settings/AboutUs';
import JointWorkScreen from '../screens/Home/JointWorkScreen';
import JWMyVisitDetailScreen from '../screens/Settings/joint_work_myvisits/JWMyVisitDetailScreen';
import JWMyVisitsScreen from '../screens/Settings/joint_work_myvisits/JWMyVisitsScreen';
import JWRoutescreen from '../screens/Settings/joint_work_myvisits/JWRoutesScreen';
import JWFeedbackScreen from '../screens/Settings/joint_work_myvisits/JWFeedBackScreen';
import {
  ExpenseStack,
  JointTrackingStack,
  UserComplaintStack,
} from './settings_stack';
import EditCustomerScreen from '../screens/Settings/myvisits/EditCustomerScreen';
import TodayReportScreen from '../screens/Settings/TodayReportScreen';
import DayCumulativeReportScreen from '../screens/Settings/DayCumulativeReportScreen';
import CumulativeReportScreen from '../screens/Settings/CumulativeReportScreen';
import KamMtdReportScreen from '../screens/Settings/KamMtdReportScreen';
import DayWiseReportScreen from '../screens/Settings/DayWiseReportScreen';
import PromoterProductsScreen from '../screens/Settings/myvisits/promoter/PromoterProductsScreen';
import JointWorkListScreen from '../screens/Settings/JointWorkListScreen';
import RouteScheduleStack from './RouteScheduleStack';
import UserRouteScheduleListScreen from '../screens/Settings/UserRouteScheduleListScreen';
import CheckOutScreen from '../screens/Settings/myvisits/CheckOutScreen';
import OrderCartScreen from '../screens/Settings/myvisits/OrderCartScreen';
import MonthlyTravelDistance from '../screens/Settings/MonthlyTravelDistance';
import MonthAttendanceScreen from '../screens/Settings/MonthlyAttendanceScreen';
import {ComplaintStack} from './settings_stack/index';
import AddComplaintScreen from '../screens/Settings/complaints/AddComplaintScreen';
import {TaDasStack} from './settings_stack';
import DailyAttendacesListScreen from '../screens/Settings/daily_attendance';
import { SampleStack } from './sample_stack';
import SampleCheckOutScreen from '../screens/Settings/myvisits/SampleCheckOutScreen';
import { DistributorStackNavigation } from './supplier_stack';
import UserDistributorScheduleStack from './UserDistributorScheduleStack';
import UserExpenseStack from './user_expense_stack';
const SettingsStack = createNativeStackNavigator();   
export const SettingsStackNavigation = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingsStack.Screen name="SettingScreen" component={SettingScreen} />
      <SettingsStack.Screen name="AboutPatanjali" component={AboutPalanjali} />
      <SettingsStack.Screen name={ROUTES.aboutus} component={AboutUs} />
      <SettingsStack.Screen
        name="AttendanceScreen"
        component={AttendanceScreen}
      />
      <SettingsStack.Screen
        name="AttendanceDetail"
        component={AttendanceDetail}
      />

      <SettingsStack.Screen
        name={ROUTES.monthly_attendance_travel}
        component={MonthlyTravelDistance}
      />

      <SettingsStack.Screen
        name={ROUTES.monthly_attendance}
        component={MonthAttendanceScreen}
      />

      <SettingsStack.Screen name={ROUTES.profile} component={ProfileScreen} />

      <SettingsStack.Screen
        options={{headerShown: true, title: 'Update profile'}}
        name={ROUTES.update_profile}
        component={UpdateProfileScreen}
      />

      <SettingsStack.Screen
        options={{headerShown: false}}
        name={ROUTES.joint_stack}
        component={JointTrackingStack}
      />

      <SettingsStack.Screen
        name={ROUTES.retailer_master}
        component={RetailerStackNavigation}
      />
      <SettingsStack.Screen
        name={ROUTES.my_joint_work}
        component={JointWorkListScreen}
        options={{headerShown: false, headerTitle: 'Joint work list'}}
      />
      <SettingsStack.Screen
        name={ROUTES.tracking_stack}
        component={TrackingStack}
      />
      <SettingsStack.Screen
        name={ROUTES.performance}
        component={PerformanceStack}
      />
      <SettingsStack.Screen
        name={ROUTES.user_hierarchy_stack}
        component={UserHierarchyStack}
      />
      <SettingsStack.Screen
        name={ROUTES.jw_myvisits_stack}
        component={JWMyVisitsNavigation}
      />
      <SettingsStack.Screen
        name={ROUTES.today_report}
        options={{title: "Today's Report", headerShown: true}}
        component={TodayReportScreen}
      />
      <SettingsStack.Screen
        name={ROUTES.cumulative_report}
        options={{title: 'Cumulative Report', headerShown: true}}
        component={CumulativeReportScreen}
      />
      <SettingsStack.Screen
        name={ROUTES.kam_mtd}
        options={{title: 'MTD report', headerShown: true}}
        component={KamMtdReportScreen}
      />
      <SettingsStack.Screen
        name={ROUTES.day_wise_cumulative}
        options={{title: 'Cumulative Report', headerShown: true}}
        component={DayCumulativeReportScreen}
      />
      <SettingsStack.Screen
        name={ROUTES.day_wise_report}
        options={{title: 'Compliance Report', headerShown: true}}
        component={DayWiseReportScreen}
      />
      <SettingsStack.Screen
        name={ROUTES.route_schedule_stack}
        component={RouteScheduleStack}
      />
      <SettingsStack.Screen
        name={ROUTES.user_route_schedule_list}
        component={UserRouteScheduleListScreen}
        options={{title: 'Sub-Ordinate Schedules', headerShown: true}}
      />

      <SettingsStack.Screen
        name={ROUTES.expense_stack}
        component={ExpenseStack}
      />
      
      <SettingsStack.Screen
        name={ROUTES.user_expense_stack}
        component={UserExpenseStack}
      />

      <SettingsStack.Screen
        name={ROUTES.complaint_stack}
        component={ComplaintStack}
      />
      
      <SettingsStack.Screen
        name={ROUTES.distributor_stack}
        component={DistributorStackNavigation}
      />

      <SettingsStack.Screen
        name={ROUTES.user_distributor_schedule_stack}
        component={UserDistributorScheduleStack}
      />


      <SettingsStack.Screen
        name={ROUTES.user_complaint_stack}
        component={UserComplaintStack}
      />

      <SettingsStack.Screen name={ROUTES.ta_das_stack} component={TaDasStack} />
       <SettingsStack.Screen name={ROUTES.sample_stack} component={SampleStack} />

      <SettingsStack.Screen name={ROUTES.daily_attendance} component={DailyAttendacesListScreen} />

    </SettingsStack.Navigator>
  );
};

const AddShops = createNativeStackNavigator();
export const AddShopNavigation = () => {
  return (
    <AddShops.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AddShops.Screen name="AddShopScreen" component={AddShop} />
    </AddShops.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();
export const HomeStackNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="AttendanceScreen" component={AttendanceScreen} />
      <HomeStack.Screen name="AttendanceDetail" component={AttendanceDetail} />
      <HomeStack.Screen
        options={{headerShown: true, title: 'Joint Work'}}
        name={ROUTES.joint_work}
        component={JointWorkScreen}
      />
    </HomeStack.Navigator>
  );
};

const RetailerStack = createNativeStackNavigator();
export const RetailerStackNavigation = () => {
  return (
    <RetailerStack.Navigator>
      <RetailerStack.Screen
        options={{title: 'Retailer masters'}}
        name="RetailerMasters"
        component={RetailerMaster}
      />
      <RetailerStack.Screen
        options={{
          headerShown: false,
        }}
        name={ROUTES.retailer_detail}
        component={RetailerMasterDetailScreen}
      />
      <RetailerStack.Screen
        name={ROUTES.edit_customer}
        component={EditCustomerScreen}
        options={({route}) => {
          const title = route.params?.title || 'Customer';

          return {title: `Edit ${title}`};
        }}
      />
      <RetailerStack.Screen
        name={ROUTES.vertical}
        component={VerticalListScreen}
        options={{
          title: 'Vertical List',
        }}
      />
      <RetailerStack.Screen
        name={ROUTES.brand}
        component={BrandListScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Brand List',
        })}
      />
      <RetailerStack.Screen
        name={ROUTES.product}
        component={ProductListScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Product List',
        })}
      />
      <RetailerStack.Screen
        name={ROUTES.product_detail}
        component={ProductDetailScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Product Detail',
        })}
      />
      <RetailerStack.Screen
        name={ROUTES.order_cart}
        component={OrderCartScreen}
        options={{
          title: 'Cart Details',
        }}
      />
         <RetailerStack.Screen
        name={ROUTES.sample_checkout}
        component={SampleCheckOutScreen}
        options={{
          title: 'Confirm items & proceed',
        }}
      />
      <RetailerStack.Screen
        name={ROUTES.order_checkout}
        component={CheckOutScreen}
        options={{
          title: 'Confirm items & proceed',
        }}
      />
      <RetailerStack.Screen
        name={ROUTES.add_complaint}
        component={AddComplaintScreen}
        options={{title: 'Add Complaint', headerShown: true}}
      />
    </RetailerStack.Navigator>
  );
};

const ActivityStack = createNativeStackNavigator();
export const ActivityStackNavigation = () => {
  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen
        name="ActivityScreen"
        options={{headerShown: false}}
        component={ActivityScreen}
      />
      <ActivityStack.Screen
        name={ROUTES.invoice_order}
        component={InvoiceOrderScreen}
        options={({route, navigation}) => ({
          title: 'Invoice Order',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.invoice_detail}
        component={InvoiceDetailScreen}
        options={({route, navigation}) => ({
          title: 'Invoice Detail',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.order_screeen}
        component={OrderScreen}
        options={({route, navigation}) => ({
          title: 'Order List',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.route_map}
        component={RouteMapScreen}
        options={({route, navigation}) => ({
          title: 'Route Map',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.sales_return}
        component={SalesReturn}
        options={({route, navigation}) => ({
          title: 'Sales Return',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.sales_return_detail}
        component={SaleReturnDetail}
        options={({route, navigation}) => ({
          title: 'Sales Return Detail',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.total_visited}
        component={TotalVisitedScreen}
        options={({route, navigation}) => ({
          title: 'Total Visited',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.weekly_invoice_order}
        component={WeeklyInvoiceOrderScreen}
        options={({route, navigation}) => ({
          title: 'Weekly Invoice Order',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.weekly_sales_return}
        component={WeeklySalesReturn}
        options={({route, navigation}) => ({
          title: 'Weekly Sales Return',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.weekly_order}
        component={WeeklyOrderScreen}
        options={({route, navigation}) => ({
          title: 'Weekly Order',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.weekly_route_map}
        component={WeeklyRouteMapScreen}
        options={({route, navigation}) => ({
          title: 'Weekly Route Map',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.weekly_total_visited}
        component={WeeklyTotalVisitedScreen}
        options={({route, navigation}) => ({
          title: 'Weekly Total Visited',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.order_detail}
        component={OrderDetail}
        options={({route, navigation}) => ({
          title: 'Order Detail',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.update_order}
        component={UpdateOrder}
        options={({route, navigation}) => ({
          title: 'Update Order',
        })}
      />
      <ActivityStack.Screen
        name={ROUTES.total_visit_detail}
        component={TotalVisitedDetail}
        options={({route, navigation}) => ({
          title: 'Total Visited Detail',
        })}
      />

      <ActivityStack.Screen
        name={ROUTES.vertical}
        component={VerticalListScreen}
        options={{
          title: 'Vertical List',
        }}
      />

      <ActivityStack.Screen
        name={ROUTES.brand}
        component={BrandListScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Brand List',
        })}
      />

      <ActivityStack.Screen
        name={ROUTES.product}
        component={ProductListScreen}
        options={({route}) => ({
          title: route.params?.data?.name || 'Product List',
        })}
      />
    </ActivityStack.Navigator>
  );
};

const JWMyVisitsStack = createNativeStackNavigator();
export const JWMyVisitsNavigation = () => {
  return (
    <JWMyVisitsStack.Navigator>
      <JWMyVisitsStack.Screen
        options={{title: 'Joint Routes'}}
        name={ROUTES.jw_routes}
        component={JWRoutescreen}
      />
      <JWMyVisitsStack.Screen
        options={{title: 'Joint Visits'}}
        name={ROUTES.jw_myvisits}
        component={JWMyVisitsScreen}
      />
      <JWMyVisitsStack.Screen
        options={{title: 'Joint Visit Details'}}
        name={ROUTES.jw_myvisits_detail}
        component={JWMyVisitDetailScreen}
      />
      <JWMyVisitsStack.Screen
        options={{title: 'Joint Visit Feedback'}}
        name={ROUTES.jw_feedback}
        component={JWFeedbackScreen}
      />

      <JWMyVisitsStack.Screen
        name={ROUTES.edit_customer}
        component={EditCustomerScreen}
        options={({route}) => {
          const title = route.params?.title || 'Customer';

          return {title: `Edit ${title}`};
        }}
      />
    </JWMyVisitsStack.Navigator>
  );
};
