import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import usePromoterVisit from '../../../../hooks/usePromoterVisit';
import {COLORS} from '../../../../constants/theme/colors';

const PromoterProductsScreen = () => {
  const [page, setPage] = useState(1);

  const {salesFormik, fetchAllProducts} = usePromoterVisit();

  useEffect(() => {
    fetchAllProducts(page);
  }, []);

  return (
    <View style={styles.container}>
      <Text>PromoterProductsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
});

export default PromoterProductsScreen;
