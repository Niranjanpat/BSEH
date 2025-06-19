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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CameraModal from '../../../components/CameraModal';
import VerticalSpacer from '../../../components/VerticalSpacer';

import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {saveOrder, sendMail} from '../../../services/order_service';
import {clearCartItems ,clearCartPromotionalItems} from '../../../store/actions/cart';
import {postCustomerCheckOut} from '../../../store/actions/order';
import usePromotionalItems from '../../../hooks/usePromotionalItems';
import {saveSample} from '../../../services/sample_service';

const SampleCheckOutScreen = ({navigation, route}) => {
  const dispatch = useDispatch();

  const {schemes, total_order_amount, total_order_quantity} = route.params
    ?.data ?? {schemes: [], total_order_amount: 0, total_order_quantity: 0};

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderAndMailLoading, setOrderAndMailLoading] = useState(false);
  const [isProductCollapsed, setIsProductCollapsed] = useState(false);
  const [isPromotionalCollapsed, setIsPromotionalCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);
  const image = useRef(null);

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

  const cartProductItems = useMemo(
    () => (isProductCollapsed ? [] : schemes),
    [isProductCollapsed, schemes],
  );

  const cartPromotionalItems = useMemo(
    () => (isPromotionalCollapsed ? [] : cartPromoItems),
    [isPromotionalCollapsed, cartPromoItems],
  );

  const total = useMemo(
    () =>
      schemes.reduce(
        (price, item) => price + parseFloat(item?.net_amount ?? 0),
        0.0,
      ),
    [schemes],
  );

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

    const formData = new FormData();
    if (image.current) {
      formData.append('sample_photo', {
        uri: image.current,
        type: 'image/jpeg',
        name: 'sample.jpeg',
      });
    }

    const productArray = cartPromoItems.map(item => ({
      _id: item._id,
      quantity: item.cartQuantity,
    }));

    formData.append('product', JSON.stringify(productArray));
      saveSample(formData)
        .then(res => {
          const {success, errors, data} = res.data;

          console.log('submitOrder', res.data);
          if (success) {
            dispatch(clearCartItems());
           // assignPromoItems(true);
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

          console.log('submitAndMail', res.data);
          if (success) {
            dispatch(clearCartPromotionalItems());

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
              });
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
        });
    } else {
      setOrderAndMailLoading(true);
      assignPromoItems(false);
    }
  };

  const assignPromoItems = isShowDialog => {
    if (cartPromoItems.length > 0) {
      assignCustomerPromotionalItems(cartPromoItems);
    } else {
      if (isShowDialog) {
        showSuccessDialog();
      }
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
                    titleNumberOfLines={2}
                    title={item.name}
                    description={() => (
                      <>
                        <Caption>SAP Code: {item.sap_code || 'N/A'}</Caption>
                        <Caption>MRP: ₹{item.mrp || 'N/A'}</Caption>
                        <Caption>
                          Dealer Price: ₹{item.dealer_price || 'N/A'}
                        </Caption>
                      </>
                    )}
                    left={() => (
                      <Image
                        source={{uri: item.photo_url}}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 8,
                          marginRight: 10,
                        }}
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
                );
              }}
            />
          </>
        )}
      </ScrollView>
      <View style={styles.grandTotalContainer}>
        <Text>Total order quantity: </Text>
        <Subheading>{total_order_quantity}</Subheading>
      </View>
      <View style={styles.grandTotalContainer}>
        <Text>Total order value: </Text>
        <Subheading>₹{total.toFixed(2)}</Subheading>
      </View>
      <View style={styles.buttonRow}>
        {/* {cartItems.length > 0 && (
          <Button
            onPress={submitAndMail}
            loading={orderAndMailLoading}
            disabled={orderAndMailLoading}
            mode="contained">
            Save & Send Mail
          </Button>
        )} */}
        <Button
          onPress={submit}
          loading={orderLoading}
          disabled={orderLoading}
          mode="contained">
          Save Order
        </Button>
      </View>
      <SampleImageModal
        image={image}
        visible={visible}
        hideModal={hideModal}
        submitOrder={submitOrder}></SampleImageModal>
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
          buttonText="Take Sample Photo"
          onImageSelect={onImageSelected}></CameraModal>

        <Button
          mode="contained"
          onPress={() => {
            hideModal();
            submitOrder();
          }}
          style={styles.closeButton}>
          Submit
        </Button>
      </Modal>
    </Portal>
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
    padding: 10,
    backgroundColor: '#fff',
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
  //here somthing
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: '90%',
    gap: 10,
  },
  closeButton: {
    color: COLORS.primary,
    marginTop: 20,
  },
  dialogTitle: {alignSelf: 'center', marginBottom: 10},
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
});
