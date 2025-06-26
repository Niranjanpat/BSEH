import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import {getExpense} from '../../../services/expense_sevice';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import theme from '../../../constants/theme';
import TabFilter, { filterOptions } from '../../../components/TabFilter';

const STATUS_COLORS = {
  approved: 'green',
  rejected: 'red',
  pending: COLORS.primary,
};

const getStatusColor = status => STATUS_COLORS[status] || COLORS.primary;

const ExpensesListScreen = () => {
  const today = new Date();
  const [expense, setExpense] = useState([]);
  const page = useRef(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [status, setStatus] = useState('All');

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      page.current = 1;
      fetchExpenses(1);
    }, [endDate, startDate, status]),
  );

  const fetchExpenses = async currentPage => {
    setIsLoading(true);
    try {
      const res = await getExpense({
        start_date: dayjs(startDate).format('YYYY-MM-DD'),
        end_date: dayjs(endDate).format('YYYY-MM-DD'),
        page: currentPage,
        status: filterOptions[status],
      });
      const {data, success, errors} = res?.data;
      if (success) {
        const newExpenses = data.expense || [];

        if (currentPage === 1) {
          setExpense(newExpenses);
        } else {
          setExpense(prev => [...prev, ...newExpenses]);
        }

        setHasMore(data.has_more);
        if (data.has_more) {
          page.current = page.current + 1;
        }
      } else {
       Alert.alert('Error', Object.values(errors).join(', '));
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
        navigation.navigate(ROUTES.expenses_detail, {
          expense: item,
          editable: item.status === 'pending',
        })
      }>
      <Text style={styles.title}>₹ {item.amount}</Text>
      <Text style={styles.text}>Date: {item.date}</Text>
      <Text style={styles.text}>Type: {item.expense_type}</Text>
      <Text style={styles.status}>
        Status:{' '}
        <Text style={{color: getStatusColor(item.status)}}>
          {item.status?.toUpperCase() ?? ''}
        </Text>
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    ) : null;

  const renderDatePickers = () => (
    <View style={styles.dateFilter}>
      <TouchableOpacity
        onPress={() => setOpenStart(true)}
        style={styles.dateBtn}>
        <Text style={styles.dateText}>
          Start: {dayjs(startDate).format('YYYY-MM-DD')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setOpenEnd(true)} style={styles.dateBtn}>
        <Text style={styles.dateText}>
          End: {dayjs(endDate).format('YYYY-MM-DD')}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openStart}
        date={startDate}
        onConfirm={date => {
          setOpenStart(false);
          setStartDate(date);
          setExpense([]);
          page.current = 1;
          setHasMore(false);
        }}
        onCancel={() => setOpenStart(false)}
      />
      <DatePicker
        modal
        mode="date"
        open={openEnd}
        date={endDate}
        onConfirm={date => {
          setOpenEnd(false);
          setEndDate(date);
          setExpense([]);
          page.current = 1;
          setHasMore(false);
        }}
        onCancel={() => setOpenEnd(false)}
      />
    </View>
  );

  return (
    <View style={{flex: 1}}>
      {renderDatePickers()}
      <TabFilter
        initialValue={'All'}
        onFilterChange={(v) => setStatus(v)}
      />
      {expense.length ? (
        <FlatList
          refreshing={isLoading}
          onRefresh={() => {
            page.current = 1;
            fetchExpenses(1);
          }}
          data={expense}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={{paddingHorizontal: 16}}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (isLoading || !hasMore) {
              return;
            }
            fetchExpenses(page.current);
          }}
          onEndReachedThreshold={0.5}
          // ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.empty}>
          <Text>No {status} Expense available</Text>
        </View>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate(ROUTES.expense_stack, {
            screen: ROUTES.add_expenses,
            params: {
              channel: 'add',
              expenseDetail: null,
              id: null,
            },
          })
        }>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  dateFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 16,
  },
  dateBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
  },
  dateText: {
    color: '#333',
  },
});
