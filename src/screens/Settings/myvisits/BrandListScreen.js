import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {List, Text} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
import {BrandList} from '../../../services/order_service';

const BrandListScreen = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getBrand();
  }, []);

  const getBrand = () => {
    setIsLoading(true);
    // console.log(route.params.data);
    BrandList(route.params.data._id)
      .then(res => {
        const {data, errors, success} = res.data;

        if (success) {
          setData(data.brands);
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
      <FlatList
        onRefresh={getBrand}
        data={data}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 10,
        }}
        ListEmptyComponent={() => {
          return <Text>No iTem</Text>;
        }}
        keyExtractor={(item, _) => item._id}
        renderItem={({item}) => {
          const isFeatured = item.is_featured;
          return (
            <>
              {isFeatured ? (
                <FeaturedBrand item={item} navigation={navigation} />
              ) : (
                <NormalBrand item={item} navigation={navigation} />
              )}
            </>
          );
        }}
      />
    </View>
  );
};

export default BrandListScreen;

const NormalBrand = ({item, navigation}) => {
  return (
    <List.Item
      style={[styles.list, {marginBottom: 10}]}
      titleStyle={{fontWeight: 'bold'}}
      title={item.name}
      onPress={() => {
        navigation.navigate(ROUTES.product, {
          data: item,
          isBrandFeatured: false,
        });
      }}
      right={props => (
        <View style={styles.listRight}>
          <List.Icon {...props} icon="chevron-right" />
        </View>
      )}
    />
  );
};

const FeaturedBrand = ({item, navigation}) => {
  return (
    <LinearGradient
      style={styles.featuredBrandContainer}
      colors={[COLORS.primary, COLORS.primaryDark, COLORS.accentPrimary]}>
      <List.Item
        style={styles.list}
        titleStyle={{fontWeight: 'bold'}}
        title={item.name}
        onPress={() => {
          navigation.navigate(ROUTES.product, {
            data: item,
            isBrandFeatured: true,
          });
        }}
        right={props => (
          <View style={styles.listRight}>
            <List.Icon {...props} icon="chevron-right" />
          </View>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    marginBottom: 10,
  },

  featuredBrandContainer: {
    padding: 2,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },

  list: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  listRight: {
    flexDirection: 'row',
    alignSelf: 'center',
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
