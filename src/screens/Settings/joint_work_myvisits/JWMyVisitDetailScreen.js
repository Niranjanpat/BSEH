import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Alert,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Text,
  Title,
  Button,
  Caption,
  Divider,
  Subheading,
  IconButton,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

import {URLS} from '../../../constants/urls';
import client from '../../../services/axios_client';
import {ROUTES} from '../../../constants/routes';
import {IMAGE} from '../../../constants/images';
import {COLORS} from '../../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';

import VerticalSpacer from '../../../components/VerticalSpacer';
import {
  customerCheckIn,
  customerCheckOut,
  customerVisitStatus,
} from '../../../services/joint_service';
import {useSelector} from 'react-redux';

const JWMyVisitDetailcreen = ({route, navigation}) => {
  const data = route.params.data;
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [checkedInCustomer, setCheckedInCustomer] = useState({});
  const {role} = useSelector(state => state.auth);

  // const [visitLogVisible, setVisitLogVisible] = useState(false);
  // const [topSellingVisible, setTopSellingVisible] = useState(false);
  // const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);

  // check to see whether the current customer is checked in
  const isCheckedIn = checkedInCustomer.customer_id === data._id;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {role === 'asm' ? (
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
          ) : null}
        </>
      ),
    });
  }, [customer, role]);

  useFocusEffect(
    React.useCallback(() => {
      fetchCheckInStatus();
    }, []),
  );

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCheckInStatus = () => {
    customerVisitStatus()
      .then(res => {
        const {data, errors, success} = res.data;

        if (success) {
          setCheckedInCustomer(data);
        } else {
          console.log('fetchCheckInStatus', errors);
        }
      })
      .catch(e => {
        console.log('fetchCheckInStatus exp:::', e);
      });
  };

  async function fetchCustomerDetails() {
    const url = URLS.customer + data._id;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;
      if (success) {
        setCustomer(data);
      } else if (errors) {
        console.log('fetchCustomerDetails:::', JSON.stringify(errors));
        if (errors.token_role) {
          return Alert.alert(
            'Oops',
            'You are not authorized to access customer details.',
          );
        }
      }
    } catch (error) {
      console.log('fetchCustomerDetails:::', error.toString());
    }
  }

  const handleCheckIn = () => {
    Geolocation.getCurrentPosition(
      position => {
        const body = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          customer_id: data._id,
        };
        isCheckedIn ? postCustomerCheckOut(body) : postCustomerCheckIn(body);
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

  const postCustomerCheckIn = body => {
    setLoading(true);
    customerCheckIn(body)
      .then(res => {
        const {errors, success} = res.data;

        if (success) {
          fetchCheckInStatus();
        } else if (errors) {
          if (errors.check_in == 'out_of_range') {
            Alert.alert(
              'Confirm',
              'You are outside the range of retailer. Please be in range to check in.',
            );
            return;
          }

          if (errors.check_in === 'feedback_pending') {
            alert('Feedback pending');
            navigation.navigate(ROUTES.jw_feedback, {node: 'check_in'});
            return;
          }

          alert(Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const postCustomerCheckOut = body => {
    setLoading(true);

    customerCheckOut(body)
      .then(res => {
        const {errors, success} = res.data;

        if (success) {
          fetchCheckInStatus();
        } else if (errors) {
          if (errors.feedback) {
            return navigation.navigate(ROUTES.jw_feedback, {
              node: 'check_out',
              body,
            });
          }

          Alert.alert('Errors', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('postCustomerCheckOut exp::', e);
      })
      .finally(() => {
        setLoading(false);
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
        <Title numberOfLines={1}>{data?.name}</Title>
        <Caption>{data?.owner_contact_number}</Caption>
      </View>
      <Button
        icon="check-circle-outline"
        mode="contained"
        loading={loading}
        onPress={handleCheckIn}>
        {isCheckedIn ? 'Check out' : 'Check in'}
      </Button>
      <View style={styles.detailsContainer}>
        <ScrollView
          contentContainerStyle={styles.bottomDetailsContentContainer}
          showsVerticalScrollIndicator={false}>
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

          {/* <Subheading>More options:</Subheading>
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
          </ScrollView> */}
        </ScrollView>
      </View>
      {/* <LastTenVisitsModal
        visible={visitLogVisible}
        onClose={setVisitLogVisible}
        id={data?._id}
      />

      <TopSellingProductsModal
        visible={topSellingVisible}
        onClose={setTopSellingVisible}
        id={data?._id}
      />
      <OrderSummaryModal
        visible={orderSummaryVisible}
        onClose={setOrderSummaryVisible}
        id={data?._id}
      /> */}
    </View>
  );
};

export default JWMyVisitDetailcreen;

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

  detailsContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#cfd8dc',
    width: size.width,
    marginTop: SPACINGS.sm,
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
    width: size.width * 0.22,
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
