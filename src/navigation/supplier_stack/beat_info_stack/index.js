import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../../../constants/routes';
import BeatInfoListScreen from '../../../screens/Settings/suppliers/beat_information/BeatInfoListScreen';
import BeatInformationScreen from '../../../screens/Settings/suppliers/beat_information/BeatInformationScreen';
import {IconButton} from 'react-native-paper';

const {Navigator, Screen} = createNativeStackNavigator();

export const BeatInformationStack = ({route}) => {
  const id = route.params?.id;
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.beat_list_screen}
        component={BeatInfoListScreen}
        options={{
          title: 'Beats',
          headerRight: () => <IconButton icon={'filter-outline'} size={22} />,
        }}
        initialParams={{id}}
      />
      <Screen
        name={ROUTES.beat_info_screen}
        component={BeatInformationScreen}
        options={({route}) => ({title: route.params?.name || 'Beat Info'})}
      />
    </Navigator>
  );
};
