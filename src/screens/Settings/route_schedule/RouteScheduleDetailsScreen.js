import dayjs from 'dayjs';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  Dialog,
  Divider,
  Portal,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../../components/LoadingView';
import {COLORS} from '../../../constants/theme/colors';
import useRouteSchedule from '../../../hooks/useRouteSchedule';
import {ROUTES} from '../../../constants/routes';

const RouteScheduleDetailsScreen = ({route, navigation}) => {
  const {id, status} = route.params;

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const {
    loading,
    scheduleDetail,
    fetchRouteScheduleDetails,
    removeRouteSchedule,
    handleRouteCancel,
  } = useRouteSchedule();

  const onDeletePress = () => {
    Alert.alert('Confirm', 'Proceed to delete route schedule', [
      {
        text: 'Cancel',
      },
      {
        text: 'Proceed',
        onPress: () => removeRouteSchedule(id),
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {status === 'approved' && (
            <Icon
              name="close"
              size={24}
              style={styles.icon}
              onPress={() => setOpen(true)}
            />
          )}
          {status === 'pending' && (
            <>
              <Icon
                name="delete"
                size={24}
                style={styles.icon}
                onPress={onDeletePress}
              />
              <Icon
                name="comment-edit"
                size={24}
                style={styles.icon}
                onPress={() =>
                  navigation.navigate(ROUTES.update_route_schedule, {
                    item: scheduleDetail,
                    id: id,
                  })
                }
              />
            </>
          )}
        </>
      ),
    });
  }, [status, scheduleDetail]);

  useEffect(() => {
    fetchRouteScheduleDetails(id);
  }, []);

  return (
    <View style={styles.root}>
      {loading && <LoadingView />}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Subheading style={styles.title}>Schedule information</Subheading>
            <Text
              style={[
                styles.status,
                status === 'approved'
                  ? styles.approved
                  : status === 'rejected'
                  ? styles.rejected
                  : styles.pending,
              ]}>
              {status === 'approved'
                ? 'Approved'
                : status === 'rejected'
                ? 'Rejected'
                : status === 'cancelled'
                ? 'Cancelled'
                : 'Pending'}
            </Text>
          </View>
          <Divider />
          <Divider />
          <Divider />
          <View style={styles.row}>
            <View style={styles.left}>
              <Icon name="calendar" size={22} />
              <Text style={styles.text}>Date</Text>
            </View>
            <View style={styles.right}>
              <Text>{dayjs(scheduleDetail.date).format('DD MMMM YYYY')}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.left}>
              <Icon name="map-marker-distance" size={22} />
              <Text style={styles.text}>Route</Text>
            </View>
            <View style={styles.right}>
              <Text>{scheduleDetail.route_name}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.left}>
              <Icon name="briefcase" size={22} />
              <Text style={styles.text}>SAP Code</Text>
            </View>
            <View style={styles.right}>
              <Text>{scheduleDetail.route_sap_code}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.left}>
              <Icon name="comment-processing" size={22} />
              <Text style={styles.text}>Remarks</Text>
            </View>
            <View style={styles.right}>
              <Text>{scheduleDetail?.remarks}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Portal>
        <Dialog
          style={styles.dialog}
          dismissable={false}
          visible={open}
          theme={{roundness: 3}}>
          <Dialog.Title>Cancel schedule</Dialog.Title>
          <Dialog.Content>
            <TextInput
              value={reason}
              onChangeText={setReason}
              label="Reason"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setOpen(false);
                setReason('');
              }}>
              Close
            </Button>
            <Button
              onPress={() => {
                setOpen(false);
                handleRouteCancel({reason}, id);
                setReason('');
              }}>
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  container: {
    padding: 10,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  header: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  status: {
    padding: 10,
    color: COLORS.light,
    borderRadius: 10,
  },
  approved: {
    backgroundColor: COLORS.success,
  },
  rejected: {
    backgroundColor: COLORS.error,
  },
  pending: {
    backgroundColor: COLORS.accentPrimary,
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingHorizontal: 10,
  },

  top: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  dialog: {
    backgroundColor: COLORS.light,
  },
  input: {
    backgroundColor: 'transparent',
  },
});

export default RouteScheduleDetailsScreen;
