import {FlatList, View, StyleSheet} from 'react-native';
import React from 'react';
import {Text, Searchbar} from 'react-native-paper';
import {stylesSupplier} from '../styles/SupplierStyles';  
import {useSuperStockist} from '../../../../hooks/supplier/useSuperStockist';
import {ROUTES} from '../../../../constants/routes';
import SupplierListItem from '../../../../components/settings/supplier/SupplierListItem';
import BeatAssigneeFilter from '../../../../components/settings/supplier/BeatAssigneeFilter';
import {SPACINGS} from '../../../../constants/theme';

const SuperStockistListScreen = ({route, navigation}) => {

  const {superStockists, loading, refreshData, changePage,changeQuery} = useSuperStockist(
    undefined,
    route.params?.id,
  );
  
  const handleChange = e => {
    changeQuery(e);
  };



  return (
    <>
      <Searchbar
        style={styles.searchbar}
        onChangeText={handleChange}
        placeholder="Search retailer by name"
      />
      <BeatAssigneeFilter
        onAssigneeChange={v => {
          refreshData(v);
        }}
      />
      <View style={styles.container}>
         <FlatList
        onRefresh={() => {
          refreshData();
        }}
        data={superStockists}
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
              navigation.navigate(ROUTES.super_stockist_detail, {
                id: item._id,
                title: item.name,
              });
            }}
          />
        )}
      />
      </View>
    </>
  );
};

export default SuperStockistListScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:10,
  },
  searchbar: {
    margin: SPACINGS.sm,
    marginBottom: 10,
    elevation: 0,
  },
});
