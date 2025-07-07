import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  Button,
  Caption,
  IconButton,
  List,
  ProgressBar,
  Subheading,
  Text,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {ROUTES} from '../../../../constants/routes';
import {COLORS} from '../../../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../../../constants/theme';

import {
  clearCartItems,
  initOrderWithProducts,
  removeItemFromCart,
  updateItemToCart,
} from '../../../../store/actions/cart';
import {orderDetail, updateOrder} from '../../../../services/activity_service';

const OrderDetail = ({navigation, route}) => {
  const {id} = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOrderItems();
  }, []);

  const getOrderItems = () => {
    setIsLoading(true);
    orderDetail(id)
      .then(res => {
        const {data, success, errors} = res.data;
        console.log(data);
        if (success) {
          setData(data);
          dispatch(initOrderWithProducts(data.products));
        } else if (errors) {
          Alert.alert('Error!', Object.values(errors).join(', '));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const onAddClick = item => {
    let quantity = parseInt(item.quantity);
    quantity = quantity + 1;

    let updated_products = cartItems.map(e => {
      if (e._id === item._id) {
        return {...item, quantity};
      }

      return e;
    });

    dispatch(initOrderWithProducts(updated_products));
  };

  const onMinusClick = item => {
    let quantity = parseInt(item.quantity);
    quantity = quantity - 1;

    if (quantity === 0) {
      dispatch(removeItemFromCart(item._id));
      return;
    }

    if (quantity > 0) {
      let updated_products = cartItems.map(e => {
        if (e._id === item._id) {
          return {...item, quantity};
        }

        return e;
      });

      dispatch(initOrderWithProducts(updated_products));
    }
  };

  const updateOrderById = () => {
    setIsLoading(true);
    updateOrder(id, cartItems)
      .then(res => {
        const {success, errors} = res.data;

        if (success) {
          dispatch(clearCartItems());
          setIsLoading(false);
          Alert.alert('Success', 'Your order has been updated', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        } else if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.heading}>
        <View style={styles.customer}>
          <Subheading style={{...TYPOGRAPHY.body1}}>Shop</Subheading>
          <Text>{data.customer}</Text>
        </View>
        <ProgressBar indeterminate visible={isLoading} />
      </View>
      <FlatList
        style={{flex: 1}}
        data={cartItems}
        keyExtractor={(item, _) => item._id}
        ListHeaderComponent={OrderHeaderComponent}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({item}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              descriptionStyle={{flex: 1}}
              description={_ => (
                <>
                  <Caption>{item.unit ? item.unit : 'N/A'}</Caption>
                  <Text>AVI: {item.stock ? item.stock : 'N/A'}</Text>
                  <Text>Rate: {item.rate ? item.rate : 'N/A'}</Text>
                </>
              )}
              right={props => (
                <View
                  {...props}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text>Quantity</Text>
                  <View style={styles.listRight}>
                    <IconButton
                      icon="minus"
                      onPress={() => onMinusClick(item)}
                    />
                    <Text style={styles.chip}>{item.quantity}</Text>
                    <IconButton icon="plus" onPress={() => onAddClick(item)} />
                  </View>
                </View>
              )}
            />
          );
        }}
      />
      <View
        style={{paddingHorizontal: SPACINGS.md, paddingVertical: SPACINGS.xs}}>
        <Button mode="contained" disabled={isLoading} onPress={updateOrderById}>
          Update
        </Button>
      </View>
    </View>
  );
};

export default OrderDetail;

const OrderHeaderComponent = () => {
  const navigation = useNavigation();

  return (
    <View style={{alignSelf: 'flex-end', marginBottom: SPACINGS.xs}}>
      <Button
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate(ROUTES.vertical)}>
        Add items
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
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
    paddingBottom: 0,
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
