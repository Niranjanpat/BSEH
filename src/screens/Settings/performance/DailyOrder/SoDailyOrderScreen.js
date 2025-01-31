import React, {useEffect, useState} from 'react';
import {Image, View, StyleSheet, Text,useColorScheme} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import {Button, Caption} from 'react-native-paper';
import {IMAGE} from '../../../../constants/images';
import {SPACINGS} from '../../../../constants/theme';
import {COLORS} from '../../../../constants/theme/colors';
import {dailyCustomerOrderList} from '../../../../services/performance_service';

const SoDailyOrderScreen = ({id, date}) => {
  const [dataDSM, setDataDSM] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const theme=useColorScheme();
  useEffect(() => {
    getDailyOrderDSM();
  }, [page]);

  useEffect(() => {
    setPage(1);
    getDailyOrderDSM();
  }, [date]);

  const getDailyOrderDSM = () => {
    const temp = {
      id: id,
      date: date,
      self: 0,
      page: page,
    };
    dailyCustomerOrderList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          if (hasMore) {
            setHasMore(data.has_more);
            setDataDSM(dataDSM.concat(data.customers));
          } else {
            setHasMore(data.has_more);
            setDataDSM(data.customers);
          }
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };

  console.log('kam', dataDSM);
  return (
    <>
      {dataDSM && dataDSM.length > 0 ? (
        dataDSM.map(e => (
          <Grid key={e._id} style={styles.grid}>
            <Col style={styles.col} size={2}>
              <Text>{e.sap_code}</Text>
            </Col>
            <Col style={styles.col} size={2}>
              <Text>{e.name}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.total_quantity}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.total_amount}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.lpc}</Text>
            </Col>
          </Grid>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={IMAGE.emptyList} style={styles.emptyImg} />
          <Caption>Orders List for this date is empty.</Caption>
        </View>
      )}
      {hasMore && <Button onPress={() => setPage(page + 1)}>View More</Button>}
    </>
  );
};

export default SoDailyOrderScreen;
const styles = StyleSheet.create({
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
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
    flex: 1,
    color:'black',
  },

  col: {
    flex: 1,
    padding: 2,
    color:'black',
  },
});
