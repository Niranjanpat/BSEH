import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Button,
  Caption,
  Divider,
  Subheading,
  IconButton,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

import VerticalSpacer from '../../../components/VerticalSpacer';
import HorizontalSpacer from '../../../components/HorizontalSpacer';
import LastTenVisitsModal from '../../../components/myvisits/LastTenVisitsModal';
import TopSellingProductsModal from '../../../components/myvisits/TopSellingProductsModal';

import {URLS} from '../../../constants/urls';
import {IMAGE} from '../../../constants/images';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';

import client from '../../../services/axios_client';

import {
  getCustomerVisitStatus,
  postCustomerCheckIn,
  postCustomerCheckOut,
  setHideCheckoutAfterOrderPlaces,
} from '../../../store/actions/order';
import ReturnOptionsModal from '../../../components/myvisits/ReturnOptionsModal';
import {initReturnCart, storeRecentVisit} from '../../../store/actions/returns';
import OrderSummaryModal from '../../../components/myvisits/OrderSummaryModal';
import {clearCartItems, clearCartPromotionalItems} from '../../../store/actions/cart';
import {getCustomerTarget} from '../../../services/retailer_services';
import CustomerTarget from '../../../components/CustomerTarget';
import {useFocusEffect} from '@react-navigation/core';
import MMKVStorage from 'react-native-mmkv-storage';
import dayjs from 'dayjs';
import {sendOTP} from '../../../services/activity_service';
import PromotionalItemsModal from '../../../components/promotional_item/PromotionalItemsModal';

const mmkv = new MMKVStorage.Loader().initialize();

