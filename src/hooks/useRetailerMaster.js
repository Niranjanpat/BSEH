import {useState, useTransition} from 'react';
import {
  getCustomerClassList,
  getCustomerTypeList,
} from '../services/retailer_services';
import {Alert} from 'react-native';

export const useRetailerMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  const setFilter = menu => {
    switch (menu) {
      case 'Type':
        fetchCustomerTypes();
        break;
      case 'Class':
        fetchCustomerClasses();
        break;
      default:
        console.log('Invalid menu');
    }
  };

  const fetchCustomerTypes = () => {
    setLoading(true);
    getCustomerTypeList()
      .then(res => {
        const {data, success, errors} = res.data;

        if (success) {
          setCustomerData(data.customer_types);
        } else if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
          setLoading(false);
        }
      })
      .catch(e => {
        Alert.alert(e);
        setLoading(false);
      });
  };

  const fetchCustomerClasses = () => {
    setLoading(true);
    getCustomerClassList()
      .then(res => {
        const {data, success, errors} = res.data;

        if (success) {
          setCustomerData(data.customer_classes);
        } else if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
          setLoading(false);
        }
      })
      .catch(e => {
        Alert.alert(e);
        setLoading(false);
      });
  };

  const setCustomerData = value => {
    startTransition(() => {
      setData(value);
      setLoading(false);
    });
  };

  return {
    data,
    loading,
    setFilter,
  }
};
