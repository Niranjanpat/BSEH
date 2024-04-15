import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Subheading, Text} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';

const GridItem = ({width = '50%', label, value}) => (
  <View style={[styles.item, {width: width}]}>
    <Subheading style={styles.title} numberOfLines={1}>
      {value?.length > 0 ? value : 'N/A'}
    </Subheading>
    <Text numberOfLines={1}>{label}</Text>
  </View>
);

const AttendanceInformation = ({data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar.Icon
          size={35}
          style={styles.avatar}
          icon="calendar"
          color="white"
        />
        <Subheading style={styles.headerTitle}>
          Attendance information
        </Subheading>
      </View>
      <View style={styles.section}>
        <GridItem label="Attendance Time" value={data.attendance_time} />
        <GridItem label="Working hours" value={data.working_hours} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  card: {
    marginTop: 10,
    marginBottom: 5,
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

export default memo(AttendanceInformation);
