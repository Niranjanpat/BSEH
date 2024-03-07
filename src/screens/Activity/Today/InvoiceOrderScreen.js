import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Caption, List, Subheading, Text} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {invoiceOrderList} from '../../../services/activity_service';

const OrderScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState('');
  useEffect(() => {
    if (route.params?.date) {
      getInvoiceOrder(dayjs(route.params.date).format('YYYY-MM-DD'));
      setDates(route.params.date);
    } else {
      getInvoiceOrder(dayjs().format('YYYY-MM-DD'));
      setDates(dayjs().format('YYYY-MM-DD'));
    }
  }, []);

  const getInvoiceOrder = date => {
    invoiceOrderList(date)
      .then(res => {
        console.log(res.data);
        const {data, success, errors} = res.data;
        if (success) {
          setData(data.invoices);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  return (
    <View style={styles.container}>
      <Subheading>Order of {dayjs(dates).format('YYYY MMM DD')}</Subheading>
      <FlatList
        onRefresh={() => {
          getInvoiceOrder(dayjs(dates).format('YYYY-MM-DD'));
        }}
        data={data}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <Text>No iTem</Text>;
        }}
        keyExtractor={(item, _) => item._id}
        renderItem={({item, index}) => {
          console.log(item);
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.customer}
              description={props => (
                <>
                  <Caption>
                    {dayjs(item.created_at).format('YYYY MMM DD HH:m a')}
                  </Caption>
                  <View style={styles.row}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate(ROUTES.invoice_detail, {
                          id: item._id,
                        });
                      }}>
                      <Text
                        style={[
                          styles.chip,
                          {
                            backgroundColor: COLORS.primary,
                          },
                        ]}>
                        Detail
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              right={props => (
                <TouchableOpacity onPress={() => {}} style={styles.listRight}>
                  <List.Icon {...props} icon="chevron-right" />
                </TouchableOpacity>
              )}
            />
          );
        }}
      />
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  search: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
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
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});
