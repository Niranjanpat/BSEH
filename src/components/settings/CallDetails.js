import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Subheading, Text} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';

const GridItem = ({width = '50%', label, value}) => (
  <View style={[styles.item, {width: width}]}>
    <Subheading style={styles.title} numberOfLines={1}>
      {value?.length !== 0 ? value : 'N/A'}
    </Subheading>
    <Text numberOfLines={1}>{label}</Text>
  </View>
);

const CallDetails = ({data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar.Icon
          size={35}
          style={styles.avatar}
          icon="phone"
          color="white"
        />
        <Subheading style={styles.headerTitle}>Calls Details</Subheading>
      </View>
      <View style={styles.section}>
        <GridItem label="First call" value={data.first_call} />
        <GridItem label="Last call" value={data.last_call} />
        <GridItem label="Scheduled calls" value={data.scheduled_call} />
        <GridItem label="Visited calls" value={data.visited_call} />
        <GridItem label="Productive calls" value={data.productive_call} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    marginHorizontal: 2,
    borderRadius: 10,
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

export default memo(CallDetails);
