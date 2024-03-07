import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import {Caption, IconButton} from 'react-native-paper';

import {IMAGE} from '../../../constants/images';
import {ROUTES} from '../../../constants/routes';
import {SPACINGS} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';

import {userBeatList} from '../../../services/performance_service';

export default function BeatListScreen({route, navigation}) {
  const {id} = route.params;
  const [data, setData] = useState([]);

  useEffect(() => {
    getBeatList();
  }, []);

  const getBeatList = () => {
    userBeatList(id).then(res => {
      const {data, success, error} = res.data;
      if (success) {
        setData(data.route_users);
      } else {
        console.log(error);
      }
    });
  };

  return (
    <ScrollView>
      <Grid style={styles.grid}>
        <Col style={styles.col} size={2}>
          <Caption style={styles.title}>Code</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Name</Caption>
        </Col>
        {/* <Col style={styles.col}>
          <Caption style={styles.title}>Distributor</Caption>
        </Col> */}
        <Col style={styles.col}>
          <Caption style={styles.title}>Frequency</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Day</Caption>
        </Col>
        <Col style={styles.col} size={1}>
          <Caption style={styles.title}>Total_cus</Caption>
        </Col>
        <Col style={styles.col} size={1}>
          <Caption style={styles.title}>action</Caption>
        </Col>
      </Grid>
      <>
        {data && data.length > 0 ? (
          data.map(e => (
            <Grid key={e._id} style={styles.grid}>
              <Col style={styles.col} size={2}>
                <Text>{e.route_sap_code}</Text>
              </Col>
              <Col style={styles.col}>
                <Text>{e.route_name}</Text>
              </Col>
              <Col style={styles.col}>
                <Text> {e.frequency}</Text>
              </Col>
              <Col style={styles.col}>
                <Text>{e.day}</Text>
              </Col>
              <Col style={styles.col} size={1}>
                <Text>{e.customer_count}</Text>
              </Col>
              <Col style={styles.col}>
                <IconButton
                  onPress={() =>
                    navigation.navigate(ROUTES.beat_customer_list, {
                      routeId: e.route_id,
                    })
                  }
                  icon="arrow-right"
                  color={COLORS.accentPrimary}
                />
              </Col>
            </Grid>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={IMAGE.emptyList} style={styles.emptyImg} />
            <Caption>Customers List for this date-range is empty.</Caption>
          </View>
        )}
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
    flex: 1,
  },
  inputText: {width: '45%', margin: 5},

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
});
