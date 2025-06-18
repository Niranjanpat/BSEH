import React, {useEffect, useState} from 'react';
import {FlatList, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, List} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {getUserHierarchyList} from '../../../services/userHierarchy_service';
const UserHierarchyList = ({navigation, route}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getUserHierarchyList(route.params?.id ? route.params.id : ' ').then(res => {
      const {data, errors, success} = res.data;
      if (success) {
        console.log(data.users);
        setData(data.users);
      } else {
        console.log(errors);
      }
    });
  }, []);

  const handlePerformanceClick = () => {
    navigation.navigate(ROUTES.team_performance, {userData: data});
  };

  const handleSalesClick = () => {
    const id = [];
    data.forEach((item, index) => {
      id.push(item._id);
    });
    console.log(id);
    navigation.navigate(ROUTES.sales_performance, {id});
  };

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
          console.log(item);
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              onPress={() => {
                navigation.navigate(ROUTES.performance_screen, {
                  role: item.role,
                  id: item._id,
                });
              }}
              right={props => (
                <>
                  {item.role === 'cr' ||
                  item.role === 'yp' ||
                  item.role === 'sr' ? null : (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push(ROUTES.user_hierarchy_list, {
                          id: item._id,
                        });
                      }}
                      style={styles.listRight}>
                      <Text style={{color: COLORS.accentSecondary}}>View Team</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            />
          );
        }}
      />

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => handlePerformanceClick()}>
          Team Performance
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => handleSalesClick()}>
          Product Sales
        </Button>
      </View>
    </View>
  );
};
export default UserHierarchyList;
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
  button: {
    marginHorizontal: 5,
    color: '#fff',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal:10,
    flexDirection: 'row',
    marginVertical: 10,
  },
});
