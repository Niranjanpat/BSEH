import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../constants/routes';
import {COLORS} from '../constants/theme/colors';
import tokenInvalid from '../utils/invalid_token';
import {
  ActivityStackNavigation,
  AddShopNavigation,
  HomeStackNavigation,
  JWMyVisitsNavigation,
  SettingsStackNavigation,
} from './RootStack';
import {MyVisitStack} from './settings_stack';
import {UserHierarchyStack} from './user_hierarchy_stack';

const {Navigator, Screen} = createBottomTabNavigator();

export default function BottomTabStack({navigation}) {
  const dispatch = useDispatch();
  const {isInvalid, role, jointStatus} = useSelector(state => state.auth);

  React.useEffect(() => {
    console.log('is token invalid', isInvalid);

    if (isInvalid) {
      dispatch(tokenInvalid(navigation));
    }
  }, [isInvalid]);

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.accentPrimary,
        unmountOnBlur: true,
      }}>
      <Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={26}
            />
          ),
        }}
        component={HomeStackNavigation}
      />

      {role == 'sc' ? (
        <>
          <Screen
            name="Activity"
            options={{
              tabBarLabel: 'Activity',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="contacts-outline"
                  color={color}
                  size={22}
                />
              ),
            }}
            component={ActivityStackNavigation}
          />
          <Screen
            name="AddShop"
            options={{
              tabBarLabel: 'Add Shop',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="shopping-outline"
                  color={color}
                  size={26}
                />
              ),
            }}
            component={AddShopNavigation}
          />
          <Screen
            name={ROUTES.myvisit_stack}
            options={{
              tabBarLabel: 'My Visits',
              tabBarIcon: ({color}) => (
                <Fontisto name="shopping-store" color={color} size={22} />
              ),
            }}
            component={MyVisitStack}
          />
        </>
      ) : (
        <>
          {role == 'sc' && (
            <>
              <Screen
                name="AddShop"
                options={{
                  tabBarLabel: 'Add Shop',
                  tabBarIcon: ({color}) => (
                    <MaterialCommunityIcons
                      name="shopping-outline"
                      color={color}
                      size={26}
                    />
                  ),
                }}
                component={AddShopNavigation}
              />
              <Screen
                name={ROUTES.myvisit_stack}
                options={{
                  tabBarLabel: 'My Visits',
                  tabBarIcon: ({color}) => (
                    <Fontisto name="shopping-store" color={color} size={22} />
                  ),
                }}
                component={MyVisitStack}
              />
            </>
          )}
          <Screen
            name="UserHierarchy"
            options={{
              tabBarLabel: 'User Hierarchy',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="file-tree-outline"
                  color={color}
                  size={22}
                />
              ),
            }}
            component={UserHierarchyStack}
          />

          {jointStatus && jointStatus.status && (
            <Screen
              name={ROUTES.jw_myvisits_stack}
              options={{
                tabBarLabel: 'Joint Visits',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="bookmark-outline"
                    color={color}
                    size={22}
                  />
                ),
              }}
              component={JWMyVisitsNavigation}
            />
          )} 

          {role == 'asm' && (
            <Screen
              name="AddShop"
              options={{
                tabBarLabel: 'Add Shop',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="shopping-outline"
                    color={color}
                    size={26}
                  />
                ),
              }}
              component={AddShopNavigation}
            />
          )}
        </>
      )}

      <Screen
        name="Settings"
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={26}
            />
          ),
        }}
        component={SettingsStackNavigation}
      />
    </Navigator>
  );
}
