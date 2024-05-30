import {FlatList, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import usePromotionalItems from '../../../hooks/usePromotionalItems';
import DateRangeView from '../../../components/DateView';
import {Caption, List, Text, Title, TouchableRipple} from 'react-native-paper';
import {SPACINGS} from '../../../constants/theme';
import { COLORS } from '../../../constants/theme/colors';
import dayjs from 'dayjs';

const CustomerPromotionalItems = ({navigation, route}) => {
  const {customerId, userId} = route.params;

  const [dates, setDates] = useState({startDate: null, endDate: null});

  const {loading, customerPromotionalItems, getCustomerPromotionalItems} =
    usePromotionalItems();

  useEffect(() => {
    console.log('customerId', customerId);
    getCustomerPromotionalItems(customerId, userId);
  }, []);

  const getCustomerItems = useCallback(async () => {
    console.log('dates', dates.startDate, dates.endDate);
    getCustomerPromotionalItems(
      customerId,
      userId,
      dates.startDate,
      dates.endDate,
    );
  }, [dates]);

  //   const filteredList = useMemo(() => , [customerPromotionalItems]);

  const renderListItem = ({item}) => {
    console.log(item);
    return (
      <TouchableRipple>
        <View style={styles.list}>
          <View style={styles.rowContainer}>
            <Caption style={{color: COLORS.dark}}>{item.customer_sap_code || 'N/A'}</Caption>
            <Caption>{dayjs(item.created_at).format('YYYY-MM-DD') || 'N/A'}</Caption>
          </View>
          <Title>{item.customer_name || 'N/A'}</Title>
          <View style={styles.rowContainer}>
            <View style={{flex: 1}}>
              <Caption>Promotional Item/Code :</Caption>
              <Text variant="bodyMedium">
                {item.promotional_item_name || 'N/A'} / {item.promotional_item_sap_code || 'N/A'}
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Caption>Assigned Quantity :</Caption>
              <Text variant="bodyMedium" style={{color: COLORS.accentPrimary}}>{item.quantity || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  return (
    <View>
      <DateRangeView
        onDateSelected={(startDate, endDate) => {
          dates.startDate = startDate;
          dates.endDate = endDate;
          getCustomerItems();
        }}
      />
      <FlatList
        onRefresh={() => getCustomerItems()}
        data={customerPromotionalItems}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{margin: 10}}
        ListEmptyComponent={() => {
            return <Text style={{alignSelf: 'center'}}>No promotional items</Text>;
          }}
        renderItem={renderListItem}
        keyExtractor={(item, _) => item.id}
      />
    </View>
  );
};

export default CustomerPromotionalItems;

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    marginBottom: SPACINGS.sm,
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
