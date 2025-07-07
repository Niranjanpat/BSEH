import React, {useEffect, useState, memo} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {
  Dialog,
  Divider,
  Portal,
  Text,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import VerticalSpacer from '../../components/VerticalSpacer';

import client from '../../services/axios_client';

import {URLS} from '../../constants/urls';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../constants/theme';

const TopSellingProductsModal = ({visible = false, onClose = () => {}, id}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchTopSellingProducts();
    }
  }, [visible]);

  const fetchTopSellingProducts = async () => {
    setIsLoading(true);
    const url = URLS.customer + id + '/' + URLS.topProducts;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;
      console.log(data);
      if (success) {
        setProducts(data.products);
      } else if (errors) {
        console.log('fetchTopSellingProducts', errors);
        if (errors.token_role) {
          return Alert.alert('Oops', errors.token_role);
        }

        Alert.alert('Oops', Object.values(errors).join(', '));
      }
    } catch (error) {
      Alert.alert('Error', error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog style={styles.dialog} visible={visible} dismissable={false}>
        <Title
          style={{
            textAlign: 'center',
          }}>
          Top selling products
        </Title>
        <Divider />
        <FlatList
          data={products}
          style={styles.flatList}
          keyExtractor={(item, _) => item._id}
          ListHeaderComponentStyle={styles.headerStyle}
          ListEmptyComponent={() => <EmptyView isLoading={isLoading} />}
          ListHeaderComponent={TableTitle}
          ItemSeparatorComponent={() => <VerticalSpacer />}
          renderItem={({item}) => {
            return (
              <>
                <View style={styles.itemContainer}>
                  <Text
                    numberOfLines={2}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                    }}>
                    {item.total_quantity}
                  </Text>
                </View>
              </>
            );
          }}
        />
        <Divider />
        <Dialog.Actions>
          <TouchableRipple onPress={() => onClose(false)}>
            <Text style={styles.defaultButton}>Close</Text>
          </TouchableRipple>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const EmptyView = ({isLoading}) => {
  if (isLoading)
    return (
      <Text style={styles.emptyViewText}>
        Fetching your top selling products...
      </Text>
    );

  return <Text style={styles.emptyViewText}>No data found!</Text>;
};

const TableTitle = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textDecorationLine: 'underline',
          color: COLORS.accentPrimary,
          ...TYPOGRAPHY.subtitle1,
        }}>
        Name
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textDecorationLine: 'underline',
          color: COLORS.accentPrimary,
          ...TYPOGRAPHY.subtitle1,
        }}>
        Quantity
      </Text>
    </View>
  );
};

export default memo(TopSellingProductsModal);

const styles = StyleSheet.create({
  dialog: {
    height: '70%',
  },

  defaultButton: {
    padding: 6,
  },

  emptyViewText: {
    paddingVertical: SPACINGS.md,
    textAlign: 'center',
  },

  headerStyle: {
    marginVertical: SPACINGS.xs,
  },

  flatList: {
    height: '60%',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 6,
  },
});
