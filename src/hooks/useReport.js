import {useState} from 'react';
import {
  getComplianceReport,
  getCumulativeReport,
  getMonthlyCumulativereport,
  getMtdReport,
  getTodayCumulativereport,
  getTodayReport,
  getTodayReportById,
} from '../services/performance_service';
import dayjs from 'dayjs';
import {Alert} from 'react-native';

const useReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [reports, setReports] = useState([]);

  const fetchTodayReport = () => {
    setLoading(true);

    getTodayReport()
      .then(res => {
        setLoading(false);
        const {data, success} = res.data;

        if (success) {
          setData(data);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('today report err', err);
      });
  };

  const fetchTodayCumulativeReport = (year, month) => {
    setLoading(true);

    console.log(year, month);

    getMonthlyCumulativereport(year, month)
      .then(res => {
        setLoading(false);

        const {data, success} = res.data;

        console.log(data);

        if (success) {
          setData(data);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('get today cumulative report error', err?.response?.data);
      });
  };

  const fetchCumulativeReport = date => {
    setLoading(true);

    getCumulativeReport(dayjs(date).format('YYYY-MM-DD'))
      .then(res => {
        setLoading(false);

        const {success, data} = res.data;

        if (success) {
          setData(data);
        }
      })
      .catch(err => {
        setLoading(false);

        console.log('get  cumulative report error', err?.response?.data);
      });
  };

  const fetchMtdReport = () => {
    setLoading(true);

    getMtdReport()
      .then(res => {
        setLoading(false);
        const {data, success} = res.data;

        if (success) {
          setReports(data);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('today report err', err?.response?.data);
      });
  };

  const fetchTodayReportById = id => {
    setLoading(true);

    getTodayReportById(id)
      .then(res => {
        setLoading(false);
        const {data, success} = res.data;

        if (success) {
          setData(data);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('today report err', err?.response?.data);
      });
  };

  const fetchDailyComplianceReport = (id, date) => {
    setLoading(true);

    console.log(date);

    getComplianceReport(id, dayjs(date).format('YYYY-MM-DD'))
      .then(res => {
        setLoading(false);
        const {data, success, errors} = res.data;

        if (success) {
          setData(data);
        } else if (errors) {
          const {id} = errors;

          if (id) {
            Alert.alert('Error', id);
            setData({});
            return;
          }
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('today report err', err?.response?.data);
      });
  };

  return {
    loading,
    data,
    reports,
    fetchTodayCumulativeReport,
    fetchCumulativeReport,
    fetchTodayReport,
    fetchMtdReport,
    fetchTodayReportById,
    fetchDailyComplianceReport,
  };
};

export default useReport;
