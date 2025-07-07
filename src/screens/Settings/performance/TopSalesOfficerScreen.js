import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, Image} from 'react-native';
import {Caption, DataTable, TextInput} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {topSalesOfficerList} from '../../../services/performance_service';

import DateMonthModal from '../../../components/DateMonthModal';

const TopSOListScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [month, setMonth] = useState(dayjs().format('M'));
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getTopSOList();
  }, [date]);

  const getTopSOList = () => {
    const temp = {
      id: route.params?.id,
      year: year,
      month: month,
    };

    topSalesOfficerList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          setData(data.users);
        } else if (errors) {
          alert(Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };

  const changeDates = d => {
    setMonth(dayjs(d).format('M'));
    setYear(dayjs(d).format('YYYY'));

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
            <Caption>SO List for this date-range is empty.</Caption>
          </View>
        )}
      </DataTable>
    </ScrollView>
  );
};

export default TopSOListScreen;

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
