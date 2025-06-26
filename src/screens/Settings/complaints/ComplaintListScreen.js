import React, {useCallback, useEffect, useState} from 'react';
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
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import {getComplaints} from '../../../services/complaint_service';
import dayjs from 'dayjs';
import DatePicker from 'react-native-date-picker';
import TabFilter from '../../../components/TabFilter';

const STATUS_COLORS = {
  open: COLORS.primary,
  closed: 'green',
};

const getStatusColor = status => STATUS_COLORS[status] || COLORS.primary;

const ComplaintListScreen = () => {
  const filterOption = {
    All: '',
    Open: 'open',
    Closed: 'closed',
  };
  const today = new Date();
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const navigation = useNavigation();
  const [status, setStatus] = useState('');

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchComplaintList(1);
    }, [startDate, endDate, status]),
  );

  const fetchComplaintList = async currentPage => {
    setIsLoading(true);

    try {
      const res = await getComplaints({
        start_date: dayjs(startDate).format('YYYY-MM-DD'),
        end_date: dayjs(endDate).format('YYYY-MM-DD'),
        page: currentPage,
        status: filterOption[status],
      });
      const {data, success, errors} = res?.data;
      if (success) {
        const newComplaints = data?.complaints || [];
        if (currentPage == 1) {
          setComplaints(newComplaints);
        } else {
          setComplaints(prev => [...prev, ...newComplaints]);
        }
        setHasMore(data?.has_more);
        if (data?.has_more) setPage(prev => prev + 1);
      } else {
        Alert.alert('Error', Object.values(errors).join(', '));
      }
    } catch (error) {
      console.error('fetchComplaintList error:', error);
      Alert.alert('Error', 'Something went wrong while fetching complaints.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setComplaints([]);
    setPage(1);
    fetchComplaintList(1);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.card, {borderLeftColor: getStatusColor(item.status)}]}
      onPress={() => {
        navigation.navigate(ROUTES.complaint_detail, {id: item._id});
      }}>
      <Text style={styles.title}>{item.subject}</Text>
      <Text style={styles.text}>Type: {item.complaint_type_name}</Text>
      <Text style={styles.text}>Customer: {item.customer_name}</Text>
      <Text style={styles.text}>Route: {item.customer_route}</Text>
      <Text style={styles.text}>SAP Code: {item.customer_sap_code}</Text>
      <Text style={styles.text}>Date: {item.created_at}</Text>
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

  const renderEmpty = () =>
    !isLoading && (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No complaints found.</Text>
      </View>
    );

  const filterComplaintsByStatus = selectedStatus => {
    setStatus(selectedStatus);
  };

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
        }}
        onCancel={() => setOpenEnd(false)}
      />
    </View>
  );

  return (
    <>
      {renderDatePickers()}
      <TabFilter
        initialValue={'All'}
        filterOptionsObject={filterOption}
        onFilterChange={s => filterComplaintsByStatus(s)}
      />
      <FlatList
        data={complaints}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (!isLoading && hasMore) {
            fetchComplaintList(page);
          }
        }}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={isLoading}
        onRefresh={handleRefresh}
      />
    </>
  );
};

export default ComplaintListScreen;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  statusTabs: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  statusTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
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
