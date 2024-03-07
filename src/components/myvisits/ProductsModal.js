import React, {memo, useEffect, useState} from 'react';
import {Dimensions, FlatList, Pressable, StyleSheet, View} from 'react-native';
import {
  Caption,
  Dialog,
  Divider,
  Portal,
  Searchbar,
  Text,
} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';
import usePromoterVisit from '../../hooks/usePromoterVisit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {height, width} = Dimensions.get('window');

const ProductsModal = ({visible, data = [], onClose, onItemSelect}) => {
  const [page, setPage] = useState(1);
  const [term, setTerm] = useState('');

  const {products, hasMore, salesFormik, fetchAllProducts} = usePromoterVisit();

  useEffect(() => {
    fetchAllProducts(1, term);
  }, []);

  return (
    <Portal>
      <Dialog
        style={styles.root}
        onDismiss={onClose}
        visible={visible}
        theme={{roundness: 1}}>
        <Dialog.Content style={styles.container}>
          <Searchbar
            theme={{roundness: 1}}
            value={term}
            onChangeText={text => {
              setTerm(text);
              setPage(1);
              fetchAllProducts(1, text);
            }}
            placeholder="Search products by name"
            traileringIcon="close"
            style={styles.searchbar}
            iconColor={COLORS.light}
            traileringIconColor={COLORS.light}
            placeholderTextColor={COLORS.light}
            inputStyle={styles.input}
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            keyExtractor={item => item._id}
            ListEmptyComponent={<Text>No products found</Text>}
            renderItem={({item}) => (
              <Pressable style={styles.item} onPress={() => onItemSelect(item)}>
                <View style={styles.row}>
                  <View style={styles.left}>
                    {data.findIndex(e => e.name === item.name) > -1 && (
                      <Icon name="done" size={22} />
                    )}
                  </View>
                  <View style={styles.right}>
                    <Text style={styles.name} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Caption numberOfLines={1}>{item.sap_code}</Caption>
                  </View>
                </View>

                <Divider />
                <Divider />
              </Pressable>
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (!salesFormik.isSubmitting && hasMore) {
                setPage(prev => prev + 1);
                fetchAllProducts(page + 1, term);
              }
            }}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.light,
    width: 0.9 * width,
    alignSelf: 'center',
  },
  container: {
    height: 0.6 * height,
    maxHeight: 0.75 * height,
  },
  item: {
    marginVertical: 15,
  },
  name: {
    fontWeight: 'bold',
  },
  searchbar: {
    marginBottom: 20,
    backgroundColor: COLORS.lightGrey,
    color: COLORS.light,
  },
  row: {
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 9,
    justifyContent: 'center',
  },
  input: {
    color: COLORS.light,
  },
});

export default memo(ProductsModal);
