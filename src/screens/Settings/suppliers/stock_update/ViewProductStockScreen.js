import {Alert, FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {List, Text} from 'react-native-paper';
import {getProductsStock} from '../../../../services/order_service';
import dayjs from 'dayjs';
import DateRangeFilter from '../../../../components/DateRangeFilter';
import {COLORS} from '../../../../constants/theme/colors';

const ViewProductStockScreen = ({route}) => {
  const id = route.params?.id || '';
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const page = useRef(1);
  const hasMore = useRef(false);
  const startDate = useRef(new Date());
  const endDate = useRef(new Date());

  useEffect(() => {
    fetchProductStocks();
  }, []);

  const fetchProductStocks = () => {
    setLoading(true);
    const start = dayjs(startDate.current).format('YYYY-MM-DD');
    const end = dayjs(endDate.current).format('YYYY-MM-DD');

    getProductsStock(page.current, id, start, end)
      .then(res => {
        const {success, data, errors} = res?.data;
        console.log(data);

        if (success) {
          hasMore.current = data.has_more;

          if (page.current === 1) {
            setStocks(data.distributors_stock_product);
            setLoading(false);
            return;
          }
          setStocks([...stocks, ...data]);
          setLoading(false);
          return;
        }
        if (errors) {
          setLoading(false);
          Alert.alert('Error!', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('Error!', JSON.stringify(err));
      });
  };

  return (
    <View>
      <DateRangeFilter
        onStartDateChange={date => {
          page.current = 1;
          startDate.current = date;
          fetchProductStocks();
        }}
        onEndDateChange={date => {
          page.current = 1;
          endDate.current = date;
          fetchProductStocks();
        }}
      />

      <FlatList
        refreshing={loading}
        onRefresh={() => {
          page.current = 1;
          fetchProductStocks();
        }}
        data={stocks}
        contentContainerStyle={{padding: 10}}
        renderItem={({item}) => (
          <List.Item
            title={item.product_name}
            titleNumberOfLines={2}
            right={() => (
              <View>
                <View style={styles.quantityContainer}>
                  <Text
                    variant="titleSmall"
                    style={{color: COLORS.accentPrimary}}>
                    {item.quantity}
                  </Text>
                </View>
              </View>
            )}
            style={styles.itemContainer}
            description={() => (
              <View>
                <Text>Sap Code: {item.product_sap_code}</Text>
                <View style={styles.descContainer}>
                  <View>
                    <Text variant="bodySmall">Distributor:</Text>
                    <Text variant="labelMedium">{`${item.distributor_name}/${item.distributor_code}`}</Text>
                  </View>

                  <View>
                    <Text variant="bodySmall">Date:</Text>
                    <Text variant="labelMedium">{item.date}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
        ListEmptyComponent={
          <Text variant="bodyMedium" style={{alignSelf: 'center'}}>
            No Product
          </Text>
        }
        keyExtractor={item => item._id}
        onEndReached={() => {
          if (!loading && hasMore.current) {
            page.current = page.current + 1;
            fetchProductStocks();
          }
        }}
      />
    </View>
  );
};

export default ViewProductStockScreen;

const styles = StyleSheet.create({
  quantityContainer: {
    backgroundColor: COLORS.light,
    elevation: 1,
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    marginBottom: 10,
  },
  descContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
