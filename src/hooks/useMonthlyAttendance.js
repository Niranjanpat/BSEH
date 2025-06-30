import dayjs from 'dayjs';
import {useMemo} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {COLORS} from '../constants/theme/colors';
import {getMonthlyAttendance} from '../services/auth_service';

const useMonthlyAttendance = () => {
  const [loading, setLoading] = useState(true);

  const [calendar, setCalendar] = useState(true);

  const [data, setData] = useState([]);

  const [date, setDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState('');

  const handleFetch = (year, month) => {
    setLoading(true);

    getMonthlyAttendance(year, month)
      .then(res => {
        const {daily_attendances} = res.data?.data;
        setData(daily_attendances);
      })
      .catch(err => {
        console.log('month err', err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleFetch(dayjs(date).format('YYYY'), dayjs(date).format('MM'));
  }, []);

  const datas = useMemo(() => {
    if (!calendar) {
      return data;
    }

    let temp = {};

    data?.forEach(item => {
      let date = item.date;

      temp = {
        ...temp,
        [date]: {
          customStyles: {
            container: {
              backgroundColor:
                item?.date === dayjs(selectedDate).format('YYYY-MM-DD')
                  ? '#437CE2'
                  : item?.status === 'present'
                  ? COLORS.primary
                  : item.status === 'absent'
                  ? COLORS.accentPrimary
                  : null,
            },
            text: {
              color: !item?.status ? 'black' : 'white',
              fontWeight: !item?.status ? 'normal' : 'bold',
            },
          },
        },
      };
    });

    return temp;
  }, [calendar, data, selectedDate]);

  return {
    loading,
    calendar,
    setCalendar,
    datas,
    handleFetch,
    date,
    setDate,
    data,
    setSelectedDate,
  };
};

export default useMonthlyAttendance;
