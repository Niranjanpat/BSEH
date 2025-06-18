import React, { useEffect, useState ,useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import { getSampleDetail } from '../../../services/sample_service';

const SampleDetailScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const item = route.params.item;

  const [detail, setDetail] = useState([]);
  const customer = useRef('');
  const createdAt = useRef('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSampleDetail();
  }, []);

  const fetchSampleDetail = async () => {
    setLoading(true);
    try {
      const res = await getSampleDetail(item._id);
      const { success, data, errors } = res.data;

      if (success) {
        setDetail(data.products || []);
        customer.current=data.customer || '';
        createdAt.current=data.created_at || '';
      } else {
        Alert.alert('Error', errors || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch samples');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <View style={[styles.statusStrip, { backgroundColor: theme.colors.primary }]} />
      <View style={styles.card}>
        <View style={styles.row}>
          <Icon name="category" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>Product: </Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="inventory-2" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>Category: </Text>
          <Text style={styles.value}>{item.category}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="branding-watermark" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>Brand: </Text>
          <Text style={styles.value}>{item.brand}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="production-quantity-limits" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>Quantity: </Text>
          <Text style={styles.value}>{item.quantity} {item.unit}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="attach-money" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>MRP: </Text>
          <Text style={styles.value}>₹{item.mrp}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="price-change" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>Supplier Price: </Text>
          <Text style={styles.value}>₹{item.supplier_selling_price}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="store" size={20} color={theme.colors.primary} />
          <Text style={styles.label}>Dealer Price: </Text>
          <Text style={styles.value}>₹{item.dealer_price}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.customerText}>Customer: {customer.current}</Text>
            <Text style={styles.dateText}>Created: {dayjs(createdAt.current).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <FlatList
            data={detail}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
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
  header: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
  },
  customerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  dateText: {
    color: '#666',
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
});

export default SampleDetailScreen;
