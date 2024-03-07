import {Alert, FlatList, StyleSheet, View} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import {customerListByBeatId} from '../../../services/joint_service';
import {Caption, List, Searchbar} from 'react-native-paper';
import {SPACINGS} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import VerticalSpacer from '../../../components/VerticalSpacer';
import {ROUTES} from '../../../constants/routes';

const JWMyVisitscreen = ({route, navigation}) => {
  const routeId = route.params.routeId;
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomerList();
  }, []);

  const fetchCustomerList = async () => {
    setLoading(true);
    try {
      const res = await customerListByBeatId(routeId);
      const {data, success, errors} = res.data;

      if (success) {
        setCustomers(data.customers);
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('fetchCustomerList', error);
    } finally {
      setLoading(false);
    }
  };

  const filtererdList = useMemo(() => {
    return customers.filter(item =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, customers]);

  const renderCustomerList = ({item}) => {
    return (
      <List.Item
        title={item.name}
        style={styles.listItem}
        description={() => (
          <>
            <Caption>{item.billing_address}</Caption>
            <Caption>{item.owner_contact_number}</Caption>
          </>
        )}
        onPress={() =>
          navigation.navigate(ROUTES.jw_myvisits_detail, {data: item})
        }
        right={props => <List.Icon {...props} icon={'chevron-right'} />}
      />
    );
  };

  return (
    <View>
      <Searchbar
        placeholder="Search by name"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <VerticalSpacer />

      <FlatList
        data={filtererdList}
        refreshing={loading}
        onRefresh={fetchCustomerList}
        keyExtractor={item => item._id}
        renderItem={renderCustomerList}
        ItemSeparatorComponent={VerticalSpacer}
      />
    </View>
  );
};

export default JWMyVisitscreen;

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: SPACINGS.sm,
    backgroundColor: COLORS.light,
  },
});
