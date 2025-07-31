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
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {URLS} from '../../../constants/urls';
import {deleteOrders, todayOrderList} from '../../../services/activity_service';

const OrderScreen = ({navigation, route}) => {
  const mmkv = new MMKVStorage.Loader().initialize();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState('');
  useEffect(() => {
    if (route.params?.date) {
      getOrderList(dayjs(route.params.date).format('YYYY-MM-DD'));
      setDates(route.params.date);
    } else {
      getOrderList(dayjs().format('YYYY-MM-DD'));
      setDates(dayjs().format('YYYY-MM-DD'));
    }
  }, []);

  const getOrderList = date => {
    todayOrderList(date)
      .then(res => {
        console.log(res.data);
        const {data, success, errors} = res.data;
        if (success) {
          setData(data.orders);
        } else if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  const onDownloadFile = async (id, cust) => {
    const token = await mmkv.getString('token');
    const dirs = RNFetchBlob.fs.dirs;

    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: cust + '_' + id + '.xlsx',

        mediaScannable: true,
        path: `${dirs.DownloadDir}/` + cust + `_` + id + `.xlsx`,
      },
    })
      .fetch('GET', URLS.base + URLS.orders + id + '/download-excel', {
        'x-auth': token,
      })
      .then(res => {
        console.log('ss', res);
        Alert.alert('Success', 'Downloaded file successfully !');
      });
  };

  const requestStoragePermission = async (id, cust) => {
    try {
      if (Platform.OS === 'ios') {
        onDownloadFile(id, cust);
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Please accept to store the file.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          onDownloadFile(id, cust);
        } else {
          console.log('Storage permission denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const deleteOrder = id => {
    Alert.alert(
      'Delete Order',
      'Do you want to delete this order?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteOrders(id, {
              _method: 'DELETE',
              reason: 'Cancel by retailer',
            }).then(res => {
              console.log(res.data);
              const {success, errors} = res.data;
              if (success) {
                getOrderList();
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
          getOrderList(dayjs(dates).format('YYYY-MM-DD'));
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
                        navigation.navigate(ROUTES.order_detail, {
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
                        Details
                      </Text>
                    </TouchableOpacity>
                    {item.is_editable && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate(ROUTES.update_order, {
                              id: item._id,
                            });
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
                        </TouchableOpacity>
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
              // right={props => (
              //   <TouchableOpacity
              //     onPress={() => {
              //       requestStoragePermission(item._id, item.customer);
              //     }}
              //     style={styles.listRight}>
              //     <List.Icon {...props} icon="download-outline" />
              //   </TouchableOpacity>
              // )}
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
