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
  Appbar,
  IconButton,
  Subheading,
  Divider,
} from 'react-native-paper';

import VerticalSpacer from '../../components/VerticalSpacer';
import HorizontalSpacer from '../../components/HorizontalSpacer';
import TopSellingProductsModal from '../../components/myvisits/TopSellingProductsModal';
import LastTenVisitsModal from '../../components/myvisits/LastTenVisitsModal';
import OrderSummaryModal from '../../components/myvisits/OrderSummaryModal';
import LoadingView from '../../components/LoadingView';
import CustomerTarget from '../../components/CustomerTarget';

import {URLS} from '../../constants/urls';
import {IMAGE} from '../../constants/images';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../constants/theme';
import {ROUTES} from '../../constants/routes';

import client from '../../services/axios_client';
import useLocationPermission from '../../utils/useLocationPermission';
import {useDispatch, useSelector} from 'react-redux';
import {
  getRetailerList,
  setCustomerForOrderOnCall,
  setHideCheckoutAfterOrderPlaces,
} from '../../store/actions/order';
import {getCustomerTarget} from '../../services/retailer_services';

const size = Dimensions.get('window');
const imgSize = size.width * 0.25;

const MyVisitDetailsScreen = ({route, navigation}) => {
  const {data, title} = route.params;
  const [customer, setCustomer] = useState(null);
  const [customerTarget, setCustomerTarget] = useState([]);
  const [visitLogVisible, setVisitLogVisible] = useState(false);
  const [topSellingVisible, setTopSellingVisible] = useState(false);
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [requestLocationPermission] = useLocationPermission();
  const dispatch = useDispatch();
  const {role} = useSelector(state => state.auth);
  const {customerVisitStatus} = useSelector(state => state.order);

  useEffect(() => {
    fetchCustomerDetails();
    requestLocationPermission();
    fetchCustomerTarget();

    if (!customerVisitStatus.status) {
      dispatch(setHideCheckoutAfterOrderPlaces(true));
      dispatch(setCustomerForOrderOnCall(data._id, data.name));
    }
  }, []);

  const fetchCustomerDetails = async () => {
    setLoadingDetails(true);
    try {
      const res = await client.get(URLS.customer + data._id);
      if (res.data.success) {
        setCustomer(res.data.data);
      } else {
        console.log('Error:', res.data.errors);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchCustomerTarget = () => {
    getCustomerTarget(data._id)
      .then(res => {
        if (res.data.success) {
          setCustomerTarget(res.data.data.targets);
        }
      })
      .catch(err => console.log('Target Error:', err));
  };

  const activateCustomer = async () => {
    try {
      const res = await client.get(URLS.customer + data._id + URLS.markActive);
      if (res.data.success) {
        Alert.alert('Success', `${res.data.data.name} is Activated`);
        dispatch(getRetailerList());
        navigation.goBack();
      } else {
        console.log('Activation Error:', res.data.errors);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const renderDetailRow = (label, value) => (
    <View style={styles.row}>
      <Text style={styles.detailsTitle}>{label}</Text>
      <Text style={styles.detailsValue}>
        {value ? value : <Text style={styles.notAvailableTxt}>N/A</Text>}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={title} />
        {role === 'asm' && (
          <IconButton
            icon="square-edit-outline"
            onPress={() =>
              navigation.navigate(ROUTES.edit_customer, {
                title,
                data: customer,
                id: data._id,
              })
            }
          />
        )}
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imgContainer}>
          <Image source={IMAGE.retailer} style={styles.logo} />
        </View>

        <View style={styles.retailerBasicDetails}>
          <Title>{data.name}</Title>
          <Caption>{data.owner_contact_number}</Caption>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="comment-alert"
            style={styles.primaryButton}
            labelStyle={{color: '#fff'}}
            onPress={() =>
              navigation.navigate(ROUTES.add_complaint, {
                complaint: null,
                id: data._id,
                channel: 'add',
              })
            }>
            Complaint
          </Button>
        </View>

        {customerTarget.length > 0 && <CustomerTarget target={customerTarget} />}

        <View style={styles.detailsSection}>
          <Subheading>Shop Info</Subheading>
          <Divider style={{marginVertical: SPACINGS.xs}} />

          <VerticalSpacer />
          {renderDetailRow('SAP Code', customer?.sap_code)}
          {renderDetailRow('Town', customer?.town)}
          {renderDetailRow('Beat', customer?.route_name)}
          {renderDetailRow('Shop Type', customer?.customer_type_name)}
          {renderDetailRow('Division', customer?.division_names)}
          {renderDetailRow("Owner's Name", customer?.owner_name)}
          {renderDetailRow('Email', customer?.owner_email)}
          {renderDetailRow('GST Number', customer?.gst_number)}
          {renderDetailRow('Address', customer?.address)}
          {renderDetailRow('Region', customer?.region_name)}
          {renderDetailRow('District', customer?.district_name)}
          {renderDetailRow('State', customer?.state_name)}
        </View>

        {loadingDetails && <LoadingView />}
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: SPACINGS.lg,
  },
  imgContainer: {
    alignItems: 'center',
    marginTop: SPACINGS.md,
  },
  logo: {
    width: imgSize,
    height: imgSize,
    borderRadius: imgSize / 2,
  },
  retailerBasicDetails: {
    alignItems: 'center',
    marginVertical: SPACINGS.sm,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: SPACINGS.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  detailsSection: {
    paddingHorizontal: SPACINGS.md,
    marginTop: SPACINGS.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACINGS.sm,
  },
  detailsTitle: {
    width: size.width * 0.4,
    ...TYPOGRAPHY.caption,
    color: COLORS.accentSecondary,
  },
  detailsValue: {
    flex: 1,
    ...TYPOGRAPHY.caption,
    color: '#333',
  },
  notAvailableTxt: {
    color: COLORS.accentPrimary,
    fontStyle: 'italic',
  },
});