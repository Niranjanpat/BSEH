import React ,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getTaDasDetail } from '../../../services/ta_das_services';

const TaDasDetailScreen = ({ route }) => {
  const { item } = route.params;
  const theme = useTheme();
  const [data,setData] = useState([]);

  useEffect(()=>{
    fetchTaDasDetail();
  },[])


  const fetchTaDasDetail = async () => {
      try {
        const res = await getTaDasDetail(item._id);
        const {data, success, errors} = res?.data;
        if (success) {
          setData(data);
        } else {
          console.log(errors);
          Alert.alert('Error', JSON.stringify(errors));
        }
      } catch (error) {
        console.log('getExpenses', error);
      }
    };
  
  const statusColor = data.status === 'approved' ? '#4CAF50' : '#F44336';

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TA/DA Details</Text>

        <DetailRow icon="calendar-today" label="Date" value={data.date} />
        <DetailRow icon="commute" label="Vehicle Type" value={data.user_vehicle_type} />
        <DetailRow icon="attach-money" label="Rate/KM" value={`₹${data.rupees_per_km_for_vehicle}`} />
        <DetailRow icon="map" label="User KM" value={`${data.user_vehicle_km} km`} />
        <DetailRow icon="payments" label="Calculated Amount" value={`₹${data.amount}`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Approval Details</Text>

        <DetailRow icon="done" label="Status" value={data.status} valueColor={statusColor} />

        <DetailRow icon="trending-up" label="Approved KM" value={`${data.approved_vehicle_km} km`} />
        <DetailRow icon="account-balance-wallet" label="Approved Amount" value={`₹${data.approved_amount}`} />

        {data.approved_at ? (
          <>
            <DetailRow icon="person" label="Approved By" value={data.approved_by_name} />
            <DetailRow icon="event-available" label="Approved At" value={data.approved_at} />
            <DetailRow icon="security" label="Role" value={data.approved_by_role} />
          </>
        ) : null}

        {data.rejected_at ? (
          <>
            <DetailRow icon="person" label="Rejected By" value={data.rejected_by_name} />
            <DetailRow icon="event-busy" label="Rejected At" value={data.rejected_at} />
            <DetailRow icon="security" label="Rejected Role" value={data.rejected_by_role} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ icon, label, value, valueColor = '#000' }) => (
  <View style={styles.row}>
    <Icon name={icon} size={20} color="#3f51b5" style={styles.icon} />
    <Text style={styles.label}>{label}:</Text>
    <Text style={[styles.value, { color: valueColor }]}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  statusStrip: {
    height: 5,
    width: '100%',
    marginBottom: 12,
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
    width: 130,
  },
  value: {
    fontSize: 14,
    flexShrink: 1,
  },
});

export default TaDasDetailScreen;
