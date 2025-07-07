import React, {useEffect, useState} from 'react';
import {Image, ScrollView, View, StyleSheet} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {Caption, Text} from 'react-native-paper';
import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {URLS} from '../../../constants/urls';
import client from '../../../services/axios_client';

const UserTargets = ({route}) => {
  const [target, setTarget] = useState([]);
  useEffect(() => {
    getUserTargets();
  }, []);

  const getUserTargets = async () => {
    const url = URLS.base + `users/${route.params?.id}/current-targets`;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;

      if (success) {
        setTarget(data.targets);
      } else if (errors) {
        console.log('UserTargets:::', errors.toString());
      }
    } catch (error) {
      console.log('UserTargets:::', error.toString());
    }
  };

  return (
    <ScrollView>
      <Grid>
        <Row style={styles.grid}>
          <Col style={styles.col} size={2}>
            <Caption style={styles.title}>Brand</Caption>
          </Col>
          <Col style={styles.col}>
            <Caption style={styles.title}>Type</Caption>
          </Col>
          <Col style={styles.col}>
            <Caption style={styles.title}>Target</Caption>
          </Col>
          <Col style={styles.col}>
            <Caption style={styles.title}>Acheived</Caption>
          </Col>
          <Col style={styles.col}>
            <Caption style={styles.title}>%Achvd</Caption>
          </Col>
        </Row>
        {target.length > 0 ? (
          target.map(e => (
            <Row key={e._id} style={styles.grid}>
              <Col style={styles.col}>
                <Text style={styles.title}>{e.brand_name}</Text>
              </Col>
              <Col style={styles.col}>
                <Text>{e.type}</Text>
              </Col>
              <Col style={styles.col}>
                <Text>{e.value}</Text>
              </Col>
            </Row>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={IMAGE.emptyList} style={styles.emptyImg} />
            <Caption>Targets List for this date is empty.</Caption>
          </View>
        )}
      </Grid>
    </ScrollView>
  );
};

export default UserTargets;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  // title: {
  //   fontWeight: '700',
  // },
  col: {
    padding: 2,
    // borderRightWidth: 1,
  },
  grid: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
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
