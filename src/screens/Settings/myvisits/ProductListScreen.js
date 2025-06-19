import React, {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Searchbar,
  List,
  Caption,
  Text,
  IconButton,
  Button,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import ProductImageModal from '../../../components/ProductImageModal';

import {
  getAllProduct,
  getBrands,
  getCategories,
} from '../../../services/order_service';

import ProductQuantity from '../../../components/ProductQuantity';
import OrderCartIcon from '../../../components/OrderCartIcon';

import {COLORS} from '../../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {FONTS} from '../../../constants/theme/fonts';
import {ROUTES} from '../../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import PromotionalQuantity from '../../../components/promotional_item/PromotionalQuantity';

const ProductListScreen = ({route, navigation}) => {
  const {channel} = route.params;
  const [data, setData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <IconButton
            icon="filter-variant"
            onPress={() => setFilterVisible(true)}
          />
          <OrderCartIcon channel={channel} />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchFilters();
    fetchProducts(1, true);
  }, []);

  useEffect(() => {
    fetchProducts(1, true);
  }, [brandId, categoryId]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(1, true);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchFilters = () => {
    getBrands()
      .then(res => {
        const {success, data} = res.data;
        if (success) setBrands(data.brands);
      })
      .catch(console.warn);

    getCategories()
      .then(res => {
        const {success, data} = res.data;
        if (success) setCategories(data.categories);
      })
      .catch(console.warn);
  };

  const fetchProducts = (newPage = 1, replace = false) => {
    if (!hasMore && !replace) return;

    setIsLoading(true);
    getAllProduct(newPage, query, brandId, categoryId)
      .then(res => {
        const {success, data} = res.data;
        if (success) {
          setHasMore(data.has_more ?? false);
          setData(
            replace ? data.products : prev => [...prev, ...data.products],
          );
          setPage(newPage);
        }
      })
      .catch(console.warn)
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProducts(1, true);
  };

  const loadMore = () => {
    if (!isLoading) {
      fetchProducts(page + 1);
    }
  };

  const applyFilters = () => {
    setFilterVisible(false);
    fetchProducts(1, true);
  };
  const sampleProducts = data.filter(item => item.is_sample === 'Yes');

  const filterData = channel === 'sample' ? sampleProducts : data;
  
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by name"
        value={query}
        onChangeText={setQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filterData}
        keyExtractor={item => item._id}
        initialNumToRender={10}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text>No items found.</Text>}
        renderItem={({item}) =>
          item.is_featured === 'Yes' ? (
            <FeaturedProduct item={item} channel={channel} />
          ) : (
            <View style={{marginBottom: 10}}>
              <NormalProduct item={item} channel={channel}/>
            </View>
          )
        }
      />

      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Products</Text>

            <Text>Brand</Text>
            <Picker selectedValue={brandId} onValueChange={setBrandId}>
              <Picker.Item label="All Brands" value={null} />
              {brands.map(b => (
                <Picker.Item label={b.name} value={b._id} key={b._id} />
              ))}
            </Picker>

            <Text>Category</Text>
            <Picker selectedValue={categoryId} onValueChange={setCategoryId}>
              <Picker.Item label="All Categories" value={null} />
              {categories.map(c => (
                <Picker.Item label={c.name} value={c._id} key={c._id} />
              ))}
            </Picker>

            <View style={styles.modalButtons}>
              <Button mode="outlined" onPress={() => setFilterVisible(false)}>
                Cancel
              </Button>
              <Button mode="contained" onPress={applyFilters}>
                Apply
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const FeaturedProduct = ({item,channel}) => (
  <LinearGradient
    style={styles.featuredProductContainer}
    colors={[COLORS.primary, COLORS.primaryDark, COLORS.accentPrimary]}>
    <Text style={styles.featuredText}>★ Featured ★</Text>
    <NormalProduct item={item} channel={channel} />
  </LinearGradient>
);

const NormalProduct = ({item,channel}) => {
  const navigation = useNavigation();
  const childRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(ROUTES.product_detail, {data: item});
        }}>
        <List.Item
          style={styles.list}
          titleStyle={{fontWeight: 'bold'}}
          title={item.name}
          description={() => (
            <>
              <Caption>{item.unit || 'N/A'}</Caption>
              <Text>Brand: {item.brand || 'N/A'}</Text>
              <Text>MRP: {item.mrp || 'N/A'}</Text>
            </>
          )}
          right={_ => (
            <View style={styles.listRight}>
              {
                (channel === 'sample' ? (<PromotionalQuantity data={item} />) : (<ProductQuantity data={item} />))
              }
              
            </View>
          )}
          left={_ => (
            <TouchableOpacity onPress={() => childRef.current?.showImage(true)}>
              {!imageError && item?.photo_url ? (
                <Image
                  source={{
                    uri: item.photo_url,
                  }}
                  style={styles.image}
                  onError={() => {
                    setImageError(true);
                  }}></Image>
              ) : (
                <Icon
                  name="image-off-outline"
                  size={80}
                  color={COLORS.lightGrey}
                />
              )}
            </TouchableOpacity>
          )}
        />
      </TouchableOpacity>

      <ProductImageModal item={item} ref={childRef}></ProductImageModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 10,
    elevation: 2,
  },
  flatListContent: {
    padding: 10,
  },
  featuredProductContainer: {
    padding: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  featuredText: {
    position: 'absolute',
    top: -13,
    left: 10,
    backgroundColor: COLORS.lightGrey,
    color: COLORS.ternary,
    ...TYPOGRAPHY.button,
    paddingHorizontal: SPACINGS.xxs,
    paddingVertical: 2,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 1,
    marginBottom: 5,
  },
  aviText: {
    color: COLORS.accentPrimary,
    fontFamily: FONTS.bold,
  },
  listRight: {
    width: '16%',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  image: {
    height: 80,
    width: 80,
    marginLeft: 13,
    borderRadius: 5,
  },
});

export default ProductListScreen;
