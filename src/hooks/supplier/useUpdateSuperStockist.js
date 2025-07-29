import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import {Alert} from 'react-native';
import {updateSuperStockist} from '../../services/supplier_service';
import { ROUTES } from '../../constants/routes';

const useUpdateSuperStockist = (data, _id) => {
  const initialValues = {
    ...data,
  };

  const {navigate} = useNavigation();

  const formik = useFormik({
    initialValues,
    onSubmit: (values, {setSubmitting, setErrors}) => {
      setSubmitting(true);

   //   console.log(values);

      updateSuperStockist(_id, values)
        .then(res => {
          setSubmitting(false);

          const {success, errors} = res?.data;

          if (success) {
            Alert.alert('Success', 'Super Stockist detail updated');
            navigate({
              name: ROUTES.super_stockist_detail,
              params: {
                refresh: true,
              },
              merge: true,
            });
          } else {
            setErrors(errors);
          }
        })
        .catch(err => {
          setSubmitting(false);

          console.log('update super stockist err', err);
        });
    },
  });

  return formik;
};

export default useUpdateSuperStockist;
