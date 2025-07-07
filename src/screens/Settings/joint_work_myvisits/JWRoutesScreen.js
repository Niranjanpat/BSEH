import React, {useState, useEffect} from 'react';
import {Alert, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {List} from 'react-native-paper';

import VerticalSpacer from '../../../components/VerticalSpacer';

import {ROUTES} from '../../../constants/routes';
import {SPACINGS} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';

import {getGuestRoutes} from '../../../services/joint_service';

const JWRoutescreen = ({navigation}) => {
  const {jointStatus, token} = useSelector(state => state.auth);

  console.log(token);

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jointStatus) {
      fetchRoutes();
    }
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await getGuestRoutes(jointStatus.guest_id);

      console.log('res', res);

      const {success, data, errors} = res.data;
      if (success) {
        setRoutes(data.routes);
      } else if (errors) {
        Alert.alert(Object.values(errors).join(', '));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderRouteList = ({item}) => {
    return (
      <List.Item
        title={item.name}
        style={styles.listItem}
        onPress={() =>
          navigation.navigate(ROUTES.jw_myvisits, {routeId: item._id})
        }
      />
    );
  };

  return (
    <>
      <FlatList
        data={routes}
        refreshing={loading}
        onRefresh={fetchRoutes}
        renderItem={renderRouteList}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={VerticalSpacer}
      />
    </>
  );
};

export default JWRoutescreen;

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: SPACINGS.sm,
    backgroundColor: COLORS.light,
  },
});
