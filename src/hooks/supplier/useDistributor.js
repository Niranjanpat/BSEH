import {useEffect, useRef, useState, useTransition} from 'react';
import {
  getDistributorDetail,
  getDistributors,
} from '../../services/supplier_service';
import {Alert} from 'react-native';
import { getTodayDistributorVisits } from '../../services/distributor_visit_service';

export const useDistributor = (distributorId,  channel ,userId) => {
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [pending, startTransition] = useTransition();
  const [distributorDetail, setDistributorDetail] = useState({});
  const [name,setName] =useState('');
  const selectedAssignee = useRef('');

  useEffect(() => {
    if (distributorId) {

      fetchDistributorDetail(distributorId);
      return;
    }
    fetchDistributors(page);
  }, [page]);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchDistributors(page);
      } else {
        resetPage();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [name]);



  const refreshData = assignee => {
    if (assignee) {
      selectedAssignee.current = assignee;
    } else {
      selectedAssignee.current = '';
    }

    if (page === 1) {
      fetchDistributors(page ,assignee);
      return;
    }
    resetPage();
  };

  const changePage = () => {
    if (!loading && hasMore) {
      setPage(pre => pre + 1);
    }
  };

  const resetPage = () => {
    setPage(1);
  };

  const fetchDistributors = (page,assignee) => {
    setLoading(true);
    getDistributors(page ,assignee)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          if (page === 1) {
            setData(data?.distributors, data?.has_more);
          } else {
            setData([...distributors, ...data?.distributors], data?.has_more);
          }
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log('distributors', e);
      })
      .finally(() => setLoading(false));
  };

  const setData = (value, isHasMore) => {
    startTransition(() => {
      setDistributors(value);
      setHasMore(isHasMore);
      setLoading(false);
    });
  };

  const fetchDistributorDetail = id => {
    setLoading(true);
    getDistributorDetail(id)
      .then(res => {
        const {data, errors, success} = res.data;

        if (success) {
          startTransition(() => {
            setDistributorDetail(data);
            setLoading(false);
          });
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log('distributor_detail_error', e);
      })
      .finally(() => setLoading(false));
  };

  const refreshDetails = () => {
    fetchDistributorDetail(distributorId);
  };

  const changeQuery=(query)=>{
    setName(query);
  }

  return {
    distributors,
    loading,
    refreshData,
    changePage,
    resetPage,
    distributorDetail,
    refreshDetails,
    changeQuery,
  };
};
