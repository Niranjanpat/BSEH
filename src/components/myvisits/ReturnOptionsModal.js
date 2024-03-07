import React from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Dialog, List, Title} from 'react-native-paper';

import {SPACINGS} from '../../constants/theme';
import {ROUTES} from '../../constants/routes';
import {storeReturnType} from '../../store/actions/returns';

const ReturnOptionsModal = ({visible, onDismiss}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const navigateTo = (screen, type) => {
    onDismiss(false);
    navigation.navigate(screen);
    dispatch(storeReturnType(type));
  };

  return (
    <Dialog visible={visible} onDismiss={() => onDismiss(false)}>
      <Title
        style={{
          textAlign: 'center',
          marginVertical: SPACINGS.sm,
        }}>
        Return type...
      </Title>
      <Dialog.Content>
        <List.Item
          left={props => <List.Icon {...props} icon="clock-fast" />}
          onPress={() => navigateTo(ROUTES.return_stack, 'expired')}
          title="Expiry"
        />
        <List.Item
          left={props => <List.Icon {...props} icon="alert-decagram" />}
          onPress={() => navigateTo(ROUTES.return_stack, 'damaged')}
          title="Damaged"
        />
      </Dialog.Content>
    </Dialog>
  );
};

export default ReturnOptionsModal;

const styles = StyleSheet.create({});
