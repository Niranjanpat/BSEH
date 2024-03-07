import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Caption, IconButton, List, Searchbar, Text} from 'react-native-paper';

import {useFocusEffect} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import MMKVStorage from 'react-native-mmkv-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import BeatModal from '../../../components/BeatModal';
import {ROUTES} from '../../../constants/routes';
import {SPACINGS} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {URLS} from '../../../constants/urls';
import client from '../../../services/axios_client';
import {
  getCustomerVisitStatus,
  postCustomerCheckOut,
} from '../../../store/actions/order';

const mmkv = new MMKVStorage.Loader().initialize();

const MyVisitScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBeat, setSelectedBeat] = useState('');
  const [visible, setVisible] = useState(false);

  const {customerVisitStatus} = useSelector(state => state.order);

  useFocusEffect(
    useCallback(() => {
      fetchMyVisit();
      dispatch(getCustomerVisitStatus());
    }, []),
  );

  useEffect(() => {
    fetchStorageBeat();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="filter-variant"
          onPress={() => {
            setVisible(true);
          }}
        />
      ),
    });
  }, []);

  const fetchStorageBeat = async () => {
    const beat = await mmkv.getItem('selectedBeat');

    console.log('selected beat', beat);

    if (beat && beat !== '') {
      setSelectedBeat(beat);
      mmkv.setItem('selectedBeat', beat);
    }
  };

  const filteredData = useMemo(() => {
    if (selectedBeat === '' && !query) {
      return fullData;
    }

    let dataList = fullData.filter(
      cat =>
        cat?.route_id.includes(selectedBeat) &&
        cat?.name?.toUpperCase().includes(query.toUpperCase()),
    );
    return dataList;
  }, [selectedBeat, fullData, query]);

  async function fetchMyVisit() {
    try {
      setIsLoading(true);
      const response = await client.get(URLS.myVisits);
      const {data, errors, success} = response.data;
      if (success) {
        console.log(data.customers);

        setData(data.customers);
        setFullData(data.customers);
      } else {
        console.log('fetchMyVisit error:::', errors);
      }
    } catch (error) {
      Alert.alert('Oops!', error.toString());
    } finally {
      setIsLoading(false);
    }
  }

  const checkOutFunction = async () => {
    Geolocation.getCurrentPosition(
      position => {
        var datas = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          customer_id: data._id,
        };

        dispatch(postCustomerCheckOut(datas, navigation));
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const handleBeatSelection = useCallback(value => {
    setSelectedBeat(value);
    mmkv.setItem('selectedBeat', value);
  }, []);

  return (
    <>
      <Searchbar
        style={styles.searchbar}
        onChangeText={setQuery}
        placeholder="Search retailer name"
        value={query}
      />

      <View style={styles.container}>
        {customerVisitStatus.status && (
          <List.Item
            style={[
              styles.list,
              {
                backgroundColor: COLORS.accentPrimary,
                marginHorizontal: 10,
                marginTop: 10,
                marginBottom: 0,
              },
            ]}
            titleStyle={{fontWeight: 'bold', color: COLORS.light}}
            title={customerVisitStatus.customer_name}
            description={_ => (
              <Text style={{color: COLORS.light}}>Active Customer</Text>
            )}
            right={_ => (
              <View style={styles.listRight}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate(ROUTES.vertical)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: COLORS.primaryDark,
                    },
                  ]}>
                  <Text>Add Order</Text>
                </TouchableOpacity>
                <Text
                  onPress={() => checkOutFunction()}
                  style={[
                    styles.chip,
                    {
                      marginLeft: 10,
                      backgroundColor: COLORS.accentSecondary,
                    },
                  ]}>
                  Check Out
                </Text>
              </View>
            )}
          />
        )}
        <FlatList
          data={filteredData}
          refreshing={isLoading}
          onRefresh={() => fetchMyVisit()}
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => {
            if (isLoading) {
              return (
                <Text style={styles.emptyText}>Fetching your visits...</Text>
              );
            }

            return <Text style={styles.emptyText}>No visits found</Text>;
          }}
          keyExtractor={(item, _) => item._id}
          renderItem={({item}) => {
            return (
              <List.Item
                style={[
                  styles.list,
                  {backgroundColor: item.is_visited ? '#fff' : '#DBDBD6'},
                ]}
                titleStyle={{fontWeight: 'bold'}}
                title={() => <Text style={styles.title}>{item.name}</Text>}
                onPress={() =>
                  navigation.navigate(ROUTES.myvisit_details, {
                    data: item,
                    title: item.name,
                  })
                }
                description={_ => (
                  <>
                    <Caption numberOfLines={2}>
                      {item.billing_address ? item.billing_address : 'N/A'}
                    </Caption>
                    {item.sap_code ? <Text>{item.sap_code}</Text> : null}
                    {item.owner_contact_number ? (
                      <Text>{item.owner_contact_number}</Text>
                    ) : null}

                    {item.customer_type ? (
                      <Text>{item.customer_type}</Text>
                    ) : null}
                  </>
                )}
                right={props => (
                  <View style={styles.listRight}>
                    {item?.is_own_con_num_verified && (
                      <Icon name="verified" color={COLORS.success} size={22} />
                    )}

                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.chip,
                          {
                            backgroundColor: item.is_visited
                              ? COLORS.success
                              : COLORS.error,
                          },
                        ]}>
                        {item.is_visited ? 'Visited' : 'Not visited'}
                      </Text>
                      <List.Icon {...props} icon="chevron-right" />
                    </View>
                  </View>
                )}
              />
            );
          }}
        />
      </View>
      <BeatModal
        visible={visible}
        setValue={handleBeatSelection}
        onDismiss={setVisible}
        isMyVisits={true}
        value={selectedBeat}
      />
    </>
  );
};

export default MyVisitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchbar: {
    margin: SPACINGS.sm,
    marginBottom: 0,
    elevation: 0,
  },

  emptyText: {
    alignSelf: 'center',
    marginTop: SPACINGS.xxl,
  },

  list: {
    backgroundColor: '#DBDBD6',
    marginBottom: SPACINGS.sm,
    borderRadius: 10,
    overflow: 'hidden',
  },

  listRight: {
    alignItems: 'flex-end',
  },

  chip: {
    backgroundColor: COLORS.accentPrimary,
    color: '#fff',
    flexGrow: 0,
    alignSelf: 'center',
    padding: SPACINGS.xs,
    borderRadius: 10,
  },

  contentContainerStyle: {
    padding: SPACINGS.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verified: {
    color: COLORS.success,
  },
  unverified: {
    color: COLORS.error,
  },
  verify: {
    alignSelf: 'flex-end',
    fontWeight: 'bold',
  },
  img: {
    height: 55,
    width: 65,
  },
  highlight: {
    color: COLORS.success,
  },
  title: {
    fontWeight: 'bold',
  },
});
