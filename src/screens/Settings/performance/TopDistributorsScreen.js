import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, Image} from 'react-native';
import {Caption, DataTable, Text} from 'react-native-paper';
import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {topDistributorsList} from '../../../services/performance_service';
import {Col, Grid} from 'react-native-easy-grid';
import {COLORS} from '../../../constants/theme/colors';
import DateMonthModal from '../../../components/DateMonthModal';

const TopDistributorScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [month, setMonth] = useState(dayjs().format('M'));
  const [year, setYear] = useState(dayjs().format('YYYY'));

  const [endDate, setEndDate] = useState(
    new Date(
      dayjs().format('YYYY-MM') +
        '-' +
        new Date(dayjs().format('YYYY'), dayjs().format('MM'), 0).getDate(),
    ),
  );
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM') + '-01');

  useEffect(() => {
    getTopDistributor();
  }, [date]);

  const getTopDistributor = () => {
    const temp = {
      id: route.params?.id,
      start_date: dayjs(startDate).format('YYYY-MM-DD'),
      end_date: dayjs(endDate).format('YYYY-MM-DD'),
    };

    topDistributorsList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(res);
        if (success) {
          setData(data.distributors);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };

  const changeDates = d => {
    setStartDate(dayjs(d).format('YYYY-MM') + '-01');
    setEndDate(
      dayjs(d).format('YYYY-MM') +
        '-' +
        new Date(dayjs(d).format('YYYY'), dayjs(d).format('MM'), 0).getDate(),
    );

    setDate(d);
  };

  return (
    <ScrollView>
      <DateMonthModal
        dates={date}
        open={modalOpen}
        onModalPress={() => setModalOpen(true)}
        onDismiss={() => setModalOpen(false)}
        onDateChange={date => changeDates(date)}
      />
      <DataTable>
        {/* <DataTable.Header>
          <DataTable.Title>SAP Code</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Quantity</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
        </DataTable.Header> */}
        <Grid style={styles.grid}>
          <Col style={styles.col} size={2}>
            <Caption style={styles.title}>SAP Code</Caption>
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
        </Grid>
        {data && data.length > 0 ? (
          data.map(e => (
            // <DataTable.Row key={e._id}>
            //   <DataTable.Cell>{e.sap_code}</DataTable.Cell>
            //   <DataTable.Cell>{e.name}</DataTable.Cell>
            //   <DataTable.Cell>{e.quantity}</DataTable.Cell>
            //   <DataTable.Cell>{e.amount}</DataTable.Cell>
            // </DataTable.Row>
            <Grid style={styles.grid}>
              <Col style={styles.col} size={2}>
                <Text>{e.sap_code}</Text>
              </Col>
              <Col style={styles.col}>
                <Text>{e.name}</Text>
              </Col>
              <Col style={styles.col}>
                <Text>{e.quantity}</Text>
              </Col>
              <Col style={styles.col}>
                <Text> {e.amount}</Text>
              </Col>
            </Grid>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={IMAGE.emptyList} style={styles.emptyImg} />
            <Caption>Distributors List for this date-range is empty.</Caption>
          </View>
        )}
      </DataTable>
    </ScrollView>
  );
};

export default TopDistributorScreen;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
});
