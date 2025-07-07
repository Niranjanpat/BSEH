import {StyleSheet, Alert} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import React, {useEffect, useState} from 'react';
import {Title, Caption, Text, Divider} from 'react-native-paper';

import {URLS} from '../constants/urls';
import {SPACINGS} from '../constants/theme';

import client from '../services/axios_client';

const DsmCurrentTarget = () => {
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    // fetchDsmCurrentTarget();
  }, []);

  const fetchDsmCurrentTarget = async () => {
    const url = URLS.currentTargets;
    try {
      const res = await client.get(url);

      const {data, errors, success} = res.data;
      if (success) {
        setTargets(data.targets);

        console.log(data);
      } else if (errors) {
        if (errors.id) {
          Alert.alert('Oops', `${errors.id} while fetching current target`);
          return;
        }
        Alert.alert('Oops', Object.values(errors).join(', '));
      }
    } catch (error) {
      console.log('fetchDsmCurrentTarget exception', error);
    }
  };

  return (
    <>
      {targets.length > 0 && (
        <>
          <Title style={{fontSize: 15, marginLeft: 5}}>Brand-wise Target</Title>
          <Grid style={styles.grid}>
            <Col style={styles.col} size={2}>
              <Caption>Name</Caption>
            </Col>
            <Col style={styles.col}>
              <Caption style={styles.title}>Start</Caption>
            </Col>
            <Col style={styles.col}>
              <Caption style={styles.title}>End</Caption>
            </Col>
            <Col style={styles.col}>
              <Caption style={styles.title}>Target</Caption>
            </Col>
            {/* TODO: Uncomment */}
            {/* <Col style={styles.col}>
              <Caption style={styles.title}>Acheived</Caption>
            </Col> */}
          </Grid>
          <Divider />

          {targets.map(e => (
            <Grid key={e._id}>
              <Col style={styles.col} size={2}>
                <Text>{e.brand_name}</Text>
              </Col>
              <Col style={styles.col}>
                <Text textBreakStrategy="balanced">{e.start_date}</Text>
              </Col>
              <Col style={styles.col}>
                <Text textBreakStrategy="balanced">{e.end_date}</Text>
              </Col>
              <Col style={styles.col}>
                <Text>{e.value}</Text>
                <Caption>({e.type})</Caption>
              </Col>
              {/* TODO: Uncomment */}
              {/* <Col style={styles.col}>
                <Text textBreakStrategy="balanced">{`xxx`}</Text>
              </Col> */}
            </Grid>
          ))}
        </>
      )}
    </>
  );
};

export default DsmCurrentTarget;

const styles = StyleSheet.create({
  emptyContainer: {
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  grid: {
    flex: 1,
    marginVertical: SPACINGS.xxs,
  },

  col: {
    padding: SPACINGS.xxs,
  },
});
