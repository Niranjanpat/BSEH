import {FlatList, View, StyleSheet} from 'react-native';
import {Text, Searchbar} from 'react-native-paper';
import {useRef} from 'react';
import {useDistributor} from '../../../../hooks/supplier/useDistributor';
import {ROUTES} from '../../../../constants/routes';
import {stylesSupplier} from '../styles/SupplierStyles';
import SupplierListItem from '../../../../components/settings/supplier/SupplierListItem';
import BeatAssigneeFilter from '../../../../components/settings/supplier/BeatAssigneeFilter';
import {SPACINGS} from '../../../../constants/theme';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../../../constants/theme/colors';
import TabFilter from '../../../../components/TabFilter';
import {userRoles} from '../../../../utils/user_roles';

const DistributorListScreen = ({route, navigation}) => {
  const {channel}=route.params;
  const dispatch = useDispatch();
  const setAssignee = useRef('');
  const {distributors, loading, refreshData, changePage, changeQuery} =
    useDistributor(undefined,channel ,null);

  const filterOption = {
    All: '',
    Own: 'me',
    Subordinate: 'subordinate'
  }


  const {role} = useSelector(state => state.auth);

  //  const handleChange = (e) => {
  //     changeQuery(e);
  //   };

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
       {role !== userRoles.TSI && (
                <TabFilter
                  initialValue={'All'}
                  filterOptionsObject={filterOption}
                  onFilterChange={v => {
                    setAssignee.current = filterOption[v];
                    refreshData(setAssignee.current);
                  }}
                />
              )}
      <View style={styles.container}>
        <FlatList
          onRefresh={() => {
            refreshData();
          }}
          data={distributors}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return <Text style={{alignSelf: 'center'}}>No item</Text>;
          }}
          contentContainerStyle={{padding: 10}}
          keyExtractor={(item, _) => item._id}
          onEndReached={() => changePage()}
          renderItem={({item, index}) => (
            <SupplierListItem
              item={item}
              onPress={() => {
                navigation.navigate(ROUTES.distributor_detail, {
                  id: item._id,
                  title: item.name,
                  channel:ROUTES.all_distributor,
                  assignee:setAssignee.current,
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
