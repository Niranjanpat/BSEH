import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const dummyData = {
    username: 'John Doe',
    emailid: 'john.doe@example.com',
    fathername: 'Richard Doe',
    mothername: 'Emily Doe',
    dateofbirth: '1990-01-15',
    gender: 'Male',
    martialstatus: 'Single',
    mobilenumber: '+1 234 567 890',
    branchname: 'Main Branch',
    dateofjoining: '2015-06-01',
    dateofretirement: '2055-06-01',
    AccountNumber: '1234567890',
    bankname: 'National Bank',
    bankbranchname: 'Central City',
    ifsccode: 'NBIN0001234',
  };

  const fetchProfile = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await fetch('https://example.com/api/profile'); // replace with your API
      const data = await response.json();

      if (response.ok && data) {
        setProfile(data);
      } else {
        setError(data?.message || 'Failed to load profile');
        setProfile(dummyData); // Fallback to dummy data
      }
    } catch (err) {
      setError('Something went wrong. Showing sample profile.');
      setProfile(dummyData); // Fallback if API fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //fetchProfile();
    setProfile(dummyData);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
   // fetchProfile().finally(() => setRefreshing(false));
  }, []);

  // if (loading && !refreshing) {
  //   return (
  //     <View style={styles.centered}>
  //       <ActivityIndicator size="large" color="#3498db" />
  //     </View>
  //   );
  // }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Text
            size={70}
            label={profile?.username?.[0] || 'U'}
            style={{ backgroundColor: '#3498db' }}
            color="#fff"
          />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.username}>{profile?.username || 'User Name'}</Text>
            <Text style={styles.email}>{profile?.emailid}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Personal Details */}
      <SectionCard title="Personal Information">
        <ProfileItem label="Father's Name" value={profile?.fathername} />
        <ProfileItem label="Mother's Name" value={profile?.mothername} />
        <ProfileItem label="Date of Birth" value={profile?.dateofbirth} />
        <ProfileItem label="Gender" value={profile?.gender} />
        <ProfileItem label="Marital Status" value={profile?.martialstatus} />
        <ProfileItem label="Mobile Number" value={profile?.mobilenumber} />
        <ProfileItem label="Branch Name" value={profile?.branchname} />
        <ProfileItem label="Date of Joining" value={profile?.dateofjoining} />
        <ProfileItem label="Date of Retirement" value={profile?.dateofretirement} />
      </SectionCard>

      {/* Bank Details */}
      <SectionCard title="Bank Details">
        <ProfileItem label="Account Number" value={profile?.AccountNumber} />
        <ProfileItem label="Bank Name" value={profile?.bankname} />
        <ProfileItem label="Bank Branch Name" value={profile?.bankbranchname} />
        <ProfileItem label="IFSC Code" value={profile?.ifsccode} />
      </SectionCard>
    </ScrollView>
  );
};

const SectionCard = ({ title, children }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Divider style={{ marginVertical: 8 }} />
      {children}
    </Card.Content>
  </Card>
);

const ProfileItem = ({ label, value }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 10,
    marginBottom:40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   headerCard: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 0, // removes Android shadow
    shadowColor: 'transparent', // removes iOS shadow
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 0, // removes Android shadow
    shadowColor: 'transparent', // removes iOS shadow
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
  item: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#888',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
});

export default ProfileScreen;
