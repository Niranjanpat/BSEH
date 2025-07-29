import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Alert, FlatList, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Button, Caption, List, Subheading, Text} from 'react-native-paper';
import {orderStyles} from '../styles/SupplierOrderStyle';
import VerticalSpacer from '../../../../components/VerticalSpacer';
import {clearCartItems} from '../../../../store/actions/cart';
import {saveSDIOrder} from '../../../../services/order_service';

const CheckOutSDIOrderScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [orderLoading, setOrderLoading] = useState(false);

  const cartItems = useSelector(state => state.cart);
  const sdiForOrder = useSelector(state => state.order.sdiForOrder);

  const total = cartItems.reduce(
    (price, item) =>
      price +
      parseInt(item.quantity) * parseFloat(item.distributorsellingprice),
    0.0,
  );

  const submitOrder = () => {
    if (cartItems.length > 0) {
      setOrderLoading(true);
      saveSDIOrder(sdiForOrder?._id ?? '', cartItems)
        .then(res => {
          const {success, errors, data} = res.data;

          console.log('submitSDIOrder', res.data);
          if (success) {
            dispatch(clearCartItems());
            Alert.alert('Success', 'Your order has been successfully saved.', [
              {
                text: 'Okay',
                onPress: () => navigation.popToTop(),
              },
            ]);
          } else if (errors) {
            Alert.alert('Failed!', Object.values(errors).join(', '));
          }
        })
        .catch(error => {
          console.log('submitOrder', error);
        })
        .finally(_ => {
          setOrderLoading(false);
        });
    }
  };

  //   const submitAndMail = () => {
  //     if (cartItems.length > 0) {
  //       setOrderAndMailLoading(true);

  //       saveOrder(cartItems, hideCheckoutAfterOrder ? customerForOnCall : customer, hideCheckoutAfterOrder)
  //         .then(res => {
  //           const {success, errors, data} = res.data;

  //           console.log('submitAndMail', res.data);
  //           if (success) {
  //             dispatch(clearCartItems());

  //             sendMail(data)
  //               .then(res => {
  //                 const {data, errors, success} = res.data;
  //                 if (success) {
  //                   Alert.alert(
  //                     'Success',
  //                     'Your order has been successfully saved.',
  //                     [
  //                       !hideCheckoutAfterOrder && {
  //                         text: 'Check out',
  //                         onPress: () => {
  //                           checkOut();
  //                           navigation.popToTop();
  //                         },
  //                       },
  //                       {
  //                         text: 'Okay',
  //                         onPress: () => navigation.popToTop(),
  //                       },
  //                     ],
  //                   );
  //                 } else {
  //                   console.log(errors);

  //                   if (errors.add_order) {
  //                   }
  //                 }
  //               })
  //               .catch(error => {
  //                 console.log(error);
  //               })
  //               .finally(_ => {
  //                 setOrderAndMailLoading(false);
  //               });
  //           } else {
  //             if (errors.add_order) {
  //               return Alert.alert('Failed', errors.add_order);
  //             }
  //             Alert.alert('Failed', errors.toString());
  //           }
  //         })
  //         .catch(error => {
  //           console.log('submitOrder', error);
  //         })
  //         .finally(_ => {
  //           setOrderLoading(false);
  //         });
  //     }
  //   };

  return (
    <>
      <View style={orderStyles.heading}>
        <View style={orderStyles.customer}>
          <Subheading style={orderStyles.subheading}>Shop</Subheading>
          <Text>{sdiForOrder?.name}</Text>
        </View>
        <VerticalSpacer size={20} />
        <Header />
        <VerticalSpacer />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item, _) => item._id}
        contentContainerStyle={orderStyles.contentContainerStyle}
        renderItem={({item}) => {
          return (
            <List.Item
              style={orderStyles.list}
              titleStyle={{fontWeight: 'bold'}}
              titleNumberOfLines={10}
              title={item.name}
              descriptionStyle={{flex: 1}}
              description={_ => (
                <>
                  <Caption>{item.unit ? item.unit : 'N/A'}</Caption>
                  <Text>AVI: {item.stock ? item.stock : 'N/A'}</Text>
                  {item.distributorsellingprice && (
                    <Text>Per unit: {item.distributorsellingprice}</Text>
                  )}
                </>
              )}
              right={_ => (
                <View style={orderStyles.itemsCount}>
                  <Text>{item.quantity}</Text>
                </View>
              )}
            />
          );
        }}
      />
      <View style={orderStyles.grandTotalContainer}>
        <Text>Total order value: </Text>
        <Subheading>{total.toFixed(2)}</Subheading>
      </View>
      <View style={orderStyles.buttonRow}>
        {/* <Button
          onPress={submitAndMail}
          loading={orderAndMailLoading}
          disabled={orderAndMailLoading}
          mode="contained">
          Save & Send Mail
        </Button> */}
        <Button
          onPress={submitOrder}
          loading={orderLoading}
          disabled={orderLoading}
          mode="contained">
          Save Order
        </Button>
      </View>
    </>
  );
};

export default CheckOutSDIOrderScreen;

const Header = () => {
  return <Text style={orderStyles.header}>Added Products</Text>;
};
