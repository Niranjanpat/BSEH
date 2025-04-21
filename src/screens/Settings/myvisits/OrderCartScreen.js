import React, { useEffect, useMemo, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Alert, FlatList, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductQuantity from '../../../components/ProductQuantity';
import VerticalSpacer from '../../../components/VerticalSpacer';
import {clearCartItems, clearCartPromotionalItems, removeItemFromCart} from '../../../store/actions/cart';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import PromotionalItemWithRemove from '../../../components/promotional_item/PromotionalItemWithRemove';
import { useNavigation } from '@react-navigation/native';
import { getSchemes } from '../../../services/order_service';

const OrderCartScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);
  const customer = useSelector(state => state.order.customerVisitStatus);
  const customerForOnCall = useSelector(state => state.order.customerForOrderOnCall);
  const cartPromoItems = useSelector(state => state.cartPromotional);

  const [isProductCollapsed, setIsProductCollapsed] = useState(false);
  const [isPromotionalCollapsed, setIsPromotionalCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const cartProductItems = useMemo(
    () => (isProductCollapsed ? [] : cartItems),
    [isProductCollapsed, cartItems],
  );

  const cartPromotionalItems = useMemo(
    () => (isPromotionalCollapsed ? [] : cartPromoItems),
    [isPromotionalCollapsed, cartPromoItems],
  );

  const handleNext = () => {
    setLoading(true);
    getSchemes(cartItems, customer?.customer_id ?? customerForOnCall._id)
      .then(res => {
        setLoading(false);
        const {success, data, errors} = res?.data;
        console.log(data);
        
        if (success) {
          navigation.navigate(ROUTES.order_checkout, {data: data});
        } else if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);

        console.log('err-----------', err);
      });
  };

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
      <ScrollView nestedScrollEnabled={true}>
        <FlatList
          nestedScrollEnabled={true}
          data={cartProductItems}
          keyExtractor={(item, _) => item._id}
          contentContainerStyle={styles.contentContainerStyle}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          ListHeaderComponent={() => <Header isCollapsed={isProductCollapsed} onCollapsePressed={() => setIsProductCollapsed(pre => !pre)}/>}
          ListEmptyComponent={() => isProductCollapsed ? null : <EmptyView />}
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
        <FlatList
          nestedScrollEnabled={true}
          data={cartPromotionalItems}
          keyExtractor={(item, _) => item.id}
          contentContainerStyle={styles.promotionalContentContainerStyle}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
          ListHeaderComponent={() => <HeaderPromotional isCollapsed={isPromotionalCollapsed} onCollapsePressed={() => setIsPromotionalCollapsed(pre => !pre)}/>}
          ListEmptyComponent={() => isPromotionalCollapsed ? null : <EmptyViewPromotional />}
          renderItem={({item}) => {
            console.log(item);
            return (
              <View style={{marginBottom: 10}}>
                <PromotionalItemWithRemove item={item} />
              </View>
            );
          }}
        />
      </ScrollView>
      <Button
        mode="contained"
        style={{margin: 15}}
        disabled={(cartItems.length < 1 && cartPromoItems.length < 1) || loading}
        loading={loading}
        onPress={handleNext}>
        Next
      </Button>
    </>
  );
};

export default OrderCartScreen;

const Header = ({isCollapsed, onCollapsePressed}) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.headerContainer}>
      <Text style={{...TYPOGRAPHY.body1, flex: 1}}>Added Products</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.clearButton}
        onPress={() => dispatch(clearCartItems())}>
        {/* <Text style={{...TYPOGRAPHY.light, color: COLORS.light}}>
          Clear all{' '}
        </Text> */}
        <Icon name="cart-remove" color={COLORS.light} size={20} />
      </TouchableOpacity>
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

const HeaderPromotional = ({isCollapsed, onCollapsePressed}) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.headerContainer}>
      <Text style={{...TYPOGRAPHY.body1, flex: 1}}>Added Promotionals</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.clearButton}
        onPress={() => dispatch(clearCartPromotionalItems())}>
        <Icon name="cart-remove" color={COLORS.light} size={20} />
      </TouchableOpacity>
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

const EmptyView = () => {
  return (
    <View style={{alignItems: 'center', marginTop: SPACINGS.lg}}>
      <Caption>:(</Caption>
      <Caption>No product added!</Caption>
      <Caption>Try adding items and return here for checking out.</Caption>
    </View>
  );
};

const EmptyViewPromotional = () => {

  const navigation = useNavigation();

  return (
    <View style={{alignItems: 'center', marginTop: SPACINGS.lg}}>
      <Caption>:(</Caption>
      <Caption>No promotionals added!</Caption>
      <Caption>Try adding items and return here for checking out.</Caption>
      <Button
        icon="plus"
        theme={{colors: {primary: COLORS.primary}}}
        onPress={() => navigation.navigate(ROUTES.user_promotional_items)}>
        Add
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: SPACINGS.md,
  },
  promotionalContentContainerStyle: {
    paddingHorizontal: SPACINGS.md,
    paddingBottom: SPACINGS.md,
  },
  navigate: {
    flexDirection: 'row',
    paddingVertical: SPACINGS.xxs,
  },
  heading: {
    paddingHorizontal: SPACINGS.sm,
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
    marginHorizontal: SPACINGS.xxs,
  },

  list: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
});
