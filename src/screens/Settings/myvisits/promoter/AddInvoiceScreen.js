import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button, TextInput} from 'react-native-paper';
import {ROUTES} from '../../../../constants/routes';
import {COLORS} from '../../../../constants/theme/colors';

const AddInvoiceScreen = ({navigation}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [stockDate, setStockDate] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  const handleSubmit = () => {
    if (!invoiceNumber) {
      return Alert.alert('Error', 'Please fill invocie number');
    }

    navigation.navigate(ROUTES.add_promoter_stock, {
      number: invoiceNumber,
      date: invoiceDate.toString(),
      stockDate: stockDate.toString(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        value={invoiceNumber}
        onChangeText={setInvoiceNumber}
        label="Inovice number"
        style={styles.input}
        mode="outlined"
      />
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          value={dayjs(invoiceDate).format('DD MMMM YYYY')}
          label="Purchase invoice date"
          style={styles.input}
          mode="outlined"
          editable={false}
        />
      </Pressable>
      <Pressable onPress={() => setStockOpen(true)}>
        <TextInput
          value={dayjs(stockDate).format('DD MMMM YYYY')}
          label="Opening stock"
          style={styles.input}
          mode="outlined"
          editable={false}
        />
      </Pressable>
      <Button onPress={handleSubmit} style={styles.btn} mode="contained">
        Proceed
      </Button>
      <DatePicker
        date={invoiceDate}
        modal
        open={open}
        maximumDate={new Date()}
        mode="date"
        onCancel={() => setOpen(false)}
        onConfirm={date => {
          setOpen(false);
          setInvoiceDate(date);
        }}
      />
      <DatePicker
        date={stockDate}
        modal
        open={stockOpen}
        maximumDate={new Date()}
        mode="date"
        onCancel={() => setStockOpen(false)}
        onConfirm={date => {
          setStockOpen(false);
          setStockDate(date);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.light,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  btn: {
    marginVertical: 20,
  },
});

export default AddInvoiceScreen;
