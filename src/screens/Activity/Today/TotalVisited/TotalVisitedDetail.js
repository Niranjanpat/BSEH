import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList ,Alert} from 'react-native';
import {Caption, List, Subheading, Text} from 'react-native-paper';
import {SPACINGS} from '../../../../constants/theme';
import {COLORS} from '../../../../constants/theme/colors';
import {URLS} from '../../../../constants/urls';
import client from '../../../../services/axios_client';

const TotalVisitedDetail = ({route}) => {
  const {data, date} = route.params;
  const [customer, setCustomer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchMyVisit();
  }, []);

  async function fetchMyVisit() {
    try {
      setIsLoading(true);
      const response = await client.get(
        URLS.scheduleCustomer + dayjs(date).format('YYYY-MM-DD'),
      );
      const {data, errors, success} = response.data;
      if (success) {
        // console.log('fetchMyVisit:::', data);
        setCustomer(data.customers);
      } else if (errors) {
        Alert.alert('Error', Object.values(errors).join(', '));
        // Alert.alert('Oops!', error.toString())
        console.log('fetchMyVisit error:::', errors);
      }
    } catch (error) {
      Alert.alert('Oops!', error.toString());
      // console.log('fetchMyVisit exception:::', error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.summeryVisit}>
        <Text style={styles.visit}>
          Total Shop Visited: {data.total_visited}
        </Text>
        <Text style={styles.notVisit}>
          Total Shop Not Visited: {data.total_not_visited}
        </Text>
      </View>
      <FlatList
        data={customer}
        refreshing={isLoading}
        onRefresh={() => fetchMyVisit()}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          if (isLoading) {
            return (
              <Text style={styles.emptyText}>Fetching your visits...</Text>
            );
          }

          return <Text style={styles.emptyText}>No visits found</Text>;
        }}
        keyExtractor={(item, _) => item._id}
        renderItem={({item}) => {
          return (
            <List.Item
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={item.name}
              description={_ => (
                <>
                  <Caption numberOfLines={2}>
                    {item.billing_address ? item.billing_address : 'N/A'}
                  </Caption>

                  {item.owner_contact_number ? (
                    <Text>{item.owner_contact_number}</Text>
                  ) : null}

                  {item.customer_type ? (
                    <Text>{item.customer_type}</Text>
                  ) : null}
                </>
              )}
              right={props => (
                <View style={styles.listRight}>
                  <Text
                    style={[
                      styles.chip,
                      {
                        backgroundColor: item.is_visited
                          ? COLORS.success
                          : COLORS.error,
                      },
                    ]}>
                    {item.is_visited ? 'Visited' : 'Not visited'}
                  </Text>
                </View>
              )}
            />
          );
        }}
      />
    </View>
  );
};

export default TotalVisitedDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  summeryVisit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  emptyText: {
    alignSelf: 'center',
    marginTop: SPACINGS.xxl,
  },

  list: {
    backgroundColor: '#fff',
    marginBottom: SPACINGS.sm,
    borderRadius: 10,
    overflow: 'hidden',
  },

  listRight: {
    flexDirection: 'row',
    alignSelf: 'center',
  },

  chip: {
    backgroundColor: COLORS.accentPrimary,
    color: '#fff',
    flexGrow: 0,
    alignSelf: 'center',
    padding: SPACINGS.xs,
    borderRadius: 10,
  },
  visit: {
    color: COLORS.success,
    fontSize: 15,
  },
  notVisit: {
    color: COLORS.error,
    fontSize: 15,
  },
  contentContainerStyle: {
    // padding: SPACINGS.sm,
  },
});
