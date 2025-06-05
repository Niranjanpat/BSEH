import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import {getExpense} from '../../../services/expense_sevice';

const STATUS_COLORS = {
  approved: 'green',
  rejected: 'red',
  pending: COLORS.primary,
};

const getStatusColor = status => STATUS_COLORS[status] || COLORS.primary;

const ExpensesListScreen = () => {
  const [expense, setExpense] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchExpenses(page);
  }, []);

  const fetchExpenses = async currentPage => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await getExpense(currentPage); // Adjust this as per your API
      const {data, success, errors} = res?.data;
      if (success) {
        const newExpenses = data.expense || [];
        setExpense(prev => [...prev, ...newExpenses]);

        if (newExpenses.length === 0) {
          setHasMore(false); // No more data
        } else {
          setPage(prev => prev + 1);
        }
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('getExpenses', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.card, {borderLeftColor: getStatusColor(item.status)}]}
      onPress={() =>
        navigation.navigate(ROUTES.expenses_detail, {expense: item , editable: item.status === 'pending',})
      }>
      <Text style={styles.title}>₹ {item.amount}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Type: {item.expense_type}</Text>
      <Text style={[styles.status, {color: getStatusColor(item.status)}]}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    ) : null;

  return (
    <>
        {expense.length ? (<FlatList
      data={expense}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      contentContainerStyle={{padding: 16}}
      onEndReached={() => fetchExpenses(page)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />) :(<View style={styles.empty}><Text>No Expense available</Text></View>) }
    </>
    
  );
};

export default ExpensesListScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    borderLeftWidth: 5,
  },
  empty:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  status: {
    marginTop: 8,
    fontWeight: '600',
  },
  loader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
