import React, {useEffect, useMemo, useState, useRef} from 'react';
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
import Geolocation from 'react-native-geolocation-service';
import {
  Button,
  Caption,
  List,
  Subheading,
  Text,
  Modal,
  Portal,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CameraModal from '../../../components/CameraModal';
import VerticalSpacer from '../../../components/VerticalSpacer';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {saveOrder, sendMail} from '../../../services/order_service';
import {
  clearCartItems,
  clearCartPromotionalItems,
} from '../../../store/actions/cart';
import {postCustomerCheckOut} from '../../../store/actions/order';
import usePromotionalItems from '../../../hooks/usePromotionalItems';
import {saveSample} from '../../../services/sample_service';
import {
   removeItemFromCartPromotional 
} from '../../../store/actions/cart';
import { ROUTES } from '../../../constants/routes';

const SampleCheckOutScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  const cartItems = useSelector(state => state.cart);
  const customer = useSelector(state => state.order.customerVisitStatus);
  const hideCheckoutAfterOrder = useSelector(
    state => state.order.hideCheckoutAfterOrder,
  );
  const customerForOnCall = useSelector(
    state => state.order.customerForOrderOnCall,
  );
  const cartPromoItems = useSelector(state => state.cartPromotional);

  const {loading, isAssignedPromotionalItems, assignCustomerPromotionalItems} =
    usePromotionalItems();

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderAndMailLoading, setOrderAndMailLoading] = useState(false);
  const [isPromotionalCollapsed, setIsPromotionalCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);
  const [totalOrderValue, setTotalOrderValue] = useState(0);

  const image = useRef(null);

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  const cartPromotionalItems = useMemo(
    () => (isPromotionalCollapsed ? [] : cartPromoItems),
    [isPromotionalCollapsed, cartPromoItems],
  );

  useEffect(() => {
    const {quantity, value} = cartPromoItems.reduce(
      (acc, {cartQuantity = 0, mrp = 0}) => {
        acc.quantity += cartQuantity;
        acc.value += mrp * cartQuantity;
        return acc;
      },
      {quantity: 0, value: 0},
    );

    setTotalOrderQuantity(quantity);
    setTotalOrderValue(value);
  }, [cartPromoItems]);

  useEffect(() => {
    if (isAssignedPromotionalItems) {
      showSuccessDialog();
    }
    setOrderLoading(false);
    setOrderAndMailLoading(false);
  }, [isAssignedPromotionalItems, loading]);

  const submit = () => {
    showModal(true);
  };

  const submitOrder = () => {
    if (!image.current) {
      Alert.alert('Error', 'Please Take Sample Image');
      return;
    }

    setOrderLoading(true);
    const formData = new FormData();

    formData.append('photo', {
      uri: image.current,
      type: 'image/jpeg',
      name: 'sample.jpeg',
    });

    const productArray = cartPromoItems.map(item => ({
      _id: item._id,
      quantity: item.cartQuantity,
    }));

    formData.append('products', JSON.stringify(productArray));

    saveSample(formData)
      .then(res => {
        const {success, errors, data} = res.data;
        if (success) {
          dispatch(clearCartPromotionalItems());
          Alert.alert('Success', 'Order is Saved Successfully');
         navigation.goBack();
         navigation.goBack(); 
        } else {
          if (errors.add_order) {
            Alert.alert('Failed', errors.add_order);
          } else {
           Alert.alert('Error', Object.values(errors).join(', '));
          }
        }
        setOrderLoading(false);
      })
      .catch(error => {
        console.log('submitOrder', error);
        setOrderLoading(false);
      });
  };

  const submitAndMail = () => {
    if (cartItems.length > 0) {
      setOrderAndMailLoading(true);
      saveOrder(
        cartItems,
        hideCheckoutAfterOrder ? customerForOnCall : customer,
        hideCheckoutAfterOrder,
      )
        .then(res => {
          const {success, errors, data} = res.data;
          if (success) {
            dispatch(clearCartPromotionalItems());
            sendMail(data)
              .then(res => {
                const {success} = res.data;
                assignPromoItems(true);
              })
              .catch(error => {
                console.log(error);
                assignPromoItems(true);
              });
          } else {
            if (errors.add_order) {
              Alert.alert('Failed', errors.add_order);
            } else {
              Alert.alert('Failed', JSON.stringify(errors));
            }
            setOrderAndMailLoading(false);
          }
        })
        .catch(error => {
          console.log('submitOrder', error);
          setOrderAndMailLoading(false);
        });
    } else {
      setOrderAndMailLoading(true);
      assignPromoItems(false);
    }
  };

  const assignPromoItems = isShowDialog => {
    if (cartPromoItems.length > 0) {
      assignCustomerPromotionalItems(cartPromoItems);
    } else if (isShowDialog) {
      showSuccessDialog();
    }
  };

  const showSuccessDialog = () => {
    Alert.alert('Success', 'Your Sample has been successfully saved.', [
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
  };

  const checkOut = () => {
    Geolocation.getCurrentPosition(
      position => {
        const datas = {
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
  };

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.customer}>
          <Subheading style={TYPOGRAPHY.body1}>Shop</Subheading>
          <Text>{customer.customer_name ?? customerForOnCall.name}</Text>
        </View>
        <VerticalSpacer size={20} />
      </View>

      <ScrollView nestedScrollEnabled>
        {cartPromoItems.length > 0 && (
          <>
            <Header
              isForPromotional
              isCollapsed={isPromotionalCollapsed}
              onCollapsePressed={() => setIsPromotionalCollapsed(prev => !prev)}
            />
            <FlatList
              nestedScrollEnabled
              data={cartPromotionalItems}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.promotionalContentContainerStyle}
              renderItem={({item}) => (
                <List.Item
                  style={styles.list}
                  titleStyle={{fontWeight: 'bold'}}
                  titleNumberOfLines={2}
                  title={item.name}
                  description={() => (
                    <>
                      <Caption>SAP Code: {item.sap_code || 'N/A'}</Caption>
                      <Caption>MRP: ₹{item.mrp || 'N/A'}</Caption>
                      <Caption>
                        Dealer Price: ₹{item.dealer_price || 'N/A'}
                      </Caption>
                      <Button
                        icon="delete-outline"
                        compact
                        mode="text"
                        labelStyle={{color: COLORS.error, fontWeight: '600'}}
                        onPress={() => dispatch(removeItemFromCartPromotional(item._id))}
                        style={styles.removeButton}>
                        Remove
                      </Button>
                    </>
                  )}
                  left={() => (
                    <Image
                      source={{uri: item.photo_url}}
                      style={styles.image}
                    />
                  )}
                  right={() => (
                    <View style={styles.itemsCount}>
                      <Text style={styles.quantityText}>
                        {item.cartQuantity}
                      </Text>
                    </View>
                  )}
                />
              )}
            />
          </>
        )}
      </ScrollView>

      <View style={styles.totalContainer}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Quantity</Text>
          <Text style={styles.totalValue}>{totalOrderQuantity}</Text>
        </View>
        <Divider
          style={{height: '100%', width: 1, backgroundColor: COLORS.lightGrey}}
        />
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Value</Text>
          <Text style={styles.totalValue}>₹{totalOrderValue.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Button
          onPress={submit}
          loading={orderLoading}
          disabled={orderLoading}
          mode="contained"
          buttonColor={COLORS.primary}
          style={{flex: 1, marginHorizontal: 10}}>
          {orderLoading ? 'Saving...' : 'Save Order'}
        </Button>
      </View>

      <SampleImageModal
        image={image}
        visible={visible}
        hideModal={hideModal}
        submitOrder={submitOrder}
      />
    </>
  );
};

const Header = ({isForPromotional, isCollapsed, onCollapsePressed}) => (
  <View style={styles.headerContainer}>
    <Text style={[TYPOGRAPHY.body1, {textAlign: 'center'}]}>
      {isForPromotional ? 'Added Samples' : 'Added Products'}
    </Text>
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.clearButton, {backgroundColor: COLORS.primary}]}
      onPress={onCollapsePressed}>
      <Icon
        name={isCollapsed ? 'chevron-down' : 'chevron-up'}
        color={COLORS.light}
        size={20}
      />
    </TouchableOpacity>
  </View>
);

const SampleImageModal = ({image, visible, hideModal, submitOrder}) => {
  const onImageSelected = img => {
    image.current = img;
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <Text variant="titleLarge" style={styles.dialogTitle}>
          Sample Image
        </Text>
        <CameraModal
          buttonText="Sample"
          onImageSelect={onImageSelected}
        />
        <Button
          mode="contained"
          onPress={() => {
            hideModal();
            submitOrder();
          }}
          buttonColor={COLORS.primary}
          style={styles.closeButton}>
          Submit
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  heading: {
    paddingBottom: 0,
    padding: SPACINGS.md,
  },
  customer: {
    borderRadius: 8,
    padding: SPACINGS.sm,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  promotionalContentContainerStyle: {
    paddingHorizontal: SPACINGS.md,
    paddingBottom: SPACINGS.md,
  },
  list: {
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemsCount: {
    minWidth: 40,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f1f9fe',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.light,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  totalBox: {
    flex: 1,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACINGS.md,
    marginVertical: 10,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    gap: 10,
  },
  closeButton: {
    marginTop: 20,
  },
  dialogTitle: {
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default SampleCheckOutScreen;
