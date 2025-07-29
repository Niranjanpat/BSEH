import React, { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Alert, FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductQuantity from '../../../../components/ProductQuantity';
import VerticalSpacer from '../../../../components/VerticalSpacer';

import {SPACINGS, TYPOGRAPHY} from '../../../../constants/theme';
import {COLORS} from '../../../../constants/theme/colors';
import {ROUTES} from '../../../../constants/routes';
import {
  clearCartItems,
  removeItemFromCart,
} from '../../../../store/actions/stock_update_cart';
import ProductStockQuantity from '../../../../components/ProductStockQuantity';
import { saveStockUpdate } from '../../../../services/order_service';

const StockUpdateCartScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const cartItems = useSelector(state => state.stockUpdateCart);
  const sdiForOrder = useSelector(state => state.order.sdiForOrder);

  const updateStock = () => {
    if (cartItems.length > 0) {
      setLoading(true);
      saveStockUpdate(sdiForOrder?._id ?? '', cartItems)
        .then(res => {
          const {success, errors, data} = res.data;

          console.log('stock update', res.data);
          if (success) {
            dispatch(clearCartItems());
            Alert.alert('Success', 'Your stock has been successfully saved.', [
              {
                text: 'Okay',
                onPress: () => navigation.popToTop(),
              },
            ]);
          } else if (errors) {
            Alert.alert('Failed!', Object.values(errors).join(', '));
          }
        })
        .catch(error => {
          console.log('submitOrder', error);
        })
        .finally(_ => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <FlatList
        data={cartItems}
        keyExtractor={(item, _) => item._id}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        ListHeaderComponent={() => <Header sdi={sdiForOrder} />}
        ListEmptyComponent={() => <EmptyView />}
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
              right={_ => <ProductStockQuantity data={item} />}
            />
          );
        }}
      />

      <View style={[styles.navigate, styles.heading]}>
        <Button
          mode="outlined"
          style={{flex: 1, marginRight: 2, borderColor: COLORS.primary}}
          onPress={() => navigation.pop(2)}>
          Go To Brand
        </Button>
        <Button
          mode="contained"
          style={{flex: 1, marginLeft: 2}}
          loading={loading}
          disabled={cartItems.length < 1 || loading}
          onPress={() => {
            updateStock()
          }}>
          Update
        </Button>
      </View>
    </>
  );
};

export default StockUpdateCartScreen;

const Header = ({sdi}) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.headerContainer}>
      <Text style={{...TYPOGRAPHY.body1, flex: 1,}}>Added products for {sdi?.name}</Text>
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
      <Caption>Try adding items and return here for updating stock.</Caption>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: SPACINGS.xs,
  },
  navigate: {
    flexDirection: 'row',
  },
  heading: {
    padding: SPACINGS.xs,
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
