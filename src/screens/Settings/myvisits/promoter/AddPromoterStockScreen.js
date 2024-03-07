import {FieldArray, FormikProvider} from 'formik';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {COLORS} from '../../../../constants/theme/colors';
import usePromoterVisit from '../../../../hooks/usePromoterVisit';
import {
  Button,
  Caption,
  Divider,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper';
import dayjs from 'dayjs';
import ProductsModal from '../../../../components/myvisits/ProductsModal';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddPromoterStockScreen = ({route}) => {
  const {number, date: invoiceDate, stockDate} = route.params;

  const {stockFormik} = usePromoterVisit(number, invoiceDate, stockDate);

  const {values, errors, isSubmitting, handleChange, handleSubmit} =
    stockFormik;

  const [visible, setVisible] = useState(false);

  const onItemSelect = useCallback(
    (item, remove = index => {}, push = () => {}) => {
      const index = values.products.findIndex(e => e.name === item.name);

      if (index === -1) {
        push({
          _id: item._id,
          name: item.name,
          sap_code: item.sap_code,
          mrp: '',
          purchase_in_pcs: '',
          opening_stock: '',
        });
        return;
      }
      remove(index);
    },
    [values],
  );

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Text>Invoice number</Text>
        <Text style={styles.rightText}>{number}</Text>
      </View>
      <View style={styles.row}>
        <Text>Purchase invoice date</Text>
        <Text style={styles.rightText}>
          {dayjs(invoiceDate).format('DD MMMM YYYY')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>Opening stock date</Text>
        <Text style={styles.rightText}>
          {dayjs(stockDate).format('DD MMMM YYYY')}
        </Text>
      </View>

      <View style={styles.row}>
        <Subheading style={styles.title}>Added products</Subheading>
        <Button
          icon="plus"
          mode="contained"
          style={styles.button}
          onPress={() => setVisible(true)}>
          Add
        </Button>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <FormikProvider value={stockFormik}>
          <FieldArray name="products">
            {({insert, remove, push}) => (
              <>
                {values.products.length > 0 &&
                  values.products.map((item, index) => (
                    <View key={item._id} style={styles.item}>
                      <Icon
                        name="remove-circle-outline"
                        size={22}
                        color={COLORS.error}
                        onPress={() => remove(index)}
                        style={styles.remove}
                      />
                      <Text style={styles.title} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Caption>{item.sap_code}</Caption>
                      <View style={styles.subRow}>
                        <TextInput
                          label="MRP (₹)"
                          value={values.products[index].mrp}
                          onChangeText={handleChange(`products[${index}].mrp`)}
                          style={styles.subInput}
                          keyboardType="number-pad"
                          mode="outlined"
                        />
                        <TextInput
                          label="Pur. QTY (pcs)"
                          value={values.products[index].purchase_in_pcs}
                          onChangeText={handleChange(
                            `products[${index}].purchase_in_pcs`,
                          )}
                          style={styles.subInput}
                          keyboardType="number-pad"
                          mode="outlined"
                        />
                      </View>
                      <TextInput
                        label="Opening stock"
                        value={values.products[index].opening_stock}
                        onChangeText={handleChange(
                          `products[${index}].opening_stock`,
                        )}
                        keyboardType="number-pad"
                        mode="outlined"
                        style={styles.input}
                      />
                      <Divider />
                      <Divider />
                      <Divider />
                    </View>
                  ))}

                <ProductsModal
                  visible={visible}
                  onClose={() => setVisible(false)}
                  data={values.products}
                  onItemSelect={item => onItemSelect(item, remove, push)}
                />
              </>
            )}
          </FieldArray>
        </FormikProvider>
      </ScrollView>
      <Button
        mode="contained"
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit}>
        Add closing stock
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  root: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.light,
  },
  rightText: {
    fontWeight: 'bold',
  },
  title: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  item: {
    marginVertical: 10,
  },
  itemTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  remove: {
    alignSelf: 'flex-end',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  subInput: {
    width: '48%',
    backgroundColor: 'transparent',
  },
});

export default AddPromoterStockScreen;
