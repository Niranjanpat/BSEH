import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {List, Text} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {VerticalList} from '../../../services/order_service';

const ReturnVerticalListScreen = ({navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getVertical();
  }, []);

  const getVertical = () => {
    setIsLoading(true);
    VerticalList()
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setData(data.verticals);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={getVertical}
        data={data}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 10,
        }}
        ListEmptyComponent={() => {
          return <Text>No iTem</Text>;
        }}
        keyExtractor={(item, _) => item._id}
        renderItem={({item, index}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              onPress={() => {
                navigation.navigate(ROUTES.return_brand, {
                  data: item,
                });
              }}
              right={props => (
                <View style={styles.listRight}>
                  <List.Icon {...props} icon="chevron-right" />
                </View>
              )}
            />
          );
        }}
      />
    </View>
  );
};

export default ReturnVerticalListScreen;
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
