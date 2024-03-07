import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import {Caption, Divider, Subheading, Text, Title} from 'react-native-paper';
import {IMAGE} from '../constants/images';
import {SPACINGS} from '../constants/theme';

const CustomerTarget = ({target}) => {
  return (
    <View style={styles.dateContainer}>
      <Subheading style={{fontSize: 15, marginLeft: 5}}>Targets</Subheading>
      <Grid style={styles.grid}>
        <Col style={styles.col} size={2}>
          <Caption>Start Date</Caption>
        </Col>
        <Col style={styles.col} size={2}>
          <Caption style={styles.title}>End date</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Type</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Value</Caption>
        </Col>
      </Grid>
      <Divider />
      {target && target.length > 0 ? (
        target.map(e => (
          <Grid key={e.start_date}>
            <Col style={styles.col} size={2}>
              <Text>{e.start_date}</Text>
            </Col>
            <Col style={styles.col} size={2}>
              <Text textBreakStrategy="balanced">{e.end_date}</Text>
            </Col>
            <Col style={styles.col}>
              <Text textBreakStrategy="balanced">{e.type}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.value}</Text>
            </Col>
          </Grid>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={IMAGE.emptyList} style={styles.emptyImg} />
          <Caption>Target List for this date-range is empty.</Caption>
        </View>
      )}
    </View>
  );
};

export default CustomerTarget;

const styles = StyleSheet.create({
  dateContainer: {
    marginBottom: 10,
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
  grid: {
    flex: 1,
    marginVertical: SPACINGS.xxs,
  },

  col: {
    padding: SPACINGS.xxs,
  },
});
