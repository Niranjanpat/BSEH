import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';

const STATUS_COLORS = {
  open: COLORS.primary,
  closed: 'green',
  pending: 'orange',
  rejected: 'red',
};

const getStatusColor = status => STATUS_COLORS[status] || COLORS.primary;

// 🧪 Dummy data
const dummyData = Array.from({length: 25}).map((_, i) => ({
  _id: `${i + 1}`,
  complaint_type_name: `Complaint Type ${i + 1}`,
  subject: `Subject ${i + 1}`,
  customer_sap_code: `SAP_${i + 1}`,
  customer_name: `Customer ${i + 1}`,
  customer_route: `Route ${Math.ceil(i / 5) + 1}`,
  status: i % 3 === 0 ? 'open' : i % 3 === 1 ? 'closed' : 'pending',
  created_at: '2025-06-02 17:37:16',
  is_editable: i % 2 === 0,
}));

const PAGE_SIZE = 10;

const ComplaintListScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    loadMoreData(page);
  }, []);

  const loadMoreData = currentPage => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    setTimeout(() => {
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const nextBatch = dummyData.slice(start, end);

      if (nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setComplaints(prev => [...prev, ...nextBatch]);
        setPage(prev => prev + 1);
      }

      setIsLoading(false);
    }, 500);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[styles.card, {borderLeftColor: getStatusColor(item.status)}]}
      onPress={() => {
        if (item.is_editable) {
          navigation.navigate(ROUTES.update_complaint, {
            complaint: item,
            channel: 'update',
          });
        }else{
            Alert.alert('Error','Editble is Not allowed');
        }
      }}>
      <Text style={styles.title}>{item.subject}</Text>
      <Text style={styles.text}>Type: {item.complaint_type_name}</Text>
      <Text style={styles.text}>Customer: {item.customer_name}</Text>
      <Text style={styles.text}>Route: {item.customer_route}</Text>
      <Text style={styles.text}>SAP Code: {item.customer_sap_code}</Text>
      <Text style={styles.text}>Date: {item.created_at}</Text>
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
    <FlatList
      data={complaints}
      keyExtractor={item => item._id}
      renderItem={renderItem}
      contentContainerStyle={{padding: 16}}
      onEndReached={() => loadMoreData(page)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

export default ComplaintListScreen;

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

//  useEffect(() => {
//         fetchExpenses(page);
//       }, []);

//         const fetchExpenses = async currentPage => {
//           if (isLoading || !hasMore) return;

//           setIsLoading(true);
//           try {
//             const res = await getComplaints(currentPage); // Adjust this as per your API
//             const {data, success, errors} = res?.data;
//             if (success) {
//               const newExpenses = data.expense || [];
//               setExpense(prev => [...prev, ...newExpenses]);

//               if (newExpenses.length === 0) {
//                 setHasMore(false); // No more data
//               } else {
//                 setPage(prev => prev + 1);
//               }
//             } else {
//               Alert.alert('Error', JSON.stringify(errors));
//             }
//           } catch (error) {
//             console.log('getExpenses', error);
//           } finally {
//             setIsLoading(false);
//           }
//         };
