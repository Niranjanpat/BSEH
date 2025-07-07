import dayjs from 'dayjs';
import React, {useEffect, useState, memo} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {
  Dialog,
  Divider,
  Portal,
  Text,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import VerticalSpacer from '../../components/VerticalSpacer';

import client from '../../services/axios_client';

import {URLS} from '../../constants/urls';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../constants/theme';

const LastTenVisitsModal = ({visible = false, onClose = () => {}, id}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchLastTenVisits();
    }
  }, [visible]);

  const fetchLastTenVisits = async () => {
    setIsLoading(true);
    const url = URLS.customer + id + '/' + URLS.lastVisits;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;

      // console.log(data);
      if (success) {
        setVisits(data.customer_visits);
      } else if (errors) {
        if (errors.token_role) {
          return Alert.alert('Oops', errors.token_role);
        }

        Alert.alert('Oops', Object.values(errors).join(', '));
      }
    } catch (error) {
      Alert.alert('Error', error.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog style={styles.dialog} visible={visible} dismissable={false}>
        <Title
          style={{
            textAlign: 'center',
          }}>
          Last 10 Visits
        </Title>
        <Divider />

        <FlatList
          data={visits}
          keyExtractor={(item, _) => item._id}
          ListHeaderComponentStyle={styles.headerStyle}
          ListHeaderComponent={() => <TableTitle />}
          style={styles.flatList}
          ListEmptyComponent={() => <EmptyView isLoading={isLoading} />}
          ItemSeparatorComponent={() => <VerticalSpacer />}
          renderItem={({item}) => {
            const checkedIn = dayjs(item.check_in_time).format(
              'M/DD/YY, HH:mm',
            );
            const checkedOut = dayjs(item.check_out_time).format(
              'M/DD/YY, HH:mm',
            );
            return (
              <>
                <View style={styles.itemContainer}>
                  <Text style={{flex: 1, textAlign: 'center'}}>
                    {checkedIn}
                  </Text>
                  <Text style={{flex: 1, textAlign: 'center'}}>
                    {checkedOut}
                  </Text>
                </View>
              </>
            );
          }}
        />

        <Divider />
        <Dialog.Actions>
          <TouchableRipple onPress={() => onClose(false)}>
            <Text style={styles.defaultButton}>Close</Text>
          </TouchableRipple>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const EmptyView = ({isLoading}) => {
  if (isLoading)
    return (
      <Text style={styles.emptyViewText}>Fetching your last 10 visits...</Text>
    );

  return <Text style={styles.emptyViewText}>No data found!</Text>;
};

const TableTitle = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textDecorationLine: 'underline',
          color: COLORS.accentPrimary,
          ...TYPOGRAPHY.subtitle1,
        }}>
        Checked in at
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          textDecorationLine: 'underline',
          color: COLORS.accentPrimary,
          ...TYPOGRAPHY.subtitle1,
        }}>
        Checked out at
      </Text>
    </View>
  );
};

export default memo(LastTenVisitsModal);

const styles = StyleSheet.create({
  dialog: {
    height: '70%',
  },

  flatList: {
    height: '60%',
  },

  defaultButton: {
    padding: 6,
  },

  emptyViewText: {
    paddingTop: SPACINGS.md,
    textAlign: 'center',
  },

  headerStyle: {
    marginVertical: SPACINGS.xs,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
