import React, {useEffect, useState ,useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {getVisitedDistributor} from '../../../../services/distributor_visit_service';
import dayjs from 'dayjs';
import { COLORS } from '../../../../constants/theme/colors';


const VisitedDistributorListScreen = () => {
  const [distributors,setDistributors]=useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    fetchDistributorVisit(today);
  }, []);

  const fetchDistributorVisit = date => {
    setLoading(true);
    getVisitedDistributor(date)
      .then(res => {
        console.log('res', res);
        const {data, errors, success} = res.data;

        if (success) {
          setDistributors(data.distributor_visits);
        } else if (errors) {
          Alert.alert('Error!', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('Fetch error', e);
        Alert.alert('Error', 'Failed to fetch data.');
      })
      .finally(() => setLoading(false));
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.distributor_name}</Text>
      <Text style={styles.code}>SAP: {item.distributor_sap_code}</Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>Punch In:</Text>
        <Text style={styles.timeValue}>{item.check_in_time}</Text>
        <Text style={styles.timeLabel}>Punch Out:</Text>
        <Text style={styles.timeValue}>{item.check_out_time || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <>
          <FlatList
          data={distributors}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
        </>
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  list: {
    paddingHorizontal:15,
    paddingBottom: 20,
  },
  card: {  
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  code: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  timeLabel: {
    fontWeight: '600',
    color: '#555',
  },
  timeValue: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  type: {
    marginTop: 6,
    fontSize: 14,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});

export default VisitedDistributorListScreen;
