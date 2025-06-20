import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../../../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getExpenseDetail} from '../../../services/expense_sevice';
import {ROUTES} from '../../../constants/routes';
import {useFocusEffect} from '@react-navigation/native';

const getStatusColor = {
  approved: 'green',
  rejected: 'red',
  pending: COLORS.primary,
};

const ExpenseDetailScreen = ({route, navigation}) => {
  const {expense, editable} = route.params;
  const [expenseDetail, setExpenseDetail] = useState({});

  useLayoutEffect(() => {
    if (editable) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => handleEdit()}
            style={{marginRight: 15}}>
            <Icon name="edit" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, expenseDetail]);

  const handleEdit = () => {
    navigation.navigate(ROUTES.expense_stack, {
      screen: ROUTES.update_complaint,
      params: {
        channel: 'update',
        expenseDetail: expenseDetail,
        id: expense._id,
      },
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchExpensesDetail();
    }, []),
  );

  const fetchExpensesDetail = async () => {
    try {
      const res = await getExpenseDetail(expense._id);
      const {data, success, errors} = res?.data;
      if (success) {
        setExpenseDetail(data);
      } else {
        console.log(errors);
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('getExpenses', error);
    }
  };

  const {
    amount,
    date,
    details,
    extra,
    expense_type,
    status,
    photo_path,
    approved_by_name,
    rejected_by_name,
    approved_at,
    rejected_at,
  } = expenseDetail;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <DetailRow icon="category" label="Expense Type" value={expense_type} />
        <DetailRow icon="calendar-today" label="Date" value={date} />
        <DetailRow icon="attach-money" label="Amount" value={`₹ ${amount}`} />
        <DetailRow icon="notes" label="Details" value={details || 'N/A'} />
        <DetailRow icon="info" label="Extra Info" value={extra || 'N/A'} />

        <DetailRow
          icon="flag"
          label="Status"
          value={(status || 'pending').toUpperCase()}
          valueStyle={{color: getStatusColor[status] || COLORS.primary}}
        />

        {status === 'approved' && approved_by_name && (
          <>
            <DetailRow
              icon="verified-user"
              label="Approved By"
              value={approved_by_name}
            />
            <DetailRow
              icon="access-time"
              label="Approved At"
              value={approved_at}
            />
          </>
        )}

        {status === 'rejected' && rejected_by_name && (
          <>
            <DetailRow
              icon="cancel"
              label="Rejected By"
              value={rejected_by_name}
            />
            <DetailRow
              icon="access-time"
              label="Rejected At"
              value={rejected_at}
            />
          </>
        )}

        {photo_path ? (
          <>
            <Text style={styles.photoLabel}>Photo</Text>
            <Image source={{uri: photo_path}} style={styles.image} />
          </>
        ) : (
          <Text style={[styles.value, {marginTop: 10}]}>No image uploaded</Text>
        )}
      </View>
    </ScrollView>
  );
};

const DetailRow = ({icon, label, value, valueStyle = {}}) => (
  <View style={styles.row}>
    <Icon name={icon} size={20} color={COLORS.primary} style={styles.icon} />
    <Text style={styles.label}>{label}:</Text>
    <Text
      style={[styles.value, valueStyle]}
      numberOfLines={1}
      ellipsizeMode="tail">
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    marginRight: 4,
  },
  value: {
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default ExpenseDetailScreen;
