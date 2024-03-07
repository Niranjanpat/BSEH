import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../../../constants/theme/colors';
import {Button, TextInput} from 'react-native-paper';
import dayjs from 'dayjs';
import DatePicker from 'react-native-date-picker';
import {ROUTES} from '../../../../constants/routes';

const AddOrderScreen = ({navigation}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!orderNumber) {
      return Alert.alert('Error', 'Please fill order number');
    }

    navigation.navigate(ROUTES.add_promoter_sales, {
      number: orderNumber,
      date: orderDate.toString(),
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        value={orderNumber}
        onChangeText={setOrderNumber}
        label="Order number"
        style={styles.input}
        mode="outlined"
      />
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          value={dayjs(orderDate).format('DD MMMM YYYY')}
          label="Order date"
          style={styles.input}
          mode="outlined"
          editable={false}
        />
      </Pressable>
      <Button onPress={handleSubmit} style={styles.btn} mode="contained">
        Proceed
      </Button>
      <DatePicker
        date={orderDate}
        modal
        open={open}
        maximumDate={new Date()}
        mode="date"
        onCancel={() => setOpen(false)}
        onConfirm={date => {
          setOpen(false);
          setOrderDate(date);
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

export default AddOrderScreen;
