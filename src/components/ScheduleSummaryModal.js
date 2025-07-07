import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet} from 'react-native';
import {
  Button,
  Caption,
  Dialog,
  Divider,
  ProgressBar,
  Text,
  Title,
} from 'react-native-paper';
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

import {attendancePunchOut} from '../store/actions/auth';
import {scheduleSummary} from '../services/activity_service';

import VerticalSpacer from './VerticalSpacer';
import HorizontalSpacer from './HorizontalSpacer';

const date = dayjs().format('YYYY-MM-DD');
const ScheduleSummaryModal = ({visible = false, onClose = () => {}}) => {
  const dispatch = useDispatch();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) fetchScheduleSummary();
  }, [visible]);

  const fetchScheduleSummary = () => {
    setIsLoading(true);
    scheduleSummary(date)
      .then(res => {
        const {data, success, errors} = res.data;

        if (success) {
          setData(data);
        } else if (errors) {
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog visible={visible} dismissable={false}>
      <Dialog.Content>
        <>
          <Title>Today's Visit Summary</Title>
          <Caption>
            Total number of shops to visit:{' '}
            <Text> {data.total_not_visited}</Text>
          </Caption>
          <Caption>
            Total number of shops visited: <Text> {data.total_visited}</Text>
          </Caption>
        </>
        <VerticalSpacer />
        <Divider />
        <VerticalSpacer />
        <>
          <Title>Today's Order Summary</Title>
          <Caption>
            Total number of orders: <Text> {data.total_orders}</Text>
          </Caption>
          <Caption>
            Total order value:{' '}
            <Text> {data.total_order_value?.toFixed(2)}</Text>
          </Caption>
          <Caption>
            Total order quantity: <Text> {data.total_order_quantity}</Text>
          </Caption>
        </>
      </Dialog.Content>
      <Divider />
      <ProgressBar indeterminate visible={isLoading} />
      <Dialog.Actions>
        <Button onPress={() => onClose(false)}>Cancel</Button>
        <HorizontalSpacer size={20} />
        <Button
          mode="outlined"
          onPress={() => {
            Geolocation.getCurrentPosition(
              position => {
                var data = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
               // dispatch(attendancePunchOut(data));
                onClose(false);
              },
              error => {
                console.log(error.code, error.message);
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
              },
            );
          }}>
          {'  '}
          Ok{'  '}
        </Button>
        <HorizontalSpacer size={25} />
      </Dialog.Actions>
    </Dialog>
  );
};

export default ScheduleSummaryModal;
