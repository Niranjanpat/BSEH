import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {COLORS} from '../../constants/theme/colors';
import {Avatar, Divider, Subheading, Text} from 'react-native-paper';

const FlexRow = ({leftText, rightText}) => (
  <View style={styles.row}>
    <View style={styles.left}>
      <Text>{leftText}</Text>
    </View>
    <View style={styles.mid}>
      <Text>:</Text>
    </View>
    <View style={styles.right}>
      <Text>{rightText?.length > 0 ? rightText : 'N/A'}</Text>
    </View>
  </View>
);

const OfficialInformation = ({data}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar.Icon
          size={35}
          style={styles.avatar}
          icon="account"
          color="white"
        />
        <Subheading style={styles.title}>Official information</Subheading>
      </View>
      <Divider />
      <Divider />
      <Divider />
      <FlexRow leftText="Name" rightText={data.user_name} />
      <FlexRow leftText="Employee Code" rightText={data.user_emp_code} />
      <FlexRow leftText="DSM Name" rightText={data.dsm_name} />
      <FlexRow leftText="DSM Emp. Code" rightText={data.dsm_emp_code} />
      <FlexRow leftText="SM Name" rightText={data.sm_name} />
      <FlexRow leftText="SM Emp. Code" rightText={data.sm_emp_code} />
      <FlexRow leftText="Headquarters" rightText={data.headquarters} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.light,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  title: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  left: {
    flex: 3,
  },
  mid: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flex: 3,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
});

export default memo(OfficialInformation);
