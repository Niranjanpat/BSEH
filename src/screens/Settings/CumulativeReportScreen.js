import React, {useEffect} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../components/LoadingView';
import FlexRow from '../../components/settings/FlexRow';
import {COLORS} from '../../constants/theme/colors';
import useReport from '../../hooks/useReport';
import {ROUTES} from '../../constants/routes';

const CumulativeReportScreen = ({navigation}) => {
  const {loading, data, fetchTodayCumulativeReport} = useReport();

  useEffect(() => {
    fetchTodayCumulativeReport();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <FlexRow
          backGroundColor={COLORS.primary}
          iconName="phone"
          label="Scheduled calls"
          value={data?.scheduled_call}
        />
        <FlexRow
          backGroundColor="#225ED6"
          iconName="phone-forward"
          label="Visited calls"
          value={data?.visited_call}
        />
        <FlexRow
          backGroundColor={COLORS.success}
          iconName="phone-check"
          label="Productive calls"
          value={data?.productive_call}
        />
        <FlexRow
          backGroundColor="#11BCCA"
          iconName="cube"
          label="Order count"
          value={data?.order_quantity}
        />
        <FlexRow
          backGroundColor="#24C6A4"
          iconName="cart"
          label="Order amount"
          value={data?.order_amount}
        />
        <FlexRow
          backGroundColor={COLORS.success}
          iconName="cash-register"
          label="Total amount (in INR)"
          value={data?.total_order}
        />
      </View>
      <Pressable
        onPress={() => navigation.navigate(ROUTES.day_wise_cumulative)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>View date wise report</Text>
          <Icon name="chevron-right-circle" size={23} color={COLORS.light} />
        </View>
      </Pressable>
      {loading && <LoadingView />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.light,
  },
  card: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 2,
    elevation: 3,
    backgroundColor: COLORS.light,
    borderRadius: 10,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CumulativeReportScreen;
