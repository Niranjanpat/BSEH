import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Image, StyleSheet } from 'react-native';
import { getProductDetail } from '../../../services/order_service';
import { useTheme } from 'react-native-paper';

const ProductDetailScreen = ({ route }) => {
  const { colors } = useTheme();
  const data = route.params.data;
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProductsDetail();
  }, []);

  const fetchProductsDetail = () => {
    setIsLoading(true);
    getProductDetail(data._id)
      .then(res => {
        const { success, data, error } = res.data;
        if (success) {
          setDetail(data);
        } else {
          Alert.alert('Error', error);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading || !detail) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: detail.photo_url }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <Text style={styles.productName}>{detail.name}</Text>
      <Text style={styles.productBrand}>{detail.brand}</Text>

      <View style={styles.detailCard}>
        <DetailRow label="MRP" value={`₹ ${detail.mrp}`} />
        <DetailRow label="Dealer Price" value={`₹ ${detail.dealer_price}`} />
        <DetailRow label="Supplier Price" value={`₹ ${detail.supplier_selling_price}`} />
        <DetailRow label="Net Weight" value={`${detail.net_weight} kg`} />
        <DetailRow label="Unit" value={detail.unit} />
        <DetailRow label="GST Rate" value={`${detail.gst_rate}%`} />
        <DetailRow label="HSN Code" value={detail.hsn_code} />
        <DetailRow label="Quantity In Hand" value={detail.quantity_in_hand} />
        <DetailRow label="SAP Code" value={detail.sap_code} />
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{detail.description}</Text>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex:1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
  productBrand: {
    fontSize: 16,
    color: '#777',
    marginBottom: 12,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  descriptionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ProductDetailScreen;
