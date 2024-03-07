import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, Image} from 'react-native';
import {Caption, DataTable, TextInput} from 'react-native-paper';
import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {topDSMList} from '../../../services/performance_service';
import DateMonthModal from '../../../components/DateMonthModal';

const TopDsmScreen = ({route}) => {
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
    getTopDsm();
  }, [date]);

  const getTopDsm = () => {
    const temp = {
      id: route.params?.id,
      start_date: dayjs(startDate).format('YYYY-MM-DD'),
      end_date: dayjs(endDate).format('YYYY-MM-DD'),
    };
    topDSMList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log('dsm', res);
        if (success) {
          setData(data.users);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        console.log('dsm error', e);

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
        <DataTable.Header>
          <DataTable.Title>Emp. code</DataTable.Title>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Quantity</DataTable.Title>
          <DataTable.Title>Amount</DataTable.Title>
        </DataTable.Header>

        {data && data.length > 0 ? (
          data.map(e => (
            <DataTable.Row key={e._id}>
              <DataTable.Cell>{e.emp_code}</DataTable.Cell>
              <DataTable.Cell>{e.name}</DataTable.Cell>
              <DataTable.Cell>{e.quantity}</DataTable.Cell>
              <DataTable.Cell>{e.amount}</DataTable.Cell>
            </DataTable.Row>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={IMAGE.emptyList} style={styles.emptyImg} />
            <Caption>DSM List for this date-range is empty.</Caption>
          </View>
        )}
      </DataTable>
    </ScrollView>
  );
};

export default TopDsmScreen;

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
});
