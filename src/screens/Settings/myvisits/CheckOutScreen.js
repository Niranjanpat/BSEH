import React, {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import VerticalSpacer from '../../../components/VerticalSpacer';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {saveOrder, sendMail} from '../../../services/order_service';
import {clearCartItems} from '../../../store/actions/cart';
import {postCustomerCheckOut} from '../../../store/actions/order';
import usePromotionalItems from '../../../hooks/usePromotionalItems';

const CheckOutScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderAndMailLoading, setOrderAndMailLoading] = useState(false);
  const [isProductCollapsed, setIsProductCollapsed] = useState(false);
  const [isPromotionalCollapsed, setIsPromotionalCollapsed] = useState(false);

  const cartItems = useSelector(state => state.cart);
  const customer = useSelector(state => state.order.customerVisitStatus);
  const hideCheckoutAfterOrder = useSelector(state => state.order.hideCheckoutAfterOrder);
  const customerForOnCall = useSelector(state => state.order.customerForOrderOnCall);
  const cartPromoItems = useSelector(state => state.cartPromotional);

  const {loading, isAssignedPromotionalItems, assignCustomerPromotionalItems} = usePromotionalItems();

  console.log('cart items', cartItems, cartPromoItems);

  const cartProductItems = useMemo(
    () => (isProductCollapsed ? [] : cartItems),
    [isProductCollapsed, cartItems],
  );

  const cartPromotionalItems = useMemo(
    () => (isPromotionalCollapsed ? [] : cartPromoItems),
    [isPromotionalCollapsed, cartPromoItems],
  );

  const total = useMemo(() => cartItems.reduce(
    (price, item) =>
      price + parseInt(item.quantity) * parseFloat(item.retail_price),
    0.0,
  ), [cartItems]);

  useEffect(() => {
    if (isAssignedPromotionalItems) {
      showSuccessDialog();
    }
    setOrderLoading(false);
    setOrderAndMailLoading(false);
  }, [isAssignedPromotionalItems, loading])

  const submitOrder = () => {
    if (cartItems.length > 0) {
      setOrderLoading(true);
      saveOrder(cartItems, hideCheckoutAfterOrder ? customerForOnCall : customer, hideCheckoutAfterOrder)
        .then(res => {
          const {success, errors, data} = res.data;

          console.log('submitOrder', res.data);
          if (success) {
            dispatch(clearCartItems());
            assignPromoItems(true);
          } else {
            setOrderLoading(false);
            if (errors.add_order) {
              return Alert.alert('Failed', errors.add_order);
            }
            Alert.alert('Failed', JSON.stringify(errors));
          }
        })
        .catch(error => {
          console.log('submitOrder', error);
          setOrderLoading(false);
        })
    } else {
      setOrderLoading(true);
      assignPromoItems(false);
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
                assignPromoItems(true);
                if (success) {
                  
                } else {
                  console.log(errors);
                }
              })
              .catch(error => {
                console.log(error);
                assignPromoItems(true);
              })
          } else {
            setOrderAndMailLoading(false);
            if (errors.add_order) {
              return Alert.alert('Failed', errors.add_order);
            }
            Alert.alert('Failed', JSON.stringify(errors));
          }
        })
        .catch(error => {
          console.log('submitOrder', error);
          setOrderAndMailLoading(false);
        })
    } else {
      setOrderAndMailLoading(true);
      assignPromoItems(false);
    }
  };

  const assignPromoItems = (isShowDialog) => {
    if (cartPromoItems.length > 0) {
      assignCustomerPromotionalItems(cartPromoItems);
    } else {
      if (isShowDialog) {
        showSuccessDialog();
      }
    }
  }

  const showSuccessDialog = () => {
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
  }

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
      </View>
      <ScrollView nestedScrollEnabled={true}>
        {cartItems.length > 0 && (
          <>
            <Header
              isForPromotional={false}
              isCollapsed={isProductCollapsed}
              onCollapsePressed={() => setIsProductCollapsed(pre => !pre)}
            />
            <FlatList
              nestedScrollEnabled={true}
              data={cartProductItems}
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
          </>
        )}
        {cartPromoItems.length > 0 && (
          <>
            <Header
              isForPromotional={true}
              isCollapsed={isPromotionalCollapsed}
              onCollapsePressed={() => setIsPromotionalCollapsed(pre => !pre)}
            />
            <FlatList
              nestedScrollEnabled={true}
              data={cartPromotionalItems}
              keyExtractor={(item, _) => item.id}
              contentContainerStyle={styles.promotionalContentContainerStyle}
              renderItem={({item}) => {
                return (
                  <List.Item
                    style={styles.list}
                    titleStyle={{fontWeight: 'bold'}}
                    titleNumberOfLines={10}
                    title={item.promotional_item_name}
                    descriptionStyle={{flex: 1}}
                    description={_ => (
                      <>
                        <Caption>
                          {item.promotional_item_sap_code
                            ? item.promotional_item_sap_code
                            : 'N/A'}
                        </Caption>
                        <View style={{flex: 1}} />
                        <Text>
                          Quantity : {item.quantity ? item.quantity : 'N/A'}
                        </Text>
                      </>
                    )}
                    right={_ => (
                      <View style={styles.itemsCount}>
                        <Text>{item.cartQuantity}</Text>
                      </View>
                    )}
                  />
                );
              }}
            />
          </>
        )}
      </ScrollView>
      <View style={styles.grandTotalContainer}>
        <Text>Total order value: </Text>
        <Subheading>{total.toFixed(2)}</Subheading>
      </View>
      <View style={styles.buttonRow}>
        {(cartItems.length > 0) && <Button
          onPress={submitAndMail}
          loading={orderAndMailLoading}
          disabled={orderAndMailLoading}
          mode="contained">
          Save & Send Mail
        </Button>}
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

const Header = ({isForPromotional, isCollapsed, onCollapsePressed}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={{...TYPOGRAPHY.body1, textAlign: 'center'}}>
        {isForPromotional ? 'Added Promotionals' : 'Added Products'}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.clearButton, {backgroundColor: COLORS.accentPrimary}]}
        onPress={onCollapsePressed}>
        {isCollapsed ? (
          <Icon name="chevron-down" color={COLORS.light} size={20} />
        ) : (
          <Icon name="chevron-up" color={COLORS.light} size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingHorizontal: SPACINGS.md,
    paddingTop: SPACINGS.xs,
  },

  promotionalContentContainerStyle: {
    paddingHorizontal: SPACINGS.md,
    paddingVertical: SPACINGS.xs,
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

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACINGS.md,
  },

  clearButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACINGS.xxs,
    paddingHorizontal: SPACINGS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: SPACINGS.xxs,
  },
});
