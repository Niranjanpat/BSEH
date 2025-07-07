import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, TextInput} from 'react-native';
import {
  Caption,
  IconButton,
  List,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import ProductQuantity from '../../../../components/ProductQuantity';
import {SPACINGS, TYPOGRAPHY} from '../../../../constants/theme';
import {COLORS} from '../../../../constants/theme/colors';
import {salesReturnDetail} from '../../../../services/activity_service';

const SaleReturnDetail = ({navigation, route}) => {
  const [data, setData] = useState({});
  const {id} = route.params;

  useEffect(() => {
    getInvoiceDetail();
  }, []);

  const getInvoiceDetail = () => {
    salesReturnDetail(id).then(res => {
      const {data, success, errors} = res.data;
      console.log(data);
      if (success) {
        setData(data);
      } else if (errors) {
        alert(Object.values(errors).join(', '));
      }
    });
  };
  return (
    <View>
      <View style={styles.heading}>
        <View style={styles.customer}>
          <Subheading style={{...TYPOGRAPHY.body1}}>Shop</Subheading>
          <Text>{data.customer_name}</Text>
          <Text>{dayjs(data.created_at).format('YYYY MMM DD HH:MM a')}</Text>
        </View>
      </View>
      <FlatList
        data={data.products}
        keyExtractor={(item, _) => item._id}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({item}) => {
          console.log(item);
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              descriptionStyle={{flex: 1}}
              description={_ => (
                <>
                  <Caption>{item.sap_code ? item.sap_code : 'N/A'}</Caption>
                  <Text>AVI: {item.stock ? item.stock : 'N/A'}</Text>
                  <Text>Mrp: {item.rate ? item.mrp : 'N/A'}</Text>
                </>
              )}
              right={_ => (
                <View style={styles.listRight}>
                  <Text style={styles.chip}>Quantity: {item.quantity}</Text>
                </View>
              )}
            />
          );
        }}
      />
    </View>
  );
};

export default SaleReturnDetail;

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: SPACINGS.md,
  },
  listRight: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  chip: {
    backgroundColor: COLORS.secondary,
    flexGrow: 0,
    alignSelf: 'center',
    padding: SPACINGS.xs,
  },

  heading: {
    padding: SPACINGS.md,
  },

  customer: {
    padding: SPACINGS.xs,
    backgroundColor: COLORS.light,
    borderRadius: 5,
  },
  inputStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    ...TYPOGRAPHY.body2,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACINGS.sm,
  },

  clearButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACINGS.xxs,
    paddingHorizontal: SPACINGS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },

  list: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
});
