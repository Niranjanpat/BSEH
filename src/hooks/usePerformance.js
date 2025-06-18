import dayjs from 'dayjs';
import {useState} from 'react';
import {
  getCumulativePerformance,
  getDailyPerformance,
  getSalesPerformanceProducts,
} from '../services/performance_service';
import {getUserHierarchyList} from '../services/userHierarchy_service';
import {Alert} from 'react-native';

const usePerformance = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchUserDailyPerformance = (id, date) => {
    setLoading(true);

    getDailyPerformance(id, dayjs(date).format('YYYY-MM-DD'))
      .then(res => {
        setLoading(false);

        const {success, data} = res.data;

        console.log(res?.data?.data);

        if (success) {
          setData(data);
        }
      })
      .catch(err => {
        setLoading(false);

        console.log('fetch daily performance error', err?.response?.data);
      });
  };

  const fetchMtdPerformanceData = (id, startDate, endDate) => {
    setLoading(true);

    getCumulativePerformance(
      id,
      dayjs(startDate).format('YYYY-MM-DD'),
      dayjs(endDate).format('YYYY-MM-DD'),
    )
      .then(res => {
        setLoading(false);

        const {success, data, errors} = res.data;

        if (success) {
          setData(data);
        } else {
          const {start_date, end_date} = errors;

          if (start_date) {
            return Alert.alert('Error', start_date);
          }

          if (end_date) {
            return Alert.alert('Error', end_date);
          }
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('fetch cumulative performance error', err?.response?.data);
      });
  };

  const fetchSubordinates = () => {
    getUserHierarchyList('').then(res => {
      const {data, errors, success} = res.data;
      if (success) {
        setUsers(data.users);
      } else {
        console.log(errors);
      }
    });
  };

  const fetchSalesProducts = (ids, startDate, endDate) => {
    setLoading(true);
    getSalesPerformanceProducts(
      ids,
      dayjs(startDate).format('YYYY-MM-DD'),
      dayjs(endDate).format('YYYY-MM-DD'),
    )
      .then(res => {
        setLoading(false);

        const {success, data, errors} = res.data;

        if (success) {
          setProducts(data.products);
        } else {
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('fetch sales performance error', err?.response);
      });
  };

  return {
    loading,
    data,
    users,
    products,
    fetchSalesProducts,
    fetchUserDailyPerformance,
    fetchMtdPerformanceData,
    fetchSubordinates,
  };
};

export default usePerformance;
