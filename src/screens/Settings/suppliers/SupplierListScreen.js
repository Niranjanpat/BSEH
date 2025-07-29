import {StyleSheet, View} from 'react-native';
import React from 'react';
import {List, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../../constants/routes';
import DistributorListScreen from './distributors/DistributorListScreen';

const DistributorScreen = ({route, navigation}) => {
  const id = route.params?.id;
  const {role} = useSelector(state => state.auth);
  const ListItem = (name, onPress) => {
    return (
      <List.Item
        style={styles.list}
        titleStyle={{fontWeight: 'bold'}}
        title={name}
        onPress={() => {
          onPress();
        }}
        right={props => (
          <List.Icon {...props} style={styles.listRight} icon="chevron-right" />
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      {ListItem('All-Distributors', () => {
        navigation.navigate(ROUTES.all_distributor, {
          channel: ROUTES.all_distributor,
        });
      })}

      {ListItem('Distributor Visits', () => {
        navigation.navigate(ROUTES.distributor_visit);
      })}

      {ListItem('Distributor Schedule', () => {
        navigation.navigate(ROUTES.distributor_schedule_list);
      })}

      {ListItem('Visited Distributor', () => {
        navigation.navigate(ROUTES.visited_distributor);
      })}

    </View>
  );
};

export default DistributorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
  listRight: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
