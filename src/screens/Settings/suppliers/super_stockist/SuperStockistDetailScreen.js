import {Image, ScrollView, View} from 'react-native';
import React, { useEffect } from 'react';
import {Button, Caption, Divider, Subheading, Text, Title} from 'react-native-paper';
import {useSuperStockist} from '../../../../hooks/supplier/useSuperStockist';
import {stylesSupplier} from '../styles/SupplierStyles';
import {IMAGE} from '../../../../constants/images';
import VerticalSpacer from '../../../../components/VerticalSpacer';
import LoadingView from '../../../../components/LoadingView';
import { ROUTES } from '../../../../constants/routes';
import { setSDIForOrder } from '../../../../store/actions/order';
import { useDispatch } from 'react-redux';

const SuperStockistDetailScreen = ({route, navigation}) => {
  const {id} = route.params;

  const {superStockistDetail, loading, refreshDetails} = useSuperStockist(id);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSDIForOrder('', ''));
    };
  }, []);

  useEffect(() => {
    if (!superStockistDetail) return;
    navigation.setParams({
      data: superStockistDetail,
      id: id,
    })
  }, [superStockistDetail]);

  useEffect(() => {
    if (route.params?.refresh) {
      refreshDetails();
    }
  }, [route.params?.refresh]);

  return (
    <View style={stylesSupplier.containerSuperStockist}>
      <View style={stylesSupplier.imgContainer}>
        <Image
          source={IMAGE.supplier}
          resizeMode="contain"
          style={stylesSupplier.logo}
        />
      </View>
      <View style={stylesSupplier.superStockistBasicDetails}>
        <Title numberOfLines={1}>{superStockistDetail.name ?? 'N/A'}</Title>
        <Caption>
          {superStockistDetail.contact_number_1 ?? 'N/A'}{' '}
          {superStockistDetail.contact_number_1 ? '/' : ''}{' '}
          {superStockistDetail.contact_number_2 ?? ''}
        </Caption>
      </View>

      {/* <View style={stylesSupplier.orderButtonContainer}>
        <Button
          style={stylesSupplier.orderButton}
          icon="database-eye-outline"
          mode="contained"
          onPress={() => {
            navigation.navigate(ROUTES.stock_update_stack, {
              screen: ROUTES.view_stock,
              params: {
                id: id,
              },
            });
          }}>
          View Stock
        </Button>

        <Button
          style={stylesSupplier.orderButton}
          icon="database-edit-outline"
          mode="contained"
          onPress={() => {
            navigation.navigate(ROUTES.stock_update_stack, {
              screen: ROUTES.brand, 
              params: {forStockUpdate: true},
            });
            dispatch(setSDIForOrder(id, superStockistDetail?.name || ''));
          }}>
          Update Stock
        </Button>
      </View> */}

      <View style={stylesSupplier.detailsContainer}>
        <Subheading>Shop Info:</Subheading>
        <Divider />
        <VerticalSpacer />

        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>SAP Code</Text>
            <Text> : </Text>
            {superStockistDetail?.sap_code ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.sap_code}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Depot</Text>
            <Text> : </Text>
            {superStockistDetail?.depot_id ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.depot_id}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Email</Text>
            <Text> : </Text>
            {superStockistDetail?.email ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.email}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Contact Person</Text>
            <Text> : </Text>
            {superStockistDetail?.contact_person ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.contact_person}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Customer Count</Text>
            <Text> : </Text>
            {superStockistDetail?.customer_count ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.customer_count}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>SDI Count</Text>
            <Text> : </Text>
            {superStockistDetail?.sdi_count ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.sdi_count}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Supplier Segment</Text>
            <Text> : </Text>
            {superStockistDetail?.supplier_segment ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.supplier_segment}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Route Count</Text>
            <Text> : </Text>
            {superStockistDetail?.route_count ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.route_count}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Food License</Text>
            <Text> : </Text>
            {superStockistDetail?.food_license ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.food_license}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Region</Text>
            <Text> : </Text>
            {superStockistDetail?.region ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.region}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>GST Number</Text>
            <Text> : </Text>
            {superStockistDetail?.gst_number ? (
              <Text style={stylesSupplier.detailsValue}>{superStockistDetail?.gst_number}</Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Address</Text>
            <Text> : </Text>
            {superStockistDetail?.address ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.address}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>City</Text>
            <Text> : </Text>
            {superStockistDetail?.city ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.city}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>District</Text>
            <Text> : </Text>
            {superStockistDetail?.district ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.district}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>State</Text>
            <Text> : </Text>
            {superStockistDetail?.state ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.state}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>PIN Code</Text>
            <Text> : </Text>
            {superStockistDetail?.pin_code ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.pin_code}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Latitude</Text>
            <Text> : </Text>
            {superStockistDetail?.latitude ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.latitude}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Longitude</Text>
            <Text> : </Text>
            {superStockistDetail?.longitude ? (
              <Text style={stylesSupplier.detailsValue}>
                {superStockistDetail?.longitude}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
        </ScrollView>
        {loading && <LoadingView />}
      </View>
    </View>
  );
};

export default SuperStockistDetailScreen;
