import dayjs from 'dayjs';
import React, {useEffect, useState, memo} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {
  Dialog,
  Divider,
  Portal,
  Text,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import VerticalSpacer from '../../components/VerticalSpacer';

import client from '../../services/axios_client';

import {URLS} from '../../constants/urls';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../constants/theme';

const OrderSummaryModal = ({visible = false, onClose = () => {}, id}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchLastTenVisits();
    }
  }, [visible]);

  const fetchLastTenVisits = async () => {
    setIsLoading(true);
    const url = URLS.customer + id + '/' + URLS.orderSummary;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;
      console.log(data);
      if (success) {
        setVisits(data.months);
      } else if (errors) {
        if (errors.token_role) {
          return Alert.alert('Oops', errors.token_role);
        }

        Alert.alert('Oops', Object.values(errors).join(', '));
      }
    } catch (error) {
      Alert.alert('Error', error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog style={styles.dialog} visible={visible} dismissable={false}>
        <Title
          style={{
            textAlign: 'center',
          }}>
          Order Summary
        </Title>
        <Divider />
        <FlatList
          data={visits}
          style={styles.flatList}
          keyExtractor={(item, _) => item._id}
          ListHeaderComponentStyle={styles.headerStyle}
          ListHeaderComponent={() => <TableTitle />}
          ListEmptyComponent={() => <EmptyView isLoading={isLoading} />}
          ItemSeparatorComponent={() => <VerticalSpacer />}
          renderItem={({item}) => {
            return (
              <View style={styles.itemContainer}>
                <Text style={{flex: 1, textAlign: 'center'}}>{item.name}</Text>
                <Text style={{flex: 1, textAlign: 'center'}}>
                  {item.total_order_value}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                  }}>
                  {item.total_order_quantity}
                </Text>
              </View>
            );
          }}
        />
        <Divider />
        <Dialog.Actions>
          <TouchableRipple onPress={() => onClose(false)}>
            <Text style={styles.defaultButton}>Close</Text>
          </TouchableRipple>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const EmptyView = ({isLoading}) => {
  if (isLoading)
    return (
      <Text style={styles.emptyViewText}>Fetching your last 10 visits...</Text>
    );

  return <Text style={styles.emptyViewText}>No data found!</Text>;
};

const TableTitle = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textDecorationLine: 'underline',
          color: COLORS.accentPrimary,
          ...TYPOGRAPHY.subtitle1,
        }}>
        Date
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textDecorationLine: 'underline',
          color: COLORS.accentPrimary,
          ...TYPOGRAPHY.subtitle1,
        }}>
        Value
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textDecorationLine: 'underline',
          color: COLORS.accentPrimary,
          ...TYPOGRAPHY.subtitle1,
        }}>
        Quantity
      </Text>
    </View>
  );
};

export default memo(OrderSummaryModal);

const styles = StyleSheet.create({
  dialog: {
    height: '70%',
    paddingHorizontal: SPACINGS.sm,
  },

  flatList: {
    height: '60%',
  },

  defaultButton: {
    padding: 6,
  },

  emptyViewText: {
    paddingTop: SPACINGS.md,
    textAlign: 'center',
  },

  headerStyle: {
    marginVertical: SPACINGS.xs,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
