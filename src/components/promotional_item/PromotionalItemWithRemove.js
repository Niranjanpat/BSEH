import {StyleSheet, View} from 'react-native';
import {Button, Caption, List, Text} from 'react-native-paper';
import VerticalSpacer from '../VerticalSpacer';
import {COLORS} from '../../constants/theme/colors';
import PromotionalQuantity from './PromotionalQuantity';
import {memo} from 'react';
import { useDispatch } from 'react-redux';
import { removeItemFromCartPromotional } from '../../store/actions/cart';

const PromotionalItemWithRemove = ({item}) => {

    const dispatch = useDispatch();

  return (
    <List.Item
      style={styles.list}
      titleStyle={{fontWeight: 'bold'}}
      titleNumberOfLines={10}
      title={item.promotional_item_name}
      descriptionStyle={{flex: 1}}
      description={_ => (
        <>
          <Caption>
            {item.promotional_item_sap_code
              ? item.promotional_item_sap_code
              : 'N/A'}
          </Caption>
          <View style={{flex: 1}} />
          <Text>Quantity : {item.quantity ? item.quantity : 'N/A'}</Text>
          <VerticalSpacer />
          <Button
            icon="close"
            style={{alignSelf: 'flex-end', marginHorizontal: 5}}
            theme={{colors: {primary: COLORS.error}}}
            onPress={() => dispatch(removeItemFromCartPromotional(item.id))}>
            REMOVE
          </Button>
        </>
      )}
      right={_ => (
        <View style={styles.listRight}>
          <PromotionalQuantity data={item} />
        </View>
      )}
    />
  );
};

export default memo(PromotionalItemWithRemove);

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  listRight: {
    width: '16%',
    alignItems: 'center',
  },
});
