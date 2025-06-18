import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useTransition,
  lazy,
  Suspense,
} from 'react';
import {
  getUserRetailer,
  getBeatList,
} from '../../../services/retailer_services';
import {
  Caption,
  List,
  Text,
  Searchbar,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import {SPACINGS} from '../../../constants/theme';
import BeatModal from '../../../components/BeatModal';
import {
  getCustomerList,
  storeCustomerList,
} from '../../../store/actions/customer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';

const Filter = lazy(
  () => import('../../../components/user_customer/UserCustomerFilter'),
);

const UserCustomersScreen = ({route, navigation}) => {
  const {customerFilterData} = useSelector(state => state.customer);
  const userId = route.params?.id;
  const [userCustomers, setUserCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const hasMore = useRef(false);
  const page = useRef(0);
  const searchbarRef = useRef(null);
  const [query, setQuery] = useState('');
  const [beat, setBeat] = useState([]);
  const [selectedBeat, setSelectedBeat] = useState('');
  const [keyboardType, setKeyboardType] = useState('default');

  useEffect(() => {
    getBeat();
  }, []);

  useEffect(() => {
    page.current = 0;
    fetchRetailers();
  }, [customerFilterData,selectedBeat]);


  const fetchRetailers = () => {
    setLoading(true);
    const currentPage = page.current + 1;
    getUserRetailer(
      userId,
      customerFilterData,
      keyboardType === 'numeric' ? query : undefined,
      keyboardType === 'default' ? query : undefined,
      currentPage,
      selectedBeat,
    )
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          page.current = currentPage;
          if (currentPage === 1) {
            setUserCustomers(data.customers);
          } else {
            setUserCustomers([...userCustomers, ...data.customers]);
          }
          hasMore.current = data.has_more;
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log('userRetailerList', e);
      })
      .finally(() => setLoading(false));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IconButton
            icon="filter-variant"
            style={{margin: 0}}
            onPress={() => {
              setVisible(true);
            }}
          />
          <Suspense fallback={<ActivityIndicator />}>
            <Filter />
          </Suspense>
        </View>
      ),
    });
  }, []);

  const setSelectedBeatValue = useCallback(beatId => {
    startTransition(() => {
      setVisible(false);
      setSelectedBeat(beatId);
    });
  }, []);

  const getBeat = () => {
    getBeatList(false,userId)
      .then(async res => {
        const {data, success, errors} = res.data;
        if (success) {
          setBeat(data.routes);

          console.log(data?.routes);
        }
      })
      .catch(e => {
        Alert.alert(e);
      });
  };

  const handleChange = e => {
    setQuery(e);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      page.current = 0;
      fetchRetailers();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleKeyboardType = () => {
    setKeyboardType(prevType =>
      prevType === 'numeric' ? 'default' : 'numeric',
    );
    searchbarRef.current.value = '';
    searchbarRef.current.focus();
  };

  return (
    <>
     
        <Searchbar
          style={styles.searchbar}
          onChangeText={handleChange}
          placeholder={`Search retailer by ${keyboardType === 'numeric' ? 'mobile number' : 'name'}`}
          right={() => (
            <TouchableOpacity onPress={handleKeyboardType}>
              <Icon
                name="card-account-phone-outline"
                size={24}
                color={keyboardType === 'numeric' ? COLORS.primary : 'gray'}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
          keyboardType={keyboardType}
          ref={searchbarRef}
        />
        <View style={styles.container}>
          <FlatList
          onRefresh={() => {
            page.current = 0;
            fetchRetailers();
          }}
          data={userCustomers}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return <Text style={{alignSelf: 'center'}}>No item</Text>;
          }}
          keyExtractor={(item, _) => item._id}
          onEndReached={() => {
            if (!loading && hasMore.current) {
              fetchRetailers();
            }
          }}
          renderItem={({item, index}) => {
            return (
              <List.Item
                style={styles.list}
                titleStyle={{fontWeight: 'bold'}}
                title={item.name}
                onPress={() => {
                  navigation.navigate(ROUTES.retailer_detail, {
                    data: item,
                    title: item.name,
                    showButtons: false,
                  });
                }}
                description={props => (
                  <>
                    <Caption>
                      {item.billing_address ? item.billing_address : 'N/A'}
                    </Caption>
                    <Text>
                      {item.owner_contact_number
                        ? item.owner_contact_number
                        : 'N/A'}
                    </Text>
                    <Text>
                      {item.customer_type ? item.customer_type : 'N/A'}
                    </Text>
                  </>
                )}
                right={props => (
                  <View style={styles.listRight}>
                    <Text
                      style={[
                        styles.chip,
                        {
                          backgroundColor: item.is_active
                            ? COLORS.success
                            : COLORS.error,
                        },
                      ]}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Text>
                    <List.Icon {...props} icon="chevron-right" />
                  </View>
                )}          
              />
            );
          }}
        />
      </View>
      <BeatModal
        visible={visible}
        setValue={setSelectedBeatValue}
        onDismiss={setVisible}
        value={selectedBeat}
        beat={beat}
      />
    </>
  );
};

export default UserCustomersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
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
  searchbar: {
    margin: SPACINGS.sm,
    marginBottom: 10,
    elevation: 0,
  },
  icon: {
    marginRight: 20,
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
