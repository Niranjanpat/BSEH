import {useState} from 'react';
import {
  assignPromotionalItem,
  customerPromotionalItem,
  userPromotionalItem,
} from '../services/promotional_item_service';
import {Alert} from 'react-native';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { clearCartPromotionalItems } from '../store/actions/cart';

const usePromotionalItems = () => {
  const [customerPromotionalItems, setCustomerPromotionalItems] = useState([]);
  const [userPromotionalItems, setUserPromotionalItems] = useState([]);
  const [isAssignedPromotionalItems, setIsAssignedPromotionalItems] =
    useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const getCustomerPromotionalItems = async (
    customerId,
    userId,
    startDate,
    endDate,
  ) => {
    setLoading(true);

    const params = {
      customer_id: customerId ?? '',
      user_id: userId ?? '',
      start_date: startDate ?? dayjs(new Date()).format('YYYY-MM-DD'),
      end_date: endDate ?? dayjs(new Date()).format('YYYY-MM-DD'),
    };

    console.log(params);

    customerPromotionalItem(params)
      .then(res => {
        const {success, data, errors} = res.data;

        console.log('promotional items', data);

        if (success) {
          setCustomerPromotionalItems(data.customer_promotional_items);
        } else {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUserPromotionalItems = async userId => {
    setLoading(true);

    const params = {
      user_id: userId ?? '',
    };

    userPromotionalItem(params)
      .then(res => {
        const {success, data, errors} = res.data;

        console.log('user promotional items', data);

        if (success) {
          setUserPromotionalItems(data.user_promotional_inventory_items);
        } else {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const assignCustomerPromotionalItems = async promotionalItems => {
    setLoading(true);

    const items = promotionalItems.map(v => ({
      _id: v.promotional_item_id,
      quantity: v.cartQuantity,
    }));

    const data = {
      items: JSON.stringify(items)
    }

    console.log('promos - ', data);

    assignPromotionalItem(data)
      .then(res => {
        console.log(res.data);
        const {success, errors} = res.data;
        if (success) {
          dispatch(clearCartPromotionalItems())
          setIsAssignedPromotionalItems(true);
          //   Alert.alert('Success', 'Promotional items assigned successfully');
        } else {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    customerPromotionalItems,
    userPromotionalItems,
    isAssignedPromotionalItems,
    getCustomerPromotionalItems,
    getUserPromotionalItems,
    assignCustomerPromotionalItems,
  };
};

export default usePromotionalItems;
