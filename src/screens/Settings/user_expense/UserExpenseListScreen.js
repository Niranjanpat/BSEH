import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import dayjs from 'dayjs';
import DatePicker from 'react-native-date-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../../constants/theme/colors';
import { ROUTES } from '../../../constants/routes';
import TabFilter from '../../../components/TabFilter';
import { getUserExpense } from '../../../services/user_expense';
import App from '../../../../App';


export const filterOptions = {
    All: '',
    Pending: 'pending',
    Forwarded: 'forwarded',
    Rejected: 'rejected',
    Approved: 'approved',
  };


const STATUS_COLORS = {
  approved: 'green',
  rejected: 'red',
  forwarded: COLORS.primary,
};

const getStatusColor = (status) => STATUS_COLORS[status] || COLORS.primary;

const authorityLevels = [
  { key: 'forwarded_by_vp', label: 'VP' },
  { key: 'forwarded_by_rm', label: 'RM' },
  { key: 'forwarded_by_gm', label: 'GM' },
  { key: 'forwarded_by_zm', label: 'ZM' },
  { key: 'forwarded_by_asm', label: 'ASM' },
];

const getTopForwardedBy = (item) => {
  for (let level of authorityLevels) {
    if (item[level.key] === 'Yes') {
      return level.label;
    }
  }
  return 'Not Forwarded';
};

const UserExpenseListScreen = () => {
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
    }, [startDate, endDate, status])
  );

  const fetchExpenses = async (currentPage) => {
    setIsLoading(true);
    try {
      const res = await getUserExpense({
        start_date: dayjs(startDate).format('YYYY-MM-DD'),
        end_date: dayjs(endDate).format('YYYY-MM-DD'),
        page: currentPage,
        status: filterOptions[status],
      });

      const { data, success, errors } = res?.data;
      if (success) {
        const newExpenses = data.expense || [];
        setExpense((prev) =>
          currentPage === 1 ? newExpenses : [...prev, ...newExpenses]
        );
        setHasMore(data.has_more);
        if (data.has_more) page.current += 1;
      } else {
        Alert.alert('Error', Object.values(errors).join(', '));
      }
    } catch (err) {
      console.log('Fetch Expense Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

 


  return (
    <View style={{ flex: 1 }}>
      <DatePickers
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        openStart={openStart}
        setOpenStart={setOpenStart}
        openEnd={openEnd}
        setOpenEnd={setOpenEnd}
      />
      <TabFilter initialValue="All" filterOptionsObject={filterOptions} onFilterChange={setStatus} />

      {expense.length ? (
        <FlatList
          data={expense}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ExpenseCard item={item} navigation={navigation}  />
          )}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onEndReached={() => !isLoading && hasMore && fetchExpenses(page.current)}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={() => {
            page.current = 1;
            fetchExpenses(1);
          }}
          ListFooterComponent={renderFooter(isLoading)}
        />
      ) : (
        <View style={styles.empty}>
          <Text>No {status} expense found</Text>
        </View>
      )}
    </View>
  );
};

const ExpenseCard = ({ item, navigation }) => {
  const forwardedBy = getTopForwardedBy(item);
  return (
    <View style={[styles.card, { borderLeftColor: getStatusColor(item.status) }]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ROUTES.user_expense_detail, {
            id: item._id,
          })
        }
      >
        <Text style={styles.title}>₹ {item.amount}</Text>
        <Text style={styles.text}>Date: {item.date}</Text>
        <Text style={styles.text}>Type: {item.expense_type}</Text>
        <Text style={styles.text}>Forwarded By: {forwardedBy}</Text>
        <Text style={styles.status}>
          Status:{' '}
          <Text style={{ color: getStatusColor(item.status) }}>
            {item.status?.toUpperCase() ?? ''}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const renderFooter = (isLoading) =>
  isLoading ? (
    <View style={styles.loader}>
      <ActivityIndicator size="small" color={COLORS.primary} />
    </View>
  ) : null;

const DatePickers = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  openStart,
  setOpenStart,
  openEnd,
  setOpenEnd,
}) => (
  <View style={styles.dateFilter}>
    <TouchableOpacity onPress={() => setOpenStart(true)} style={styles.dateBtn}>
      <Text style={styles.dateText}>Start: {dayjs(startDate).format('YYYY-MM-DD')}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setOpenEnd(true)} style={styles.dateBtn}>
      <Text style={styles.dateText}>End: {dayjs(endDate).format('YYYY-MM-DD')}</Text>
    </TouchableOpacity>

    <DatePicker
      modal
      mode="date"
      open={openStart}
      date={startDate}
      onConfirm={(date) => {
        setOpenStart(false);
        setStartDate(date);
      }}
      onCancel={() => setOpenStart(false)}
    />
    <DatePicker
      modal
      mode="date"
      open={openEnd}
      date={endDate}
      onConfirm={(date) => {
        setOpenEnd(false);
        setEndDate(date);
      }}
      onCancel={() => setOpenEnd(false)}
    />
  </View>
);

export default UserExpenseListScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 5,
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
    gap: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
});
