import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {useFormik} from 'formik';
import {useState} from 'react';
import {Alert, Keyboard} from 'react-native';
import {
  addPromoterClosingStock,
  addPromoterSales,
  getAllProducts,
} from '../services/order_service';

const usePromoterVisit = (number, date, stockDate) => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const navigation = useNavigation();

  const salesValues = {
    order_number: number,
    order_date: new Date(date),
    products: [],
  };

  const salesFormik = useFormik({
    initialValues: salesValues,
    validateOnChange: false,
    onSubmit: async values => {
      Keyboard.dismiss();

      try {
        const res = await addPromoterSales({
          ...values,
          products: JSON.stringify(values.products),
          order_date: dayjs(values.order_date).format('YYYY-MM-DD'),
        });

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'New sales data has been added');
          navigation.pop(2);
        } else {
          const {add_order, products} = errors;

          if (add_order) {
            Alert.alert('Error', add_order);
            return;
          }

          if (products) {
            Alert.alert('Error', products);
            return;
          }

          Alert.alert('Error', JSON.stringify(errors));
        }
      } catch (err) {
        Alert.alert(JSON.stringify(err));
      }
    },
  });

  const stockValues = {
    purchase_invoice: number,
    purchase_invoice_date: new Date(date),
    opening_stock_date: new Date(stockDate),
    products: [],
  };

  const stockFormik = useFormik({
    initialValues: stockValues,
    validateOnChange: false,
    onSubmit: async values => {
      Keyboard.dismiss();

      try {
        const res = await addPromoterClosingStock({
          ...values,
          purchase_invoice_date: dayjs(values.purchase_invoice_date).format(
            'YYYY-MM-DD',
          ),
          opening_stock_date: dayjs(values.opening_stock_date).format(
            'YYYY-MM-DD',
          ),
          products: JSON.stringify(values.products),
        });

        const {success, errors} = res.data;

        if (success) {
          Alert.alert('Success', 'Closing stock has been added.');
          navigation.pop(2);
        } else {
          const {products, add_order} = errors;

          if (add_order) {
            Alert.alert('Error', add_order);
            return;
          }

          if (products) {
            Alert.alert('Error', products);
            return;
          }
        }
      } catch (err) {
        Alert.alert('Err', JSON.stringify(err));
      }
    },
  });

  const fetchAllProducts = (page, term) => {
    salesFormik.setSubmitting(true);

    getAllProducts(page, term)
      .then(res => {
        salesFormik.setSubmitting(false);

        const {data, success} = res.data;

        if (success) {
          setHasMore(data.has_more);
          if (page === 1) {
            setProducts(data.products);
          } else {
            setProducts(products.concat(data.products));
          }
        }
      })
      .catch(err => {
        console.log('promoter fetch err', err?.response?.data);
      });
  };

  return {salesFormik, stockFormik, products, hasMore, fetchAllProducts};
};

export default usePromoterVisit;
