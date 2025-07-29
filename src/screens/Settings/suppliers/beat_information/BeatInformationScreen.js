import { Image, ScrollView, View } from 'react-native'
import React, { useEffect } from 'react'
import { Caption, Divider, Subheading, Text, Title } from 'react-native-paper'
import { useBeatInformation } from '../../../../hooks/supplier/useBeatInfomation';
import { stylesSupplier } from '../styles/SupplierStyles';
import { IMAGE } from '../../../../constants/images';
import VerticalSpacer from '../../../../components/VerticalSpacer';
import LoadingView from '../../../../components/LoadingView';
import { COLORS } from '../../../../constants/theme/colors';

const BeatInformationScreen = ({route}) => {
  const beatId = route.params?.beatId || '';

  const {isLoading, beatDetails, fetchBeatDetails} = useBeatInformation();

  useEffect(() => {
    fetchBeatDetails(beatId);
  }, []);

  return (
    <View style={stylesSupplier.containerSuperStockist}>
      <View style={stylesSupplier.imgContainer}>
        <Image
          source={IMAGE.route}
          resizeMode="contain"
          style={stylesSupplier.logo}
        />
      </View>
      <View style={stylesSupplier.superStockistBasicDetails}>
        <Title numberOfLines={1}>{beatDetails?.name ?? 'N/A'}</Title>
        <Caption>{beatDetails.sap_code ?? 'N/A'}</Caption>
      </View>

      <View style={stylesSupplier.detailsContainer}>
        <Subheading>Shop Info:</Subheading>
        <Divider />
        <VerticalSpacer />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>SAP Code</Text>
            <Text> : </Text>
            {beatDetails?.sap_code ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.sap_code}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Frequency</Text>
            <Text> : </Text>
            {beatDetails?.frequency ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.frequency}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Customer Count</Text>
            <Text> : </Text>
            {beatDetails?.customer_count ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.customer_count}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Region Name</Text>
            <Text> : </Text>
            {beatDetails?.region_name ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.region_name}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>State Name</Text>
            <Text> : </Text>
            {beatDetails?.state_name ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.state_name}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>District Name</Text>
            <Text> : </Text>
            {beatDetails?.district_name ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.district_name}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>City Name</Text>
            <Text> : </Text>
            {beatDetails?.city_name ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.city_name}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>
              Distributor Sap Code
            </Text>
            <Text> : </Text>
            {beatDetails?.distributor_sap_code ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.distributor_sap_code}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Distributor Name</Text>
            <Text> : </Text>
            {beatDetails?.distributor_name ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.distributor_name}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Distributor Type</Text>
            <Text> : </Text>
            {beatDetails?.distributor_type ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.distributor_type}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>
              Super Stockist Sap Code
            </Text>
            <Text> : </Text>
            {beatDetails?.super_stockist_sap_code ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.super_stockist_sap_code}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Super Stockist Name</Text>
            <Text> : </Text>
            {beatDetails?.super_stockist_name ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.super_stockist_name}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>

          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Created At</Text>
            <Text> : </Text>
            {beatDetails?.created_at ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.created_at}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>

          <View style={stylesSupplier.row}>
            <Text style={stylesSupplier.detailsTitle}>Last Billing Date</Text>
            <Text> : </Text>
            {beatDetails?.last_billing_date ? (
              <Text style={stylesSupplier.detailsValue}>
                {beatDetails?.last_billing_date}
              </Text>
            ) : (
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            )}
          </View>

          <View style={[stylesSupplier.row, {marginBottom: 0}]}>
            <Text style={stylesSupplier.detailsTitle}>Last Visits Date</Text>
            <Text> : </Text>
            {!beatDetails?.last_visits_date &&
              <Text style={stylesSupplier.notAvailableTxt}>N/A</Text>
            }
          </View>
          <View style={[stylesSupplier.row, {flexWrap: 'wrap'}]}>
            {beatDetails?.last_visits_date && (
              beatDetails?.last_visits_date.map((v, i) => (
                <View key={i} style={{marginRight: 5, marginTop: 2, paddingHorizontal: 10, paddingVertical: 5, borderColor: COLORS.accentPrimary, borderWidth: 1, borderRadius: 5,}}>
                    <Text style={stylesSupplier.detailsValue}>
                      {v}
                    </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
        {isLoading && <LoadingView />}
      </View>
    </View>
  );
}

export default BeatInformationScreen