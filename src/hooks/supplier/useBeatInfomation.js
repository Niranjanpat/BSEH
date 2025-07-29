import {useState, useTransition, useEffect} from 'react';
import {getBeatList} from '../../services/supplier_service';
import {Alert} from 'react-native';
import {getBeatDetail} from '../../services/retailer_services';

export const useBeatInformation = userId => {
  const [beats, setBeats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [beatDetails, setBeatDetails] = useState({});
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBeats();
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [name]);

  const fetchBeats = (assignee, frequency) => {
    setIsLoading(true);

    getBeatList(userId, assignee, frequency, name)
      .then(res => {
        const {success, errors, data} = res?.data;
        if (success) {
          startTransition(() => {
            setBeats(data.routes);
            setIsLoading(false);
          });
        } else if (errors) {
          setIsLoading(false);
          Alert.alert('Error!', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert('Error!', JSON.stringify(err));
      });
  };

  const fetchBeatDetails = id => {
    console.log('Fetching beat details for ID:', id);
    setIsLoading(true);
    getBeatDetail(id)
      .then(res => {
        const {success, errors, data} = res?.data;
        console.log('Beat details response:', res.data);
        if (success) {
          startTransition(() => {
            setBeatDetails(data);
            setIsLoading(false);
          });
        } else if (errors) {
          setIsLoading(false);
          Alert.alert('Error!', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert('Error!', JSON.stringify(err));
      });
  };

  const changeQuery = query => {
    setName(query);
  };

  return {
    beats,
    isLoading,
    beatDetails,
    fetchBeats,
    fetchBeatDetails,
    changeQuery,
  };
};
