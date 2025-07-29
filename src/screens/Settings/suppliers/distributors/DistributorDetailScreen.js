import React, {useEffect, useState, useRef} from 'react';
import {View, ScrollView, StyleSheet, Image} from 'react-native';
import {
  Button,
  Caption,
  Divider,
  Subheading,
  Text,
  Title,
  Card,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGE} from '../../../../constants/images';
import {ROUTES} from '../../../../constants/routes';
import {stylesSupplier} from '../styles/SupplierStyles';
import LoadingView from '../../../../components/LoadingView';
import Geolocation from 'react-native-geolocation-service';
import {
  getDistributorVisitStatus,
  postDistributorCheckIn,
  postDistributorCheckOut,
  storeDistributorVisitStatusLoading,
} from '../../../../store/actions/distributor';
import {useDistributor} from '../../../../hooks/supplier/useDistributor';

const DistributorDetailScreen = ({route, navigation}) => {
  const {id, title, channel ,assignee} = route.params || {};
  const {role} = useSelector(state => state.auth);

  const {distributorDetail, loading, refreshDetails} = useDistributor(
    id,
    channel,
    null,
  );

  const {distributorVisitStatus, checkVisitLoading} = useSelector(
    state => state.distributor,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDistributorVisitStatus());
  }, []);

  const checkInFunction = () => {
    dispatch(storeDistributorVisitStatusLoading(true));
    Geolocation.getCurrentPosition(
      position => {
        const dataToSend = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          distributor_id: id,
        };

        if (distributorVisitStatus.status) {
          if (distributorVisitStatus.distributor_id === id) {
            dispatch(postDistributorCheckOut(dataToSend, navigation));
          } else {
            dispatch(postDistributorCheckIn(dataToSend, navigation));
          }
        } else {
          dispatch(postDistributorCheckIn(dataToSend, navigation));
        }
      },
      error => {
        console.log(error.code, error.message);
        dispatch(storeDistributorVisitStatusLoading(false));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  return (
    <View style={stylesSupplier.containerSuperStockist}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={stylesSupplier.imgContainer}>
          <Image
            source={IMAGE.logo}
            resizeMode="contain"
            style={stylesSupplier.logo}
          />
        </View>

        {/* Basic Info */}
        <View style={stylesSupplier.superStockistBasicDetails}>
          <Title numberOfLines={1}>{title ?? 'N/A'}</Title>
          <Caption>{distributorDetail.contact_number ?? 'N/A'}</Caption>
        </View>

        <View>
          {channel === ROUTES.all_distributor ? (
            <>
              <Button
                icon="check-circle-outline"
                mode="contained"
                onPress={() =>
                  navigation.navigate(ROUTES.add_distributor_schedule, {
                    id: id,
                    assignee: assignee,
                  })
                }
                style={styles.checkButton}>
                Schedule
              </Button>
            </>
          ) : (
            <Button
              icon="check-circle-outline"
              mode="contained"
              loading={checkVisitLoading}
              disabled={checkVisitLoading}
              onPress={checkInFunction}
              style={styles.checkButton}>
              {distributorVisitStatus.status
                ? distributorVisitStatus.distributor_id === id
                  ? 'Check out'
                  : 'Check in'
                : 'Check in'}
            </Button>
          )}
        </View>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Subheading style={styles.sectionTitle}>Shop Info</Subheading>
            <Divider style={{marginVertical: 8}} />

            {renderField('Name', distributorDetail.name)}
            {renderField('SAP Code', distributorDetail.sap_code)}
            {renderField('Email', distributorDetail.email)}
            {renderField('Contact Number', distributorDetail.contact_number)}
            {renderField('Region', distributorDetail.region)}
            {renderField('City', distributorDetail.city)}
            {renderField('District', distributorDetail.district)}
            {renderField('State', distributorDetail.state)}
            {renderField(
              'Super Distributor Name',
              distributorDetail.super_distributor_name,
            )}
            {renderField(
              'Super Distributor SAP Code',
              distributorDetail.super_distributor_sap_code,
            )}
            {renderField('Type', distributorDetail.type)}
          </Card.Content>
        </Card>

        {/* Loading indicator */}
        {loading && <LoadingView />}
      </ScrollView>
    </View>
  );
};

// Reusable field renderer
const renderField = (label, value) => (
  <View style={stylesSupplier.row}>
    <Text style={stylesSupplier.detailsTitle}>{label}</Text>
    <Text> : </Text>
    {value ? (
      <Text style={stylesSupplier.detailsValue}>{value}</Text>
    ) : (
      <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
    )}
  </View>
);

export default DistributorDetailScreen;

// Local-only styles (non-global)
const styles = StyleSheet.create({
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  checkButton: {
    marginHorizontal: 120,
    marginVertical: 10,
  },
});