const MyVisitDetailsScreen = ({route, navigation}) => {
  const data = route.params.data;
  const dispatch = useDispatch();

  const [customer, setCustomer] = useState(null);
  const [customerTarget, setCustomerTarget] = useState([]);
  const [loading, setLoading] = useState(false);
  const {customerVisitStatus} = useSelector(state => state.order);
  const {role, token} = useSelector(state => state.auth);

  const [visitLogVisible, setVisitLogVisible] = useState(false);
  const [topSellingVisible, setTopSellingVisible] = useState(false);
  const [returnDialogVisible, setReturnDialogVisible] = useState(false);
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);
  const [isCheckOutDisabled, setCheckOutDisabled] = useState(false);
  const [promotionalVisible, setPromotionalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchCustomerDetails();
    }, [navigation]),
  );

  useEffect(() => {
    fetchCustomerTarget();
    dispatch(clearCartItems());
    dispatch(clearCartPromotionalItems());
    dispatch(initReturnCart());
    dispatch(storeRecentVisit(data));
    dispatch(getCustomerVisitStatus());
    dispatch(setHideCheckoutAfterOrderPlaces(false))
  }, []);

  // useEffect(() => {
  //   let timeOut = null;
  //   const checkedInAt = mmkv.getString('checked_in_at');
  //   if (
  //     customerVisitStatus &&
  //     customer &&
  //     checkedInAt &&
  //     customerVisitStatus.status &&
  //     customerVisitStatus.customer_id === data._id
  //   ) {
  //     if (dayjs(checkedInAt).add(5, 'minute').isAfter(dayjs())) {
  //       setCheckOutDisabled(true);
  //       const timeRemaining = dayjs(checkedInAt)
  //         .add(5, 'minute')
  //         .diff(dayjs(), 'millisecond');

  //       timeOut = setTimeout(() => {
  //         setCheckOutDisabled(false);
  //       }, timeRemaining);
  //     } else {
  //       setCheckOutDisabled(false);
  //     }
  //   }

  //   return () => {
  //     if (timeOut) clearTimeout(timeOut);
  //   };
  // }, [customerVisitStatus, customer]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {role === 'sales-officer' || role === 'kam'}
          <IconButton
            icon="map-marker-outline"
            onPress={() =>
              navigation.navigate(ROUTES.edit_customer_location, {
                title: route.params?.title,
                data: customer,
                id: data._id,
              })
            }
          />
          <IconButton
            icon="square-edit-outline"
            onPress={() =>
              navigation.navigate(ROUTES.edit_customer, {
                title: route.params?.title,
                data: customer,
                id: data._id,
              })
            }
          />
          {(role === 'kam' || role === 'dsm' || role === 'sm') && (
            <IconButton
              icon="phone"
              onPress={() =>
                navigation.navigate(ROUTES.owner_number, {
                  id: route.params.data._id,
                  owner_contact_number: customer?.owner_contact_number,
                })
              }
            />
          )}
        </>
      ),
    });
  }, [customer]);

  const checkInFunction = () => {
    {
      Geolocation.getCurrentPosition(
        position => {
          var datas = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            customer_id: data._id,
          };
          customerVisitStatus.status
            ? customerVisitStatus.customer_id === data._id
              ? dispatch(postCustomerCheckOut(datas, navigation))
              : dispatch(postCustomerCheckIn(datas, navigation))
            : dispatch(postCustomerCheckIn(datas, navigation));
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

  const fetchCustomerTarget = () => {
    getCustomerTarget(data._id)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setCustomerTarget(data.targets);
        } else {
          console.log(errors);
        }
      })
      .catch(e => {
        console.log('Customer Target', e);
      });
  };
  async function fetchCustomerDetails() {
    const url = URLS.customer + data._id;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;
      console.log(res.data);

      if (success) {
        setCustomer(data);
      } else {
        console.log('fetchCustomerDetails:::', errors.toString());
      }
    } catch (error) {
      console.log('fetchCustomerDetails:::', error.toString());
    }
  }

  const handleSMSSend = () => {
    setLoading(true);

    sendOTP(data?._id)
      .then(res => {
        setLoading(false);

        const {errors, success} = res?.data;

        if (success) {
          Alert.alert('Success', "OTP has been sent to the owner's number");
          navigation.navigate(ROUTES.verify_otp, {id: data?._id});
        } else {
          const {otp} = errors;

          if (otp) {
            Alert.alert('Error', otp);
            return;
          }

          Alert.alert('Error', JSON.stringify(errors));
        }
      })
      .catch(err => {
        setLoading(false);

        Alert.alert(JSON.stringify(err));
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          source={IMAGE.retailer}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>
      <View style={styles.retailerBasicDetails}>
        <Title numberOfLines={1}>{data.name}</Title>
        <Caption>{data.owner_contact_number}</Caption>
      </View>
      <ScrollView
        horizontal
        style={styles.buttonGroupStyle}
        contentContainerStyle={styles.buttonGroupContentContainer}
        showsHorizontalScrollIndicator={false}>
        <Button
          icon="check-circle-outline"
          mode="contained"
          disabled={isCheckOutDisabled}
          onPress={() => checkInFunction()}>
          {customerVisitStatus.status
            ? customerVisitStatus.customer_id === data._id
              ? 'Check out'
              : 'Check in'
            : 'Check in'}
        </Button>

        {!customer?.is_own_con_num_verified &&
          (role === 'kam' ||
            role === 'dsm' ||
            role === 'sm' ||
            role === 'promoter') && (
            <>
              <HorizontalSpacer />
              <Button
                icon="phone"
                mode="contained"
                onPress={handleSMSSend}
                loading={loading}
                disabled={loading}>
                Verify number
              </Button>
            </>
          )}

        {role == 'promoter' &&
          customerVisitStatus.status &&
          customerVisitStatus.customer_id === data._id && (
            <>
              <HorizontalSpacer />
              <Button
                icon="cash-register"
                mode="contained"
                onPress={() => navigation.navigate(ROUTES.add_promoter_order)}>
                Sales
              </Button>
              <HorizontalSpacer />
              <Button
                icon="cube-outline"
                mode="contained"
                onPress={() =>
                  navigation.navigate(ROUTES.add_promoter_invoice)
                }>
                Closing stock
              </Button>
            </>
          )}

        {role !== 'promoter' &&
          customerVisitStatus.status &&
          customerVisitStatus.customer_id === data._id && (
            <>
              <HorizontalSpacer />
              <Button
                icon="cart-outline"
                mode="contained"
                onPress={() => navigation.navigate(ROUTES.vertical)}>
                Order
              </Button>
              <HorizontalSpacer />
              <Button
                icon="tag-outline"
                mode="contained"
                onPress={() => setPromotionalVisible(true)}>
                Promotional Items
              </Button>
            </>
          )}

        {role !== 'promoter' && (
          <>
            <HorizontalSpacer />
            <Button
              mode="contained"
              icon="keyboard-return"
              onPress={() => setReturnDialogVisible(true)}>
              Return
            </Button>
          </>
        )}
      </ScrollView>

      <View style={styles.detailsContainer}>
        <ScrollView
          contentContainerStyle={styles.bottomDetailsContentContainer}
          showsVerticalScrollIndicator={false}>
          {customerTarget.length > 0 && (
            <CustomerTarget target={customerTarget} />
          )}
          <Subheading>Shop info:</Subheading>
          <Divider />
          <VerticalSpacer />
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>SAP Code</Text>
            <Text> : </Text>
            {customer?.sap_code ? (
              <Text style={styles.detailsValue}>{customer?.sap_code}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Town</Text>
            <Text> : </Text>
            {customer?.town ? (
              <Text style={styles.detailsValue}>{customer?.town}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Beat</Text>
            <Text> : </Text>
            {customer?.route_name ? (
              <Text style={styles.detailsValue}>{customer?.route_name}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Shop type</Text>
            <Text> : </Text>
            {customer?.customer_type_name ? (
              <Text style={styles.detailsValue}>
                {customer?.customer_type_name}
              </Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Customer Activity</Text>
            <Text> : </Text>
            {customer?.customer_activity_category_name ? (
              <Text style={styles.detailsValue}>
                {customer?.customer_activity_category_name}
              </Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Owner's name</Text>
            <Text> : </Text>
            {customer?.owner_name ? (
              <Text style={styles.detailsValue}>{customer?.owner_name}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Email</Text>
            <Text> : </Text>
            {customer?.owner_email ? (
              <Text style={styles.detailsValue}>{customer?.owner_email}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>GST number</Text>
            <Text> : </Text>
            {customer?.gst_number ? (
              <Text style={styles.detailsValue}>{customer?.gst_number}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Billing address</Text>
            <Text> : </Text>
            {customer?.billing_address ? (
              <Text style={styles.detailsValue}>
                {customer?.billing_address}
              </Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Distributor Code</Text>
            <Text> : </Text>
            {customer?.distributor_code ? (
              <Text style={styles.detailsValue}>
                {customer?.distributor_code}
              </Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Distributor Name</Text>
            <Text> : </Text>
            {customer?.distributor_name ? (
              <Text style={styles.detailsValue}>
                {customer?.distributor_name}
              </Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.detailsTitle}>Distributors</Text>
            <Text> : </Text>
            <View>
              {customer?.route_distributors?.length > 0 ? (
                customer?.route_distributors?.map(item => (
                  <Text style={[styles.detailsValue, {marginBottom: 10}]}>
                    {item?.name} ({item?.sap_code})
                  </Text>
                ))
              ) : (
                <Text style={styles.notAvailableTxt}>N/A</Text>
              )}
            </View>
          </View> */}
          {role !== 'promoter' && (
            <>
              <Subheading>More options:</Subheading>
              <Divider />
              <VerticalSpacer />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: SPACINGS.xs,
                  paddingBottom: SPACINGS.sm,
                }}>
                <Card
                  onPress={() => {
                    setOrderSummaryVisible(true);
                  }}>
                  <Card.Content>
                    <Text>Order</Text>
                    <Text>summary</Text>
                  </Card.Content>
                </Card>
                <HorizontalSpacer />
                <Card onPress={() => setVisitLogVisible(true)}>
                  <Card.Content>
                    <Text>Last 10</Text>
                    <Text>visits</Text>
                  </Card.Content>
                </Card>
                <HorizontalSpacer />
                <Card onPress={() => setTopSellingVisible(true)}>
                  <Card.Content>
                    <Text>Top selling</Text>
                    <Text>products</Text>
                  </Card.Content>
                </Card>
              </ScrollView>
            </>
          )}
        </ScrollView>
      </View>

      <ReturnOptionsModal
        onDismiss={setReturnDialogVisible}
        visible={returnDialogVisible}
      />

      <LastTenVisitsModal
        visible={visitLogVisible}
        onClose={setVisitLogVisible}
        id={data._id}
      />
      <TopSellingProductsModal
        visible={topSellingVisible}
        onClose={setTopSellingVisible}
        id={data._id}
      />
      <OrderSummaryModal
        visible={orderSummaryVisible}
        onClose={setOrderSummaryVisible}
        id={data._id}
      />
      <PromotionalItemsModal
        visible={promotionalVisible}
        onDismiss={setPromotionalVisible}
        customerId={data._id}
      />
    </View>
  );
};

export default MyVisitDetailsScreen;

const size = Dimensions.get('window');
const imgSize = size.width * 0.22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  logo: {
    height: imgSize,
    width: imgSize,
  },

  imgContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    padding: SPACINGS.xxs,
    marginTop: SPACINGS.sm,
    backgroundColor: COLORS.light,
  },

  retailerBasicDetails: {
    alignItems: 'center',
    padding: SPACINGS.xs,
  },

  buttonGroupStyle: {
    alignSelf: 'center',
    maxHeight: size.width * 0.12,
    marginBottom: SPACINGS.sm,
  },

  buttonGroupContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACINGS.md,
  },

  bottomButtonGroup: {
    width: size.width,
    flexDirection: 'row',
  },

  detailsContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#cfd8dc',
    width: size.width,
  },

  bottomDetailsContentContainer: {
    padding: SPACINGS.md,
  },

  row: {
    flexDirection: 'row',
    marginBottom: SPACINGS.sm,
    flex: 1,
  },

  detailsTitle: {
    ...TYPOGRAPHY.caption,
    width: size.width * 0.30,
    color: COLORS.accentSecondary,
  },

  detailsValue: {
    flex: 1,
  },

  notAvailableTxt: {
    color: COLORS.accentPrimary,
  },

  button: {
    padding: SPACINGS.sm,
  },
});
