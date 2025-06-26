import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Alert} from 'react-native';
import {Appbar, Button, Divider, Subheading, Text} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import {scheduleSummary} from '../../../services/activity_service';
import VerticalSpacer from '../../../components/VerticalSpacer';
import {SPACINGS, TYPOGRAPHY} from '../../../constants/theme';
import {ROUTES} from '../../../constants/routes';

const TotalVisitedScreen = ({navigation, route}) => {
  const [data, setData] = useState({});
  const [date, setDate] = useState('');

  useEffect(() => {
    if (route.params?.date) {
      setDate(route.params.date);
      getTotalVisited(route.params.date);
    } else {
      setDate(dayjs().format('YYYY-MM-DD'));
      getTotalVisited(dayjs().format('YYYY-MM-DD'));
    }
  }, []);

  const getTotalVisited = dates => {
    scheduleSummary(dayjs(dates).format('YYYY-MM-DD')).then(res => {
      const {data, success, errors} = res.data;
      if (success) {
        setData(data);
      } else {
        Alert.alert('Error', Object.values(errors).join(', '));
      }
    });
  };
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.detailBox}>
          <Subheading>
            Total Visited : {dayjs(date).format('YYYY MMM DD')}
          </Subheading>
          <Divider />
          <VerticalSpacer />
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Total shops to visit</Text>
            <Text> : </Text>
            {data?.total_customers ? (
              <Text style={styles.detailsValue}>{data?.total_customers}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Visited shops</Text>
            <Text> : </Text>
            {data?.total_visited ? (
              <Text style={styles.detailsValue}>{data?.total_visited}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Not visited shops</Text>
            <Text> : </Text>
            {data?.total_not_visited ? (
              <Text style={styles.detailsValue}>{data?.total_not_visited}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Orders taken</Text>
            <Text> : </Text>
            {data?.total_orders ? (
              <Text style={styles.detailsValue}>{data?.total_orders}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
        </View>
        <Button
          onPress={() =>
            navigation.navigate(ROUTES.total_visit_detail, {data, date})
          }
          style={styles.btn}
          mode="contained">
          View Detail
        </Button>
      </View>
    </View>
  );
};

export default TotalVisitedScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  btn: {
    marginTop: 10,
  },
  detailBox: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACINGS.sm,
  },

  detailsTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.accentSecondary,
  },

  detailsValue: {
    flex: 1,
    color: '#000',
  },

  notAvailableTxt: {
    color: COLORS.accentPrimary,
  },
});
