import {View, StyleSheet, Dimensions} from 'react-native';
import React, {memo, useState} from 'react';
import {COLORS} from '../../constants/theme/colors';
import {Avatar, Subheading, Text} from 'react-native-paper';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const height = Dimensions.get('screen').width;

const AttendanceInformation = ({data}) => {
  const [index, setIndex] = useState(0);

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
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
        }}>
        <View key="1" style={styles.section}>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.attendance_status === 'present'
                ? 'Present'
                : data.attendance_status === 'absent'
                ? 'Absent'
                : 'Not marked'}
            </Subheading>
            <Text>Status</Text>
          </View>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.attendance_type ?? 'N/A'}
            </Subheading>
            <Text>Type</Text>
          </View>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.route_names ?? 'N/A'}
            </Subheading>
            <Text>Beats</Text>
          </View>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.market_work ?? 'N/A'}
            </Subheading>
            <Text>Market work</Text>
          </View>
        </View>
        <View key="2" style={styles.section}>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.punch_in_time ?? 'N/A'}
            </Subheading>
            <Text>Punch in</Text>
          </View>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.punch_out_time ?? 'N/A'}
            </Subheading>
            <Text>Punch out</Text>
          </View>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.first_call_time ?? 'N/A'}
            </Subheading>
            <Text>First call time</Text>
          </View>
          <View style={styles.item}>
            <Subheading style={styles.title} numberOfLines={1}>
              {data.last_call_time ?? 'N/A'}
            </Subheading>
            <Text>Last call time</Text>
          </View>
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
  right: {
    flex: 1,
  },
  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    width: '50%',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default memo(AttendanceInformation);
