import React, {useEffect, useState} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import {Col, Grid, Row} from 'react-native-easy-grid';
import {Button, Caption, Text} from 'react-native-paper';
import {IMAGE} from '../../../../constants/images';
import {SPACINGS} from '../../../../constants/theme';
import {COLORS} from '../../../../constants/theme/colors';
import {todayCustomerOrder} from '../../../../services/performance_service';

const DsmTodayCustomerOrder = ({id}) => {
  const [dataDSM, setDataDSM] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    getDailyOrderDSM();
  }, [page]);

  const getDailyOrderDSM = () => {
    const temp = {
      id: id,
      self: 1,
      page: page,
    };

    todayCustomerOrder(temp)
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
        } else if (errors) {
          alert(Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('dsm todayCustomerOrder', e);
      });
  };
  return (
    <>
      {dataDSM && dataDSM.length > 0 ? (
        dataDSM.map(e => (
          <Row key={e._id} style={styles.grid}>
            <Col style={styles.col}>
              <Text>{e.sap_code}</Text>
            </Col>
            <Col style={styles.col}>
              <Text style={styles.title}>{e.name}</Text>
            </Col>
            <Col style={styles.col}>
              <Text style={styles.title}>{e.total_quantity}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.total_amount}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.lpc}</Text>
            </Col>
          </Row>
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

export default DsmTodayCustomerOrder;
const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: SPACINGS.lg,
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    padding: 2,
    // borderRightWidth: 1,
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
});
