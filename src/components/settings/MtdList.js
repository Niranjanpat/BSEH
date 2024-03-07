import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Subheading} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OfficialInformation from './OfficialInformation';
import AttendanceInformation from './AttendanceInformation';
import CallDetails from './CallDetails';
import OrderDetails from './OrderDetails';
import {memo} from 'react';

const MtdList = ({item}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable style={styles.header} onPress={() => setVisible(!visible)}>
        <Subheading style={styles.title}>
          {dayjs(item.date).format('dddd DD')}
        </Subheading>
        <Icon
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={COLORS.primary}
        />
      </Pressable>
      {visible && (
        <>
          <OfficialInformation data={item} />
          <AttendanceInformation data={item} />
          <CallDetails data={item} />
          <OrderDetails data={item} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    marginVertical: 10,
    flexDirection: 'row',
    elevation: 3,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default memo(MtdList);
