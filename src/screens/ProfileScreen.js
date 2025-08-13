import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await fetch('https://example.com/api/profile'); // replace with your API
      const data = await response.json();

      if (response.ok) {
        setProfile(data);
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile().finally(() => setRefreshing(false));
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error && !profile) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header Card */}
      <Card style={styles.headerCard}>
        <Card.Title
          title={profile?.username || 'User Name'}
          subtitle={profile?.emailid || ''}
          left={(props) => <Avatar.Text {...props} label={profile?.username?.[0] || 'U'} />}
        />
      </Card>

      {/* Details Card */}
      <Card style={styles.card}>
        <Card.Content>
          <ProfileItem label="Father's Name" value={profile?.fathername} />
          <ProfileItem label="Mother's Name" value={profile?.mothername} />
          <ProfileItem label="Date of Birth" value={profile?.dateofbirth} />
          <ProfileItem label="Gender" value={profile?.gender} />
          <ProfileItem label="Marital Status" value={profile?.martialstatus} />
          <ProfileItem label="Mobile Number" value={profile?.mobilenumber} />
          <ProfileItem label="Email ID" value={profile?.emailid} />
          <ProfileItem label="Branch Name" value={profile?.branchname} />
          <ProfileItem label="Date of Joining" value={profile?.dateofjoining} />
          <ProfileItem label="Date of Retirement" value={profile?.dateofretirement} />
        </Card.Content>
      </Card>

      {/* Bank Details Card */}
      <Card style={styles.card}>
        <Card.Content>
          <ProfileItem label="Account Number" value={profile?.AccountNumber} />
          <ProfileItem label="Bank Name" value={profile?.bankname} />
          <ProfileItem label="Bank Branch Name" value={profile?.bankbranchname} />
          <ProfileItem label="IFSC Code" value={profile?.ifsccode} />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const ProfileItem = ({ label, value }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
  },
  item: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default ProfileScreen;