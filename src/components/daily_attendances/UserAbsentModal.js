import dayjs from 'dayjs';
import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  Text,
  TextInput,
  Title,
} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';
import useDailyAttendances from '../../hooks/useDailyAttendances';
import {getAbsentReason} from '../../services/punch_service';

const UserAbsentModal = ({
  visible,
  onClose,
  id,
  date = new Date(),
  onSuccess,
}) => {
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  const {actionLoading, postUserAbsent} = useDailyAttendances();

  const fetchReasons = () => {
    getAbsentReason()
      .then(res => {
        const {reasons} = res.data?.data;

        let temp = [];

        if (reasons) {
          reasons.map(item => temp.push({label: item?.text, value: item?._id}));

          setReasons(temp);
        }
      })
      .catch(err => {
        console.log('absent err', err.response.data);
      });
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = () => {
    onSuccess();
  };

  return (
    <Portal>
      <Dialog visible={visible} dismissable={false}>
        <Dialog.Content>
          <Title style={styles.title}>Select reason for absent</Title>
          {reasons.map(item => (
            <View style={styles.rdoGroup} key={item?.value}>
              <RadioButton
                value={item?.value}
                status={item?.value === selectedReason && 'checked'}
                onPress={() => setSelectedReason(item?.value)}
              />
              <Text>{item?.label}</Text>
            </View>
          ))}
          <TextInput
            label="Leave date"
            value={dayjs(date).format('DD MMMM YYYY')}
            editable={false}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Enter reason of leave"
            value={leaveReason}
            onChangeText={setLeaveReason}
            style={styles.input}
            mode="outlined"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button color={COLORS.error} onPress={onClose}>
            Cancel
          </Button>
          <Button
            loading={actionLoading}
            disabled={actionLoading}
            onPress={() =>
              postUserAbsent(
                date,
                id,
                selectedReason,
                leaveReason,
                handleClose,
                handleSuccess,
              )
            }>
            Submit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 15,
    fontSize: 16,
  },
  input: {
    marginTop: 10,
  },
  rdoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default memo(UserAbsentModal);
