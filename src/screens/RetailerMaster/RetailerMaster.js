import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  List,
  Searchbar,
  Caption,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import BeatModal from '../../components/retailer_master/BeatModal';
import {ROUTES} from '../../constants/routes';
import {SPACINGS} from '../../constants/theme';
import {COLORS} from '../../constants/theme/colors';
import {getRetailerList, storeRetailerList} from '../../store/actions/retailer';
import {getBeatList, getRetailer} from '../../services/retailer_services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Filter = lazy(
  () => import('../../components/retailer_master/RetailerMasterFilter'),
);

const RetailerMaster = ({navigation, route}) => {
  const {retailerFilterData} = useSelector(state => state.retailer);
  const [retailerList, setRetailerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState('');
  const [beat, setBeat] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [keyboardType, setKeyboardType] = useState('default');
  const refreshCount = useRef(false);
  const selectedAssignee = useRef('');
  const page = useRef(0);
  const searchbarRef = useRef(null);
  const hasMore = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    refreshCount.current = route.params?.refreshCount || false;
    if (refreshCount.current) {
      fetchRetailers();
      refreshCount.current = false;
    }
  }, [route.params?.refreshCount]);

  useEffect(() => {
    getBeat();
  }, []);

  useEffect(() => {
    page.current = 0;
    fetchRetailers();
  }, [selectedBeat, retailerFilterData]);

  const fetchRetailers = () => {
    // dispatch(getRetailerList(selectedBeat, retailerFilterData, selectedAssignee.current));

    setLoading(true);
    const currentPage = page.current + 1;
    getRetailer(
      selectedBeat,
      retailerFilterData,
      selectedAssignee.current,
      currentPage,
      keyboardType === 'numeric' ? query : undefined,
      keyboardType === 'default' ? query : undefined,
    )
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          page.current = currentPage;
          if (page.current === 1) {
            setRetailerList(data.customers);
          } else {
            setRetailerList([...retailerList, ...data.customers]);
          }
          // dispatch(storeRetailerList(data.customers));
          hasMore.current = data.has_more;
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log('getRetailerList', e);
      })
      .finally(() => setLoading(false));
  };

  const setSelectedBeatValue = useCallback(beatId => {
    startTransition(() => {
      setVisible(false);
      setSelectedBeat(beatId);
    });
  }, []);

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

  const getBeat = () => {
    getBeatList(false)
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
            setQuery('');
          }}
          data={retailerList}
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
                    refreshCount: refreshCount.current,
                    showButtons: true,
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

export default RetailerMaster;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchbar: {
    margin: SPACINGS.sm,
    marginBottom: 0,
    elevation: 0,
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
