import React, {useEffect, useMemo, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductQuantity from '../../../components/ProductQuantity';
import {
  clearCartItems,
  removeItemFromCart,
} from '../../../store/actions/cart';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import {getSchemes} from '../../../services/order_service';

const OrderCartScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);
  const customer = useSelector(state => state.order.customerVisitStatus);
  const customerForOnCall = useSelector(
    state => state.order.customerForOrderOnCall,
  );
 

  const [isProductCollapsed, setIsProductCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const cartProductItems = useMemo(
    () => (isProductCollapsed ? [] : cartItems),
    [isProductCollapsed, cartItems],
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
          ListHeaderComponent={() => (
            <Header
              isCollapsed={isProductCollapsed}
              onCollapsePressed={() => setIsProductCollapsed(pre => !pre)}
            />
          )}
          ListEmptyComponent={() => (isProductCollapsed ? null : <EmptyView />)}
          renderItem={({item}) => {
            return (
              <List.Item
                style={styles.list}
                titleStyle={styles.title}
                titleNumberOfLines={2}
                title={item.name}
                description={() => (
                  <View>
                    <Caption style={styles.caption}>
                      Unit: {item.unit || 'N/A'}
                    </Caption>
                    <Caption style={styles.caption}>
                      SAP Code: {item.sap_code || 'N/A'}
                    </Caption>
                    <Text style={styles.text}>
                      Dealer Price: ₹{item.dealer_price}
                    </Text>
                    <Text style={styles.text}>MRP: ₹{item.mrp}</Text>
                   
                    <Button
                      icon="delete-outline"
                      compact
                      mode="text"
                      labelStyle={{color: COLORS.error, fontWeight: '600'}}
                      onPress={() => dispatch(removeItemFromCart(item._id))}
                      style={styles.removeButton}>
                      Remove
                    </Button>
                  </View>
                )}
                left={() => (
                  <Image
                    source={{uri: item.photo_url}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )}
                right={() => <ProductQuantity data={item} />}
              />
            );
          }}
        />
      </ScrollView>
      <Button
        mode="contained"
        style={{margin: 15}}
        disabled={
          (cartItems.length < 1 ) || loading
        }
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

const EmptyView = () => {
  return (
    <View style={{alignItems: 'center', marginTop: SPACINGS.lg}}>
      <Caption>:(</Caption>
      <Caption>No product added!</Caption>
      <Caption>Try adding items and return here for checking out.</Caption>
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
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 8,
    elevation: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    color: '#555',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 8,
  },
});
