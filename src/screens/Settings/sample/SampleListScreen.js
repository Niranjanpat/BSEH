import React, {useEffect, useState, useLayoutEffect} from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from 'react-native-paper';
import {getSample} from '../../../services/sample_service';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../../constants/routes';

const SampleListScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const today = new Date();

  const [date, setDate] = useState(today);
  const [openDate, setOpenDate] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSampleList();
  }, [date]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setOpenDate(true)}
          style={styles.navButton}>
          <Text style={{color: theme.colors.primary, fontWeight: '600'}}>
            {dayjs(date).format('YYYY-MM-DD')}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, date]);

  const fetchSampleList = async () => {
    setLoading(true);
    try {
      const res = await getSample(dayjs(date).format('YYYY-MM-DD'));
      const {success, data, errors} = res.data;
      if (success) {
        setData(data.samples || []);
      } else {
        Alert.alert('Error', errors || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch samples');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => navigation.navigate(ROUTES.sample_detail, {item})}>
        <View
          style={[styles.statusStrip, {backgroundColor: theme.colors.primary}]}
        />
        <View style={styles.card}>
          <View style={styles.row}>
            <Icon name="person" size={20} color={theme.colors.primary} />
            <Text style={styles.label}>Customer: </Text>
            <Text style={styles.value}>{item.customer}</Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="calendar-today"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.label}>Created At: </Text>
            <Text style={styles.value}>
              {dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <DatePicker
        modal
        mode="date"
        open={openDate}
        date={date}
        onConfirm={selected => {
          setOpenDate(false);
          setDate(selected);
        }}
        onCancel={() => setOpenDate(false)}
      />

      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No samples found.</Text>
          ) : null
        }
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
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
  navButton: {
    marginRight: 12,
    backgroundColor: '#f1f9fe',
    padding: 4,
    borderRadius: 5,
  },
});

export default SampleListScreen;
