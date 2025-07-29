import React, {useEffect, useState} from 'react';
import {Caption, List, Searchbar, Text} from 'react-native-paper';
import {FlatList, View, StyleSheet, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../../../constants/theme/colors';
import { FONTS } from '../../../../constants/theme/fonts';
import { SPACINGS, TYPOGRAPHY } from '../../../../constants/theme';
import ProductStockQuantity from '../../../../components/ProductStockQuantity';
import { ProductList, SchemeList } from '../../../../services/order_service';

const ProductListStockUpdate = ({route}) => {
  const [data, setData] = useState([]);
  const [scheme, setScheme] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const isBrandFeatured = route.params.isBrandFeatured || false;

  useEffect(() => {
    getProduct();
    getScheme();
  }, []);

  useEffect(() => {
    let result = [];
    if (searchQuery.length > 0) {
      result = data.filter(e =>
        e.name?.toUpperCase().includes(searchQuery.toUpperCase()),
      );
      setSearchResult(result);
      return;
    }
    setSearchResult(result);
  }, [searchQuery]);

  console.log(data);
  const getProduct = () => {
    setIsLoading(true);
    ProductList(route.params.data._id)
      .then(res => {
        const {data, errors, success} = res.data;

        console.log('products', res.data);

        if (success) {
          setData(data.products);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getScheme = () => {
    setIsLoading(true);
    SchemeList(route.params.data._id)
      .then(res => {
        console.log('schemes', res.data);

        const {data, errors, success} = res.data;
        if (success) {
          setScheme(data.schemes);
          console.log(data.schemes);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
      <ScrollView nestedScrollEnabled>
        <FlatList
          style={{
            width: '100%',
          }}
          horizontal
          data={scheme}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                  borderRadius: 15,
                  margin: 10,
                  backgroundColor: '#FFF',
                  borderWidth: 1,
                  borderColor: COLORS.accentPrimary,
                  justifyContent: 'center',
                }}>
                <View style={{width: '100%', padding: 10}}>
                  <View
                    style={{
                      marginHorizontal: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#000',
                    }}>
                    <Text
                      style={{
                        color: COLORS.accentPrimary,
                        fontWeight: 'bold',
                        fontSize: 12,
                        marginVertical: 10,
                      }}>
                      MONTHLY SCHEME
                    </Text>
                  </View>
                  <View style={{alignItems: 'center', marginVertical: 10}}>
                    {/*<Text style={{color:'#000',fontWeight:'bold',fontSize:12}}>COMBO OFFER</Text>*/}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: COLORS.accentPrimary,
                      }}>
                      {item.product_name}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: '#000',
                        }}>
                        SAP Code:
                      </Text>
                      <Text style={{fontSize: 12, color: '#000'}}>
                        {' '}
                        {item.product_sap_code}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: '#000',
                        }}>
                        Unit:
                      </Text>
                      <Text style={{fontSize: 12, color: '#000'}}>
                        {' '}
                        {item.product_unit}
                      </Text>
                    </View>
                    {/* <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: '#000',
                        }}>
                        Discount:
                      </Text>
                      <Text style={{fontSize: 12, color: '#000'}}>
                        {' '}
                        {item.primary_discount
                          ? item.primary_discount + '% (P)'
                          : null}{' '}
                        {item.secondary_discount
                          ? item.secondary_discount + '% (S)'
                          : null}
                      </Text>
                    </View> */}
                    {/* <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          color: '#000',
                        }}>
                        End Date:
                      </Text>
                      <Text style={{fontSize: 12, color: '#000'}}>
                        {' '}
                        {item.primary_end_date
                          ? item.primary_end_date + ' (P)'
                          : null}{' '}
                        {item.secondary_end_date
                          ? item.secondary_end_date + ' (S)'
                          : null}
                      </Text>
                    </View> */}
                    {/*<Text>{item.items[0].item_image}</Text>*/}
                  </View>
                </View>
              </View>
            );
          }}

          // onSnapToItem={(index) => this.setState({ sliderActiveSlide: index }) }
        />

        <FlatList
          onRefresh={getProduct}
          data={searchQuery.length > 0 ? searchResult : data}
          refreshing={isLoading}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => {
            return <Text>No item</Text>;
          }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: 10,
          }}
          keyExtractor={(item, _) => item._id}
          renderItem={({item}) => {
            const isFeatured = item.is_featured || isBrandFeatured;

            return (
              <>
                {isFeatured ? (
                  <>
                    <FeaturedProduct item={item} />
                  </>
                ) : (
                  <View style={{marginBottom: 10}}>
                    <NormalProduct item={item} />
                  </View>
                )}
              </>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

export default ProductListStockUpdate;

const FeaturedProduct = ({item}) => {
  return (
    <LinearGradient
      style={styles.featuredProductContainer}
      colors={[COLORS.primary, COLORS.primaryDark, COLORS.accentPrimary]}>
      <Text style={styles.featuredText}>★ Featured ★</Text>
      <NormalProduct item={item} />
    </LinearGradient>
  );
};

const NormalProduct = ({item}) => {
  return (
    <List.Item
      style={styles.list}
      titleStyle={{fontWeight: 'bold'}}
      titleNumberOfLines={10}
      title={item.name}
      descriptionStyle={{flex: 1}}
      description={_ => (
        <>
          <Caption>{item.unit ? item.unit : 'N/A'}</Caption>
          <Text>SAP Code: {item.sap_code ? item.sap_code : 'N/A'}</Text>
          <Text style={styles.aviText}>
            AVI: {item.stock ? item.stock : 'N/A'}
          </Text>
          {/* <Text>
            Distributor Selling Price:{' '}
            {item.distributorsellingprice
              ? item.distributorsellingprice
              : 'N/A'}
          </Text>
          <Text>Ordered Qty: {item.ordered_quantity}</Text> */}
        </>
      )}
      right={_ => (
        <View style={styles.listRight}>
          <ProductStockQuantity data={item} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  featuredProductContainer: {
    padding: 3,
    borderRadius: 10,
    marginBottom: 10,
  },

  featuredText: {
    zIndex: 1,
    top: -5,
    paddingVertical: 2,
    position: 'absolute',
    color: COLORS.ternary,
    ...TYPOGRAPHY.button,
    letterSpacing: 0.8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: SPACINGS.xxs,
  },

  container: {
    flex: 1,
  },

  searchBar: {
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 1,
  },

  list: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  aviText: {
    color: COLORS.accentPrimary,
    fontFamily: FONTS.bold,
  },

  listRight: {
    width: '16%',
    alignItems: 'center',
  },

  chip: {
    backgroundColor: COLORS.accentPrimary,
    color: '#fff',
    flexGrow: 0,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
  },
});
