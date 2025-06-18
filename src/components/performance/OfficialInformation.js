import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Avatar, Subheading, Text} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';

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
        <Subheading style={styles.headerTitle}>Official information</Subheading>
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text>Code</Text>
        </View>
        <View style={styles.mid}>
          <Text>:</Text>
        </View>
        <View style={styles.right}>
          <Text>{data.emp_code ?? 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text>Name</Text>
        </View>
        <View style={styles.mid}>
          <Text>:</Text>
        </View>
        <View style={styles.right}>
          <Text>{data.name ?? 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text>HQ</Text>
        </View>
        <View style={styles.mid}>
          <Text>:</Text>
        </View>
        <View style={styles.right}>
          <Text>{data.headquarters_name ?? 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text>Contact number</Text>
        </View>
        <View style={styles.mid}>
          <Text>:</Text>
        </View>
        <View style={styles.right}>
          <Text>{data.contact_number ?? 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text>State</Text>
        </View>
        <View style={styles.mid}>
          <Text>:</Text>
        </View>
        <View style={styles.right}>
          <Text>{data.state_name ?? 'N/A'}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text>Reporting to</Text>
        </View>
        <View style={styles.mid}>
          <Text>:</Text>
        </View>
        <View style={styles.right}>
          <Text>{data.reporting_manager_name ?? 'N/A'}</Text>
        </View>
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
  row: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default memo(OfficialInformation);
