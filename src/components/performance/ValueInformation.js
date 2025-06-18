import React, {memo, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import PagerView from 'react-native-pager-view';
import {Avatar, Subheading, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../constants/theme/colors';

const height = Dimensions.get('screen').width;

const GridItem = ({width = '50%', label, value}) => (
  <View style={[styles.item, {width: width}]}>
    <Subheading style={styles.title} numberOfLines={1}>
      {value ?? 'N/A'}
    </Subheading>
    <Text numberOfLines={1}>{label}</Text>
  </View>
);

const ValueInformation = ({data}) => {
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar.Icon
          size={35}
          style={styles.avatar}
          icon="cash-register"
          color="white"
        />
        <Subheading style={styles.headerTitle}>Value (In INR)</Subheading>
      </View>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
        }}>
        <View key="1" style={styles.section}>
          <GridItem label="Total value" value={data.total_value} />
          <GridItem label="TSP" value={data.tsp_value} />
          <GridItem label="Oil" value={data.oil_value} />
          {/* <GridItem label="RCC" value={50} /> */}
        </View>
        <View key="2" style={styles.section}>
          <GridItem label="200 Gm" value={data._200_gm_value} />
          <GridItem label="C P" value={data.cp_value} />
          <GridItem label="B P" value={data.bp_value} />
        </View>
      </PagerView>
      <View style={styles.footer}>
        <View style={styles.left}>
          <Icon
            name="circle"
            size={20}
            color={index === 0 ? COLORS.primary : COLORS.lightGrey}
          />
        </View>
        <View style={styles.right}>
          <Icon
            name="circle"
            size={20}
            color={index === 1 ? COLORS.primary : COLORS.lightGrey}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    marginHorizontal: 2,
    borderRadius: 10,
    height: 0.65 * height,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  headerTitle: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  footer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    alignItems: 'flex-end',
  },
  mid: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flex: 1,
  },
  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '33%',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default memo(ValueInformation);
