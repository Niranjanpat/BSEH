import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import VerticalSpacer from '../../../components/VerticalSpacer';
import {
  clearCartItems,
  removeItemFromCart,
} from '../../../store/actions/returns';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import MRPInput from '../../../components/MRPInput';

const ReturnCartScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {recentCustomer: customer, returnItems: cartItems} = useSelector(
    state => state.returns,
  );

  const checkMRPandNavigate = () => {
    const isAllRight = cartItems.every(element => parseInt(element.mrp) > 0);

    if (isAllRight) {
      navigation.navigate(ROUTES.return_checkout);
    } else {
      Alert.alert(
        'Invalid MRP',
        'Seems like you missed MRPs of some or all items.',
      );
    }
  };

  if (cartItems.length < 1) {
    Alert.alert(
      null,
      'No items in the cart. You will be redirected to verticals.',
      [
        {
          text: 'Okay',
          onPress: () => {
            navigation.popToTop();
          },
        },
      ],
    );
  }

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.customer}>
          <Subheading style={{...TYPOGRAPHY.body1}}>Shop</Subheading>
          <Text>{customer.name}</Text>
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
                  <Text>Quantity: {item.quantity}</Text>
                  <VerticalSpacer />
                  <View style={styles.row}>
                    <MRPInput data={item} />
                    <Button
                      icon="close"
                      style={{alignSelf: 'flex-end', marginHorizontal: 5}}
                      theme={{colors: {primary: COLORS.error}}}
                      onPress={() => dispatch(removeItemFromCart(item._id))}>
                      REMOVE
                    </Button>
                  </View>
                </>
              )}
            />
          );
        }}
      />
      <Button
        mode="contained"
        style={{margin: 15}}
        disabled={cartItems.length < 1}
        onPress={checkMRPandNavigate}>
        Next
      </Button>
    </>
  );
};

export default ReturnCartScreen;

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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
