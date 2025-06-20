import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ROUTES} from '../../../constants/routes';
import {getTaDas} from '../../../services/ta_das_services'; // Create this service method

const TaDasListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const today = new Date();

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setPage(1);
    fetchTaDas(1);
  }, [startDate, endDate]);

  const fetchTaDas = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getTaDas({
        start_date: dayjs(startDate).format('YYYY-MM-DD'),
        end_date: dayjs(endDate).format('YYYY-MM-DD'),
        page: pageNumber,
      });

      console.log(res?.data?.data);

      const {ta_das = [], has_more} = res?.data?.data || {};
      if (pageNumber === 1) {
        setData(ta_das);
      } else {
        setData(prev => [...prev, ...ta_das]);
      }
      if (has_more) {
        setPage(pageNumber + 1);
      }
      setHasMore(has_more);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch TA/DAs');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    const statusColor = item.status === 'approved' ? '#4CAF50' : '#F44336';

    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => navigation.navigate(ROUTES.ta_das_detail, {item: item})}>
        <View style={[styles.statusStrip, {backgroundColor: statusColor}]} />
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon
              name="calendar-today"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.label}>Date: </Text>
            <Text style={styles.value}>{item.date}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="commute" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Vehicle: </Text>
            <Text style={styles.value}>{item.user_vehicle_type}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="payments" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Amount: </Text>
            <Text style={styles.value}>₹{item.amount}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="how-to-vote" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Status: </Text>
            <Text style={[styles.value, {color: statusColor}]}>{item.status?.toUpperCase() ?? ""}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
          setData([]);
          setPage(1);
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
          setData([]);
          setPage(1);
          setHasMore(false);
        }}
        onCancel={() => setOpenEnd(false)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderDatePickers()}
      <FlatList
        refreshing={loading}
        onRefresh={() => {
          setPage(1);
          fetchTaDas(page);
        }}
        data={data}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        onEndReached={() => {
          if (loading || !hasMore) {
            return;
          }
          fetchTaDas(page);
        }}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={loading ? <Text>Loading...</Text> : null}
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

export default TaDasListScreen;
