import {FlatList, View, StyleSheet} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Text, Searchbar, List, TouchableOpacity} from 'react-native-paper';
import {ROUTES} from '../../../../constants/routes';
import {stylesSupplier} from '../styles/SupplierStyles';
import SupplierListItem from '../../../../components/settings/supplier/SupplierListItem';
import BeatAssigneeFilter from '../../../../components/settings/supplier/BeatAssigneeFilter';
import {SPACINGS} from '../../../../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../../../constants/theme/colors';
import {
  getDistributorVisitStatus,
  postDistributorCheckOut,
} from '../../../../store/actions/distributor';
import {getTodayDistributorVisits} from '../../../../services/distributor_visit_service';
import dayjs from 'dayjs';
import TabFilter from '../../../../components/TabFilter';

const DistributorListScreen = ({route, navigation}) => {
  const distributors = useRef([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filterDistributors, setFilterDistributors] = useState([]);

  const dispatch = useDispatch();

  const {distributorVisitStatus} = useSelector(state => state.distributor);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    fetchDistributorVisit(today);
  }, []);
  useFocusEffect(
    useCallback(() => {
      dispatch(getDistributorVisitStatus());
    }, []),
  );

  const fetchDistributorVisit = date => {
    setLoading(true);
    getTodayDistributorVisits(date)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          distributors.current = data.distributors;
          setFilterDistributors(
            distributors.current.filter(
              d => d.type === 'distributor',
            ),
          );
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log('distributors', e);
      })
      .finally(() => setLoading(false));
  };

  //  const handleChange = (e) => {
  //     changeQuery(e);
  //   };

  const checkOutFunction = async () => {
    Geolocation.getCurrentPosition(
      position => {
        var datas = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          distributor_id: distributorVisitStatus.distributor_id,
        };

        dispatch(postDistributorCheckOut(datas, navigation));
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

  return (
    <View style={styles.container}>
      {/* <Searchbar
        style={styles.searchbar}
        onChangeText={handleChange}
        placeholder="Search retailer by name"
      />
      <BeatAssigneeFilter
        onAssigneeChange={v => {
          refreshData(v);
        }}                
      /> */}
      {distributorVisitStatus.status && (
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
          title={distributorVisitStatus.distributor_name}
          description={_ => (
            <Text style={{color: COLORS.light}}>Active Customer</Text>
          )}
          right={_ => (
            <View style={styles.listRight}>
              <Text
                onPress={() => checkOutFunction()}
                style={[
                  styles.chip,
                  {
                    marginTop: 5,
                    backgroundColor: COLORS.accentSecondary,
                  },
                ]}>
                Check Out
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.container}>
        <FlatList
          onRefresh={() => {
            fetchDistributorVisit();
          }}
          data={filterDistributors}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return <Text style={{alignSelf: 'center'}}>No item</Text>;
          }}
          contentContainerStyle={{padding: 10}}
          keyExtractor={(item, _) => item._id}
          renderItem={({item, index}) => (
            <SupplierListItem
              item={item}
              onPress={() => {
                navigation.navigate(ROUTES.distributor_detail, {
                  id: item._id,
                  title: item.name,
                  channel: ROUTES.distributor_visit,
                });
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

export default DistributorListScreen;

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
});
