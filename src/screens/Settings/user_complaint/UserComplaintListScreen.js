import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserComplaint } from '../../../services/complaint_service';
import { ROUTES } from '../../../constants/routes';

const UserComplaintListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const today = new Date();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUserComplaints(1);
  }, [status, startDate, endDate]);

  const fetchUserComplaints = async (pageNumber = 1) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getUserComplaint({
        start: dayjs(startDate).format('YYYY-MM-DD'),
        end: dayjs(endDate).format('YYYY-MM-DD'),
        page: pageNumber,
        status: status,
      });

      const { data, success } = res?.data;
      if (success) {
        if (pageNumber === 1) {
          setComplaints(data.complaints || data);
        } else {
          setComplaints(prev => [...prev, ...(data.complaints || data)]);
        }
        setPage(pageNumber + 1);
        setHasMore((data.complaints || data).length > 0);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = item.status === 'closed' ? '#4CAF50' : '#F44336';

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() =>
          navigation.navigate(ROUTES.detail_user_complaint, { complaint: item })
        }>
        <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="subject" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Subject: </Text>
            <Text style={styles.value}>{item.subject}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="person" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Customer: </Text>
            <Text style={styles.value}>{item.customer_name}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="route" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Route: </Text>
            <Text style={styles.value}>{item.customer_route}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="calendar-today" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Created: </Text>
            <Text style={styles.value}>{item.created_at}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="flag" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Status: </Text>
            <Text style={styles.value}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatusTabs = () => (
    <View style={styles.statusTabs}>
      {['', 'open', 'closed'].map(s => (
        <TouchableOpacity
          key={s}
          style={[
            styles.statusTab,
            status === s && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => {
            setComplaints([]);
            setPage(1);
            setHasMore(true);
            setStatus(s);
          }}>
          <Text
            style={[
              styles.statusText,
              status === s && { color: '#fff', fontWeight: 'bold' },
            ]}>
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDatePickers = () => (
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
          setComplaints([]);
          setPage(1);
          setHasMore(true);
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
          setComplaints([]);
          setPage(1);
          setHasMore(true);
        }}
        onCancel={() => setOpenEnd(false)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderStatusTabs()}
      {renderDatePickers()}
      <FlatList
        data={complaints}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        onEndReached={() => fetchUserComplaints(page)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text>Loading...</Text> : null}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  statusStrip: {
    width: 6,
    height: '100%',
  },
  card: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginLeft: 6,
  },
  value: {
    marginLeft: 4,
    flexShrink: 1,
  },
  statusTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  statusTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  statusText: {
    color: '#333',
  },
  dateFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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

export default UserComplaintListScreen;
