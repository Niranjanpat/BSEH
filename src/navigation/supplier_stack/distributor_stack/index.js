import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DistributorListScreen from '../../../screens/Settings/suppliers/distributors/DistributorListScreen';
import {ROUTES} from '../../../constants/routes';
import DistributorDetailScreen from '../../../screens/Settings/suppliers/distributors/DistributorDetailScreen';
import EditHeaderButton from '../../../components/settings/supplier/EditHeaderButton';
import DistributorUpdateScreen from '../../../screens/Settings/suppliers/distributors/DistributorUpdateScreen';
import DistributorScreen from '../../../screens/Settings/suppliers/distributors/DistributorScreen';
import {StockUpdateStack} from '../StockUpdateStack';
import AddDistributorSchedule from '../../../screens/Settings/distributor_schedule/AddDistributorSchedule';
import DistributorVisitListScreen from '../../../screens/Settings/suppliers/distributors/DistributorVisitListScreen';
import DistributorScheduleListScreen from '../../../screens/Settings/distributor_schedule/DistributorScheduleListScreen';
import DistributorScheduleDetailsScreen from '../../../screens/Settings/distributor_schedule/DistributorScheduleDetailScreen';
import UpdateDistributorScheduleScreen from '../../../screens/Settings/distributor_schedule/UpdateDistributorSchedule';
import VisitedDistributorListScreen from '../../../screens/Settings/suppliers/distributors/VisitedDistributorListScreen';
import DistributorFeedBackScreen from '../../../screens/Settings/suppliers/distributors/DistributorFeedBackScreen';


const {Navigator, Screen} = createNativeStackNavigator();

export const DistributorStack = ({route}) => {
  const id = route.params?.id;
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.all_distributor}
        component={DistributorListScreen}
        options={{title: 'Distributors'}}
      />
      <Screen
        name={ROUTES.add_distributor_schedule}
        component={AddDistributorSchedule}
        options={{headerTitle: 'Add Distributor schedule'}}
      />
      <Screen
        name={ROUTES.distributor_schedule_list}
        component={DistributorScheduleListScreen}
        options={{headerTitle: 'Schedule list'}}
      />
       <Screen
        name={ROUTES.super_distributor_list}
        component={DistributorListScreen}
        options={{headerTitle: 'Super Distributor list'}}
      />
      <Screen
        name={ROUTES.distributor_schedule_details}
        component={DistributorScheduleDetailsScreen}
        options={{headerTitle: 'Schedule details'}}
      />
      <Screen
        name={ROUTES.update_distributor_schedule}
        component={UpdateDistributorScheduleScreen}
        options={{headerTitle: 'Update schedule'}}
      />

      <Screen
        name={ROUTES.distributor_visit}
        component={DistributorVisitListScreen}
        options={{title: 'Distributors Visit'}}
      />

      <Screen
        name={ROUTES.visited_distributor}
        component={VisitedDistributorListScreen}
        options={{title: 'Visited Distributor'}}
      />
       <Screen
        name={ROUTES.distributor_feedback}
        component={DistributorFeedBackScreen}
        options={{headerTitle: 'Distributor Feedback'}}
      />

      <Screen
        name={ROUTES.distributor_detail}
        component={DistributorDetailScreen}
        options={({route, navigation}) => ({
          title: route.params?.title ?? 'Distributor Detail',
          headerRight: () =>
            route.params?.data && Object.values(route.params?.data).length
              ? !id && (
                  <EditHeaderButton
                    onPress={() => {
                      navigation.navigate(ROUTES.distributor_update, {
                        title: route.params?.title ?? 'Distributor Update',
                        data: route.params?.data ?? '',
                        id: route.params?.id ?? '',
                      });
                    }}
                  />
                )
              : null,
        })}
      />

      <Screen
        name={ROUTES.distributor_update}
        component={DistributorUpdateScreen}
        options={({route}) => ({title: route.params?.title})}
      />

      <Screen
        name={ROUTES.stock_update_stack}
        component={StockUpdateStack}
        options={{headerShown: false}}
      />

    </Navigator>
  );
};
