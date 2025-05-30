import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Caption,
  Title,
  Button,
  Text,
  Card,
  Subheading,
  Divider,
  Appbar,
  IconButton,
} from 'react-native-paper';
import VerticalSpacer from '../../components/VerticalSpacer';
import HorizontalSpacer from '../../components/HorizontalSpacer';

import {URLS} from '../../constants/urls';
import {IMAGE} from '../../constants/images';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../constants/theme';

import client from '../../services/axios_client';
import TopSellingProductsModal from '../../components/myvisits/TopSellingProductsModal';
import LastTenVisitsModal from '../../components/myvisits/LastTenVisitsModal';
import useLocationPermission from '../../utils/useLocationPermission';
import OrderSummaryModal from '../../components/myvisits/OrderSummaryModal';
import {useDispatch, useSelector} from 'react-redux';
import {getRetailerList} from '../../store/actions/retailer';
import CustomerTarget from '../../components/CustomerTarget';
import {getCustomerTarget} from '../../services/retailer_services';
import {ROUTES} from '../../constants/routes';
import {
  setCustomerForOrderOnCall,
  setHideCheckoutAfterOrderPlaces,
} from '../../store/actions/order';
import LoadingView from '../../components/LoadingView';

const MyVisitDetailsScreen = ({route, navigation}) => {
  const {data, title} = route.params;
  const [customer, setCustomer] = useState(null);
  const [customerTarget, setCustomerTarget] = useState([]);
  const {role} = useSelector(state => state.auth);
  const {customerVisitStatus} = useSelector(state => state.order);

  const [visitLogVisible, setVisitLogVisible] = useState(false);
  const [topSellingVisible, setTopSellingVisible] = useState(false);
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [requestLocationPermission] = useLocationPermission();
  const dispatch = useDispatch();
  useEffect(() => {
    fetchCustomerDetails();
    requestLocationPermission();
    fetchCustomerTarget();
    if (!customerVisitStatus.status) {
      console.log('not checked in');
      dispatch(setHideCheckoutAfterOrderPlaces(true));
      dispatch(setCustomerForOrderOnCall(data._id, data.name));
    }
  }, []);

  async function fetchCustomerDetails() {
    setLoadingDetails(true);
    const url = URLS.customer + data._id;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;
      if (success) {
        setCustomer(data);
      } else {
        console.log('fetchCustomerDetails:::', errors.toString());
      }
    } catch (error) {
      console.log('fetchCustomerDetails:::', error.toString());
    } finally {
      setLoadingDetails(false);
    }
  }
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

  console.log(customer);

  async function activateCustomer() {
    const url = URLS.customer + data._id + URLS.markActive;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;
      if (success) {
        Alert.alert('Success', data.name + ' is Activated');
        dispatch(getRetailerList());
        navigation.goBack();
      } else {
        console.log('fetchCustomerDetails:::', errors.toString());
      }
    } catch (error) {
      console.log('fetchCustomerDetails:::', error.toString());
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={title} />

        {role === 'asm' && (
          <IconButton
            icon="square-edit-outline"
            onPress={() =>
              navigation.navigate(ROUTES.edit_customer, {
                title: title,
                data: customer,
                id: data._id,
              })
            }
          />
        )}
      </Appbar.Header>
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
      {/* <View style={styles.buttonContainer}>
        {data.is_active ? (
          <Button
            mode="contained"
            icon="phone"
            onPress={() =>
              customerVisitStatus.status
                ? Alert.alert('Information', 'Please checkout first.')
                : navigation.navigate(ROUTES.vertical)
            }>
            On Call Order
          </Button>
        ) : (
          <Button
            icon="check-circle-outline"
            mode="contained"
            style={{margin: 10}}
            onPress={() => activateCustomer()}>
            Activate
          </Button>
        )}
      </View> */}

      <View style={styles.detailsContainer}>
        <ScrollView
          contentContainerStyle={styles.bottomDetailsContentContainer}
          showsVerticalScrollIndicator={false}>
          {customerTarget.length > 0 && (
            <CustomerTarget target={customerTarget} />
          )}
          <Subheading>Shop Info:</Subheading>
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
            <Text style={styles.detailsTitle}>Division</Text>
            <Text> : </Text>
            {customer?.division_names ? (
              <Text style={styles.detailsValue}>
                {customer?.division_names}
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
            <Text style={styles.detailsTitle}>Address</Text>
            <Text> : </Text>
            {customer?.address ? (
              <Text style={styles.detailsValue}>{customer?.address}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Region</Text>
            <Text> : </Text>
            {customer?.region_name ? (
              <Text style={styles.detailsValue}>{customer?.region_name}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>District</Text>
            <Text> : </Text>
            {customer?.district_name ? (
              <Text style={styles.detailsValue}>{customer?.district_name}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>State</Text>
            <Text> : </Text>
            {customer?.state_name ? (
              <Text style={styles.detailsValue}>{customer?.state_name}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          {/* <View style={styles.row}>
            <Text style={styles.detailsTitle}>Distributor</Text>
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

          {/* <Divider />
          <VerticalSpacer />
          <Subheading>More options:</Subheading>
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
          </ScrollView> */}
        </ScrollView>
        {loadingDetails && <LoadingView />}
      </View>

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
    </View>
  );
};

export default MyVisitDetailsScreen;

const size = Dimensions.get('window');
const imgSize = size.width * 0.22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    height: imgSize,
    width: imgSize,
    alignSelf: 'center',
  },

  imgContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    padding: SPACINGS.xxs,
    marginTop: SPACINGS.sm,
    // backgroundColor: COLORS.light,
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
    width: size.width * 0.3,
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

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
});
