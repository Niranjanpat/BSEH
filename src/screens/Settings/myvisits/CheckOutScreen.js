import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';

import VerticalSpacer from '../../../components/VerticalSpacer';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {saveOrder, sendMail} from '../../../services/order_service';
import {clearCartItems} from '../../../store/actions/cart';
import {postCustomerCheckOut} from '../../../store/actions/order';

const CheckOutScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderAndMailLoading, setOrderAndMailLoading] = useState(false);

  const cartItems = useSelector(state => state.cart);
  const customer = useSelector(state => state.order.customerVisitStatus);
  const hideCheckoutAfterOrder = useSelector(state => state.order.hideCheckoutAfterOrder);
  const customerForOnCall = useSelector(state => state.order.customerForOrderOnCall);

  console.log('cart items', cartItems);

  const total = cartItems.reduce(
    (price, item) =>
      price + parseInt(item.quantity) * parseFloat(item.retail_price),
    0.0,
  );

  const submitOrder = () => {
    if (cartItems.length > 0) {
      setOrderLoading(true);
      saveOrder(cartItems, hideCheckoutAfterOrder ? customerForOnCall : customer, hideCheckoutAfterOrder)
        .then(res => {
          const {success, errors, data} = res.data;

          console.log('submitOrder', res.data);
          if (success) {
            dispatch(clearCartItems());
            Alert.alert('Success', 'Your order has been successfully saved.', [
              !hideCheckoutAfterOrder && {
                text: 'Check out',
                onPress: () => {
                  checkOut();
                  navigation.popToTop();
                },
              },
              {
                text: 'Okay',
                onPress: () => navigation.popToTop(),
              },
            ]);
          } else {
            if (errors.add_order) {
              return Alert.alert('Failed', errors.add_order);
            }
            Alert.alert('Failed', JSON.stringify(errors));
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

  const submitAndMail = () => {
    if (cartItems.length > 0) {
      setOrderAndMailLoading(true);

      saveOrder(cartItems, hideCheckoutAfterOrder ? customerForOnCall : customer, hideCheckoutAfterOrder)
        .then(res => {
          const {success, errors, data} = res.data;

          console.log('submitAndMail', res.data);
          if (success) {
            dispatch(clearCartItems());

            sendMail(data)
              .then(res => {
                const {data, errors, success} = res.data;
                if (success) {
                  Alert.alert(
                    'Success',
                    'Your order has been successfully saved.',
                    [
                      {
                        text: 'Check out',
                        onPress: () => {
                          checkOut();
                          navigation.popToTop();
                        },
                      },
                      {
                        text: 'Okay',
                        onPress: () => navigation.popToTop(),
                      },
                    ],
                  );
                } else {
                  console.log(errors);
                }
              })
              .catch(error => {
                console.log(error);
              })
              .finally(_ => {
                setOrderAndMailLoading(false);
              });
          } else {
            if (errors.add_order) {
              return Alert.alert('Failed', errors.add_order);
            }
            Alert.alert('Failed', JSON.stringify(errors));
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

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.customer}>
          <Subheading style={{...TYPOGRAPHY.body1}}>Shop</Subheading>
          <Text>{customer.customer_name ?? customerForOnCall.name}</Text>
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
                  <Text>AVI: {item.stock ? item.stock : 'N/A'}</Text>
                  {item.distributorsellingprice && (
                    <Text>Per unit: {item.distributorsellingprice}</Text>
                  )}
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
      <View style={styles.buttonRow}>
        <Button
          onPress={submitAndMail}
          loading={orderAndMailLoading}
          disabled={orderAndMailLoading}
          mode="contained">
          Save & Send Mail
        </Button>
        <Button
          onPress={submitOrder}
          loading={orderLoading}
          disabled={orderLoading}
          mode="contained">
          Save Order
        </Button>
      </View>
    </>
  );
};

export default CheckOutScreen;

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

  buttonRow: {
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
