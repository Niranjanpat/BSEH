import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import usePromotionalItems from '../../../hooks/usePromotionalItems';
import {Caption, List, Searchbar, Text} from 'react-native-paper';
import PromotionalQuantity from '../../../components/promotional_item/PromotionalQuantity';
import PromotionalItem from '../../../components/promotional_item/PromotionalItem';

const UserPromotionalItems = ({navigation, route}) => {
  const {userId} = route?.params ?? "";

  const [searchQuery, setSearchQuery] = useState('');

  const {loading, userPromotionalItems, getUserPromotionalItems} =
    usePromotionalItems();

  useEffect(() => {
    console.log('userId', userId);
    getUserPromotionalItems(userId);
  }, []);

  const filtered = useMemo(
    () =>
      userPromotionalItems.filter(item =>
        item.promotional_item_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [searchQuery, userPromotionalItems],
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by item name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      <FlatList
        onRefresh={() => getUserPromotionalItems(userId)}
        data={filtered}
        refreshing={loading}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <Text style={{alignSelf: 'center'}}>No item</Text>;
        }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 10,
        }}
        keyExtractor={(item, _) => item.id}
        renderItem={({item}) => {
          return (
            <View style={{marginBottom: 10}}>
              <PromotionalItem item={item} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default UserPromotionalItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBar: {
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 1,
  },
});
