import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  Caption,
  DataTable,
  Subheading,
  Text,
  TextInput,
  ToggleButton,
} from 'react-native-paper';
import {Col, Grid} from 'react-native-easy-grid';
import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {
  dailyCustomerOrderList,
  todaysOrder,
} from '../../../services/performance_service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DsmDailyOrderScreen from './DailyOrder/DsmDailyOrderScreen';
import SoDailyOrderScreen from './DailyOrder/SoDailyOrderScreen';
import {COLORS} from '../../../constants/theme/colors';

const CustomerOrderScreen = ({route}) => {
  const [value, setValue] = useState('0');
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const {role} = route.params;

  return (
    <ScrollView>
      <View style={styles.dateContainer}>
        <TextInput
          label="Enter Date"
          value={dayjs(startDate).format('YYYY-MM-DD')}
          right={
            <TextInput.Icon
              onPress={() => {
                setShowStartDate(true);
              }}
              icon="calendar-outline"
            />
          }
          style={{flex:1,marginLeft:2,marginRight:2}}
          editable={false}
          mode="outlined"
        />

        <DatePicker
          modal
          open={showStartDate}
          mode="date"
          date={startDate}
          maximumDate={new Date()}
          onConfirm={date => {
            setShowStartDate(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setShowStartDate(false);
          }}
        />
      </View>

      {role === 'dsm' && (
        <ToggleButton.Row
          style={{
            alignSelf: 'center',
            marginHorizontal: 10,
            alignItems: 'center',
          }}
          onValueChange={value => setValue(value)}
          value={value}>
          <ToggleButton
            accessibilityLabel="ssss"
            icon="account-outline"
            value="0"
          />
          <ToggleButton
            accessibilityLabel="ssss"
            icon="account-multiple-outline"
            value="1"
          />
        </ToggleButton.Row>
      )}
      <Grid style={styles.grid}>
        <Col style={styles.col} size={2}>
          <Caption style={styles.title}>SAP</Caption>
        </Col>
        <Col style={styles.col} size={2}>
          <Caption style={styles.title}>Name</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Quantity</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Amount</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>LPC</Caption>
        </Col>
      </Grid>
      {value === '0' ? (
        <SoDailyOrderScreen
          id={route.params?.id}
          date={dayjs(startDate).format('YYYY-MM-DD')}
        />
      ) : (
        <DsmDailyOrderScreen
          id={route.params?.id}
          date={dayjs(startDate).format('YYYY-MM-DD')}
        />
      )}
    </ScrollView>
  );
};

export default CustomerOrderScreen;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  inputText: {
    flex: 1,
    margin: 5,
    marginHorizontal: 15,
  },

  emptyContainer: {
    marginTop: SPACINGS.lg,
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyImg: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  heading: {
    letterSpacing: 1,
    fontWeight: 'bold',
  },

  mainBox: {
    flex: 1,
    flexDirection: 'row',
  },

  contain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontWeight: '700',
    fontSize: 11,
  },

  col: {
    flex: 1,
    padding: 2,
  },

  grid: {
    flex: 1,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
  },

  inputText: {
    width: '45%',
    margin: 5,
  },
});
