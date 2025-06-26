import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {Caption, List, Subheading, Text} from 'react-native-paper';

import {COLORS} from '../../../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../../../constants/theme';

import {orderDetail} from '../../../../services/activity_service';

const OrderDetail = ({route}) => {
  const [data, setData] = useState({});
  const {id} = route.params;

  useEffect(() => {
    getInvoiceDetail();
  }, []);

  const getInvoiceDetail = () => {
    orderDetail(id).then(res => {
      const {data, success, errors} = res.data;
      if (success) {
        setData(data);
      } else {
          Alert.alert('Error', Object.values(errors).join(', '));
      }
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.customer}>
          <Subheading style={{...TYPOGRAPHY.body1}}>Shop</Subheading>
          <Text>{data.customer}</Text>
        </View>
      </View>
      <FlatList
        data={data.products}
        keyExtractor={(item, _) => item._id}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({item}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              titleNumberOfLines={0}
              descriptionStyle={{flex: 1}}
              description={_ => (
                <>
                  <Caption>{item.unit ? item.unit : 'N/A'}</Caption>
                  <Text>AVI: {item.stock ? item.stock : 'N/A'}</Text>
                  <Text>Rate: {item.rate ? item.rate : 'N/A'}</Text>
                </>
              )}
              right={_ => (
                <View style={styles.listRight}>
                  <Text style={styles.chip}>Quantity: {item.quantity}</Text>
                </View>
              )}
            />
          );
        }}
      />
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainerStyle: {
    // flex: 1,
    padding: SPACINGS.md,
  },
  listRight: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  chip: {
    backgroundColor: COLORS.secondary,
    flexGrow: 0,
    alignSelf: 'center',
    padding: SPACINGS.xs,
  },

  heading: {
    padding: SPACINGS.md,
  },

  customer: {
    padding: SPACINGS.xs,
    backgroundColor: COLORS.light,
    borderRadius: 5,
  },
  inputStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    ...TYPOGRAPHY.body2,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACINGS.sm,
  },

  clearButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACINGS.xxs,
    paddingHorizontal: SPACINGS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },

  list: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
});
