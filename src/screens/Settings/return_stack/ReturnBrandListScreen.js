import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {List, Text} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {BrandList} from '../../../services/order_service';

const ReturnBrandListScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getBrand();
  }, []);

  const getBrand = () => {
    setIsLoading(true);
    // console.log(route.params.data);
    BrandList(route.params.data._id)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setData(data.brands);
        } else if (errors) {
          alert(Object.values(errors).join(', '));
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
        onRefresh={getBrand}
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
        renderItem={({item}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              onPress={() => {
                navigation.navigate(ROUTES.return_products, {
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

export default ReturnBrandListScreen;
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
