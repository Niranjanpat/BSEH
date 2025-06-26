import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import {Caption, List, Subheading, Text} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {URLS} from '../../../constants/urls';
import {
  deleteOrders,
  deleteSalesReturn,
  saleReturn,
  todayOrderList,
} from '../../../services/activity_service';
import SaleReturnDetail from './SaleReturn/SaleReturnDetail';

const SalesReturn = ({navigation, route}) => {
  const mmkv = new MMKVStorage.Loader().initialize();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState('');
  useEffect(() => {
    if (route.params?.date) {
      getSalesReturnList(dayjs(route.params.date).format('YYYY-MM-DD'));
      setDates(route.params.date);
    } else {
      getSalesReturnList(dayjs().format('YYYY-MM-DD'));
      setDates(dayjs().format('YYYY-MM-DD'));
    }
  }, []);

  const getSalesReturnList = date => {
    saleReturn(date)
      .then(res => {
        console.log(res.data);
        const {data, success, errors} = res.data;
        if (success) {
          setData(data.sales_returns);
        } else {
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  const deleteOrder = id => {
    Alert.alert(
      'Delete Order',
      'Do you want to Delete this Order ?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteSalesReturn(id, {_method: 'DELETE'}).then(res => {
              console.log(res.data);
              const {success, errors} = res.data;
              if (success) {
                getSalesReturnList();
              } else {
                 Alert.alert('Error', Object.values(errors).join(', '));
              }
            });
          },
        },
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <Subheading>Order of {dayjs(dates).format('YYYY MMM DD')}</Subheading>
      <FlatList
        onRefresh={() => {
          getSalesReturnList(dayjs(dates).format('YYYY-MM-DD'));
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
              title={item.customer_name}
              description={props => (
                <>
                  <Caption>
                    {dayjs(item.created_at).format('YYYY MMM DD HH:m a')}
                  </Caption>
                  <Text>Reason: {item.reason}</Text>
                  <View style={styles.row}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate(ROUTES.sales_return_detail, {
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
                    {item.is_editable && (
                      <>
                        {/* <TouchableOpacity
                            onPress={() => {
                              navigation.navigate(ROUTES.update_order);
                            }}>
                            <Text
                              style={[
                                styles.chip,
                                {
                                  backgroundColor: COLORS.accentPrimary,
                                },
                              ]}>
                              Update
                            </Text>
                          </TouchableOpacity> */}
                        <TouchableOpacity
                          onPress={() => {
                            deleteOrder(item._id);
                          }}>
                          <Text
                            style={[
                              styles.chip,
                              {
                                backgroundColor: COLORS.error,
                              },
                            ]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </>
              )}
              right={props => (
                <TouchableOpacity style={styles.listRight}>
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

export default SalesReturn;

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
    marginTop: 5,
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
