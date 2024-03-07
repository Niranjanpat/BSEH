import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text, List, Searchbar, Caption, IconButton} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import BeatModal from '../../components/BeatModal';
import {ROUTES} from '../../constants/routes';
import {SPACINGS} from '../../constants/theme';
import {COLORS} from '../../constants/theme/colors';
import {getRetailerList} from '../../store/actions/retailer';

const RetailerMaster = ({navigation}) => {
  const {retailerList} = useSelector(state => state.retailer);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    let result = [];
    if (query.length > 0) {
      result = retailerList.filter(e =>
        e.name?.toUpperCase().includes(query.toUpperCase()),
      );
      setSearchResult(result);
      return;
    }
    setSearchResult(result);
  }, [query]);

  useEffect(() => {
    if (selectedBeat == '') {
      setData(retailerList);
    } else {
      let dataList = retailerList.filter(cat => cat.route_id === selectedBeat);
      setData(dataList);
    }
  }, [selectedBeat]);

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
  return (
    <>
      <Searchbar
        style={styles.searchbar}
        onChangeText={setQuery}
        placeholder="Search retailer by name"
      />
      <View style={styles.container}>
        <FlatList
          onRefresh={() => {
            dispatch(getRetailerList());
            setQuery('');
          }}
          data={query.length > 0 ? searchResult : data}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
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
                  navigation.navigate(ROUTES.retailer_detail, {
                    data: item,
                    title: item.name,
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
        setValue={setSelectedBeat}
        onDismiss={setVisible}
        value={selectedBeat}
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
  chip: {
    backgroundColor: COLORS.accentPrimary,
    color: '#fff',
    flexGrow: 0,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
});
