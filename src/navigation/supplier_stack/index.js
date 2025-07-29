import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DistributorScreen from '../../screens/Settings/suppliers/SupplierListScreen';
import {ROUTES} from '../../constants/routes';
import { BeatInformationStack } from './beat_info_stack';
import DistributorUpdateScreen from '../../screens/Settings/suppliers/distributors/DistributorUpdateScreen';
import DistributorDetailScreen from '../../screens/Settings/suppliers/distributors/DistributorDetailScreen';
import DistributorFeedBackScreen from '../../screens/Settings/suppliers/distributors/DistributorFeedBackScreen';
import VisitedDistributorListScreen from '../../screens/Settings/suppliers/distributors/VisitedDistributorListScreen';
import UpdateDistributorScheduleScreen from '../../screens/Settings/distributor_schedule/UpdateDistributorSchedule';
import DistributorScheduleDetailsScreen from '../../screens/Settings/distributor_schedule/DistributorScheduleDetailScreen';
import DistributorListScreen from '../../screens/Settings/suppliers/distributors/DistributorListScreen';
import DistributorScheduleListScreen from '../../screens/Settings/distributor_schedule/DistributorScheduleListScreen';
import AddDistributorSchedule from '../../screens/Settings/distributor_schedule/AddDistributorSchedule';
import DistributorVisitListScreen from '../../screens/Settings/suppliers/distributors/DistributorVisitListScreen';

const {Navigator, Screen} = createNativeStackNavigator();

export const DistributorStackNavigation = ({route}) => {
  const id = route.params?.id;

  return (
    <Navigator
      initialRouteName={ROUTES.distributor_list}
      screenOptions={{animation: 'slide_from_right', headerShown: true}}>
      <Screen
        name={ROUTES.distributor_list}
        component={DistributorScreen}
        options={{title: 'Distributors', headerShown: true}}
        initialParams={{id}}
      />

      <Screen
        name={ROUTES.all_distributor}
       component={DistributorListScreen}
        options={{title: 'Distributors'}}
      />

      <Screen
        name={ROUTES.beat_information_stack}
        component={BeatInformationStack}
         options={{headerShown: false}}
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
    </Navigator>
  );
};
