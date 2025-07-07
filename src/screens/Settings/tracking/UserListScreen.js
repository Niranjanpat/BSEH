import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {List} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {getUserHierarchyList} from '../../../services/userHierarchy_service';

const UserListScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getUserHierarchyList(route.params?.id ? route.params.id : ' ').then(res => {
      const {data, errors, success} = res.data;
      if (success) {
        console.log(data.users);
        setData(data.users);
      } else if (errors) {
        console.log(errors);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 10,
        }}
        ListEmptyComponent={() => {
          return <Text>No iTem</Text>;
        }}
        keyExtractor={(item, _) => item._id}
        renderItem={({item}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              onPress={() => {
                navigation.navigate(ROUTES.tracking_user, {id: item._id});
              }}
              right={props => (
                <>
                  {item.role === 'kam' ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        console.log('ss');
                        navigation.push(ROUTES.user_list, {
                          id: item._id,
                        });
                      }}
                      style={styles.listRight}>
                      <List.Icon {...props} icon="chevron-right" />
                    </TouchableOpacity>
                  )}
                </>
              )}
            />
          );
        }}
      />
    </View>
  );
};

export default UserListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginBottom: 10,
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
  chip: {
    backgroundColor: COLORS.accentPrimary,
    color: '#fff',
    flexGrow: 0,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
});
