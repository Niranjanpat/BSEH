import React, {useEffect, useState} from 'react';
import {Caption, Subheading, Text} from 'react-native-paper';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';

import {SPACINGS} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';

import DsmTodayCustomerOrder from './TodayCustomerOrder/DsmTodayCustomerOrder';
import SoTodayCustomerOrder from './TodayCustomerOrder/SoTodayCustomerOrder';
import {todaysOrder} from '../../../services/performance_service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TodayCustomerOrder = ({route}) => {
  const {role} = route.params;
  const [data, setData] = useState({});
  const [dataDSM, setDataDSM] = useState({});
  const [value, setValue] = useState('0');
  const soChecked = value === '0';
  useEffect(() => {
    getDailyOrderDSM();
    getDailyOrder();
  }, []);

  const getDailyOrderDSM = () => {
    const temp = {
      id: route.params?.id,
      self: 0,
    };
    todaysOrder(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          setDataDSM(data);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };
  const getDailyOrder = () => {
    const temp = {
      id: route.params?.id,
      self: 1,
    };
    todaysOrder(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          setData(data);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };
  return (
    <ScrollView style={{padding: 10}}>
      {role === 'dsm' && (
        <View style={styles.toggleButtonsRow}>
          <Pressable
            style={[
              styles.toggleButton,
              soChecked && {backgroundColor: COLORS.lightGrey},
            ]}
            onPress={() => setValue('0')}>
            <Text>KAM</Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              !soChecked && {backgroundColor: COLORS.lightGrey},
            ]}
            onPress={() => setValue('1')}>
            <Text>DSM</Text>
          </Pressable>
        </View>
      )}
      <View style={{padding: 10}}>
        <Subheading style={styles.heading}>Today's Order</Subheading>
        <Text>Individual Sales</Text>
        <View style={styles.mainBox}>
          <View style={styles.contain}>
            <Text>
              <Icon name="cart-outline" color={COLORS.primary} size={20} />{' '}
              Total Quantity
            </Text>
            <Subheading> {data.quantity}</Subheading>
          </View>
          <View style={styles.contain}>
            <Text>
              <Icon name="cash" color={COLORS.primary} size={20} /> Total Amount
            </Text>
            <Subheading>₹ {data.amount}</Subheading>
          </View>
        </View>
        {role === 'dsm' && (
          <>
            <Text>KAM Sales</Text>
            <View style={styles.mainBox}>
              <View style={styles.contain}>
                <Text>
                  <Icon name="cart-outline" color={COLORS.primary} size={20} />{' '}
                  Total Quantity
                </Text>
                <Subheading> {dataDSM.quantity}</Subheading>
              </View>
              <View style={styles.contain}>
                <Text>
                  <Icon name="cash" color={COLORS.primary} size={20} /> Total
                  Amount
                </Text>
                <Subheading>₹ {dataDSM.amount}</Subheading>
              </View>
            </View>
          </>
        )}
      </View>
      <Grid>
        <Row style={styles.grid}>
          <Col style={styles.col}>
            <Caption>SAP Code</Caption>
          </Col>
          <Col style={styles.col}>
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
        </Row>
        {value === '0' ? (
          <SoTodayCustomerOrder id={route.params?.id} />
        ) : (
          <DsmTodayCustomerOrder id={route.params?.id} />
        )}
      </Grid>
    </ScrollView>
  );
};

export default TodayCustomerOrder;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  toggleButtonsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: SPACINGS.sm,
    backgroundColor: COLORS.secondary,
  },

  toggleButton: {
    borderRadius: 5,
    padding: 12,
    backgroundColor: COLORS.secondary,
  },

  inputText: {
    flex: 1,
    margin: 5,
    marginHorizontal: 15,
  },
  heading: {
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  contain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainBox: {
    flex: 1,
    flexDirection: 'row',
  },

  emptyContainer: {
    marginTop: SPACINGS.lg,
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    padding: 2,
  },
  grid: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
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
});
