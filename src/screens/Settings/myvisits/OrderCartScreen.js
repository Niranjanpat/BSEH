import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductQuantity from '../../../components/ProductQuantity';
import VerticalSpacer from '../../../components/VerticalSpacer';
import {clearCartItems, removeItemFromCart} from '../../../store/actions/cart';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';

const OrderCartScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);
  const customer = useSelector(state => state.order.customerVisitStatus);
  const customerForOnCall = useSelector(state => state.order.customerForOrderOnCall);

  console.log('dfdfdf', customerForOnCall);
  return (
    <>
      <View style={styles.heading}>
        <View style={styles.navigate}>
          <Button onPress={() => navigation.pop(3)}>Go To Vertical</Button>
          <Button onPress={() => navigation.pop(2)}>Go To Brand</Button>
        </View>
        <View style={styles.customer}>
          <Subheading style={{...TYPOGRAPHY.body1}}>Shop</Subheading>
          <Text>{customer.customer_name ?? customerForOnCall.name}</Text>
        </View>
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item, _) => item._id}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        ListHeaderComponent={() => <Header />}
        ListEmptyComponent={() => <EmptyView />}
        renderItem={({item}) => {
          console.log(item);
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
                  {item.retail_price && (
                    <Text>Per unit: {item.retail_price}</Text>
                  )}
                  <VerticalSpacer />
                  <Button
                    icon="close"
                    style={{alignSelf: 'flex-end', marginHorizontal: 5}}
                    theme={{colors: {primary: COLORS.error}}}
                    onPress={() => dispatch(removeItemFromCart(item._id))}>
                    REMOVE
                  </Button>
                </>
              )}
              right={_ => <ProductQuantity data={item} />}
            />
          );
        }}
      />
      <Button
        mode="contained"
        style={{margin: 15}}
        disabled={cartItems.length < 1}
        onPress={() => navigation.navigate(ROUTES.order_checkout)}>
        Next
      </Button>
    </>
  );
};

export default OrderCartScreen;

const Header = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.headerContainer}>
      <Text style={{...TYPOGRAPHY.body1}}>Added Products</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.clearButton}
        onPress={() => dispatch(clearCartItems())}>
        <Text style={{...TYPOGRAPHY.light, color: COLORS.light}}>
          Clear all{' '}
        </Text>
        <Icon name="close" color={COLORS.light} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const EmptyView = () => {
  return (
    <View style={{alignItems: 'center', marginTop: SPACINGS.lg}}>
      <Caption>:(</Caption>
      <Caption>Your cart is empty!</Caption>
      <Caption>Try adding items and return here for checking out.</Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: SPACINGS.md,
  },
  navigate: {
    flexDirection: 'row',
  },
  heading: {
    padding: SPACINGS.md,
  },

  customer: {
    padding: SPACINGS.xs,
    backgroundColor: COLORS.light,
    borderRadius: 5,
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
