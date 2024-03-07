import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';

import {COLORS} from '../../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import VerticalSpacer from '../../../components/VerticalSpacer';

import {clearCartItems} from '../../../store/actions/returns';
import {saveSalesReturn} from '../../../services/order_service';
import {postCustomerCheckOut} from '../../../store/actions/order';

const ReturnCheckOutScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [orderLoading, setOrderLoading] = useState(false);
  const {customerVisitStatus} = useSelector(state => state.order);

  const {
    returnType,
    returnItems: cartItems,
    recentCustomer: customer,
  } = useSelector(state => state.returns);

  const total = cartItems.reduce(
    (price, item) => price + parseInt(item.quantity) * parseFloat(item.mrp),
    0.0,
  );

  const checkOut = () => {
    {
      Geolocation.getCurrentPosition(
        position => {
          var datas = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          dispatch(postCustomerCheckOut(datas, navigation));
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
    }
  };

  const submitOrder = () => {
    if (cartItems.length > 0) {
      setOrderLoading(true);
      saveSalesReturn(cartItems, customer, returnType)
        .then(res => {
          const {success, errors} = res.data;

          if (success) {
            dispatch(clearCartItems());

            Alert.alert(
              'Success',
              'Your return order has been successfully saved.',
              [
                customerVisitStatus.status && {
                  text: 'Check out',
                  onPress: () => {
                    checkOut();
                    navigation.popToTop();
                  },
                },
                {
                  text: 'Done',
                  onPress: () => navigation.popToTop(),
                },
              ],
            );
          } else {
            if (errors.add_order) {
              return Alert.alert('Failed', errors.add_order);
            }
            Alert.alert('Failed', errors.toString());
          }
        })
        .catch(error => {
          console.log('submitOrder', error);
        })
        .finally(_ => {
          setOrderLoading(false);
        });
    }
  };

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.customer}>
          <Subheading style={{...TYPOGRAPHY.body1}}>Shop</Subheading>
          <Text>{customer.name}</Text>
        </View>
        <VerticalSpacer size={20} />
        <Header />
        <VerticalSpacer />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item, _) => item._id}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({item}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              titleNumberOfLines={10}
              title={item.name}
              descriptionStyle={{flex: 1}}
              description={_ => (
                <>
                  <Caption>{item.unit ? item.unit : 'N/A'}</Caption>
                  <Text>MRP: {item.mrp}</Text>
                </>
              )}
              right={_ => (
                <View style={styles.itemsCount}>
                  <Text>{item.quantity}</Text>
                </View>
              )}
            />
          );
        }}
      />
      <View style={styles.grandTotalContainer}>
        <Text>Total order value: </Text>
        <Subheading>{total.toFixed(2)}</Subheading>
      </View>

      <Button
        onPress={submitOrder}
        loading={orderLoading}
        disabled={orderLoading}
        style={styles.saveOrderBtn}
        mode="contained">
        Save Order
      </Button>
    </>
  );
};

export default ReturnCheckOutScreen;

const Header = () => {
  return (
    <Text style={{...TYPOGRAPHY.body1, textAlign: 'center'}}>
      Added Products
    </Text>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: SPACINGS.md,
    paddingTop: SPACINGS.xs,
  },

  heading: {
    paddingBottom: 0,
    padding: SPACINGS.md,
  },

  customer: {
    borderRadius: 5,
    padding: SPACINGS.xs,
    backgroundColor: COLORS.light,
  },

  list: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  itemsCount: {
    alignSelf: 'center',
    padding: SPACINGS.sm,
    backgroundColor: COLORS.secondary,
  },

  grandTotalContainer: {
    borderTopWidth: 0.4,
    padding: SPACINGS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light,
    borderTopColor: COLORS.lightGrey,
  },

  saveOrderBtn: {
    marginBottom: SPACINGS.sm,
    marginHorizontal: SPACINGS.sm,
  },
});
