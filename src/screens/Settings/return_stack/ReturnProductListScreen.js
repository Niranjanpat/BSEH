import React, {useEffect, useState} from 'react';
import {Caption, List, Searchbar, Text} from 'react-native-paper';
import {FlatList, View, StyleSheet} from 'react-native';

import ProductQuantity from '../../../components/ReturnQuantity';

import {COLORS} from '../../../constants/theme/colors';
import {ProductList} from '../../../services/order_service';

const ReturnProductListScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    let result = [];
    if (searchQuery.length > 0) {
      result = data.filter(e =>
        e.name?.toUpperCase().includes(searchQuery.toUpperCase()),
      );

      setSearchResult(result);
      return;
    }

    setSearchResult(result);
  }, [searchQuery]);

  const getProduct = () => {
    setIsLoading(true);

    ProductList(route.params.data._id)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setData(data.products);
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
      <Searchbar
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      <FlatList
        onRefresh={getProduct}
        data={searchQuery.length > 0 ? searchResult : data}
        refreshing={isLoading}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <Text>No item</Text>;
        }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 10,
        }}
        keyExtractor={(item, _) => item._id}
        renderItem={({item}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              titleNumberOfLines={10}
              title={item.name}
              descriptionStyle={{flex: 1}}
              description={_ => (
                <>
                  <Caption>{item.unit ? item.unit : 'N/A'}</Caption>
                  <Text>SAP Code: {item.sap_code ? item.sap_code : 'N/A'}</Text>
                  <Text>AVI: {item.stock ? item.stock : 'N/A'}</Text>
                  <Text>
                    Distributor Selling Price:{' '}
                    {item.distributorsellingprice
                      ? item.distributorsellingprice
                      : 'N/A'}
                  </Text>
                </>
              )}
              right={_ => (
                <View style={styles.listRight}>
                  <ProductQuantity data={item} />
                </View>
              )}
            />
          );
        }}
      />
    </View>
  );
};

export default ReturnProductListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginHorizontal: 20,
    marginTop: 10,
    elevation: 1,
  },
  list: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
  listRight: {
    width: '16%',
    alignItems: 'center',
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
