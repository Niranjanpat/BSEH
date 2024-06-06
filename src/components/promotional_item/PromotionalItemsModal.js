import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Dialog, List, Title} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SPACINGS} from '../../constants/theme';
import {ROUTES} from '../../constants/routes';
import { useSelector } from 'react-redux';

const PromotionalItemsModal = ({customerId, visible, onDismiss}) => {
  const navigation = useNavigation();

  const {customerVisitStatus} = useSelector(state => state.order);

  const navigateTo = screen => {
    onDismiss(false);
    navigation.navigate(screen, {customerId});
  };

  return (
    <Dialog visible={visible} onDismiss={() => onDismiss(false)}>
      <Title
        style={{
          textAlign: 'center',
          marginVertical: SPACINGS.sm,
        }}>
        Promotional Items
      </Title>
      <Dialog.Content>
        <List.Item
          left={props => <List.Icon {...props} icon="tag" />}
          onPress={() => navigateTo(ROUTES.customer_promotional_items)}
          title="View Items"
        />
        {(customerVisitStatus.status &&
          customerVisitStatus.customer_id === customerId) && (
            <List.Item
              left={props => <List.Icon {...props} icon="tag-plus" />}
              onPress={() => navigateTo(ROUTES.user_promotional_items)}
              title="Assign Items"
            />
          )}
      </Dialog.Content>
    </Dialog>
  );
};

export default PromotionalItemsModal;

const styles = StyleSheet.create({});
