import {useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import SelectMultiple from 'react-native-select-multiple';
import {StyleSheet, ScrollView, Alert} from 'react-native';

import {
  saveFeedback,
  PredefineFeedbackList,
} from '../../../../services/distributor_visit_service';

import {COLORS} from '../../../../constants/theme/colors';
import {postDistributorCheckOut} from '../../../../store/actions/distributor';

const DistributorFeedBackScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {checkStatus} = route.params;

  const [data, setData] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedFeedback, setSelecedFeedback] = useState([]);

  useEffect(() => {
    getPredefineFeedback();
  }, []);

  const getPredefineFeedback = () => {
    PredefineFeedbackList()
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          let tmp_arr = data.feedbacks.map(feed => {
            return {label: feed.text, value: feed._id};
          });
          setData(tmp_arr);
        } else {
          if (errors.feedbacks) {
            Alert.alert('Denied', errors.feedbacks);
          } else {
            Alert.alert(null, JSON.stringify(errors.feedbacks));
          }
        }
      }) 
      .catch(e => {
        console.log('getPredefineFeedback', e);
      });
  };

  const onHandleSubmit = () => {
    const feedbackData = selectedFeedback.map(item => {
      return item.label;
    });

    if (feedbackText) {
      feedbackData.push(feedbackText);
    }

    if (checkStatus) {
      var feedbacks = {feedbacks: JSON.stringify(feedbackData)};
      const temp = {
        ...route.params.location,
        ...feedbacks,
      };
      dispatch(postDistributorCheckOut(temp, navigation, 'FeedbackScreen'));
    } else {
      saveFeedback({feedbacks: JSON.stringify(feedbackData)})
        .then(res => {
          const {success, errors} = res.data;

          console.log('res.data');
          if (success) {
            navigation.goBack();
            alert('Feedback Saved');
          } else {
            if (errors.feedbacks) {
              Alert.alert('Denied', errors.feedbacks);
            } else {
              Alert.alert(null, JSON.stringify(errors.feedbacks));
            }
          }
        })
        .catch(e => {
          console.log('onHandleSubmit', e);
        });
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'handled'}
      nestedScrollEnabled
      style={styles.container}>
      <SelectMultiple
       labelStyle={{color:'black'}}
        items={data}
        selectedItems={selectedFeedback}
        nestedScrollEnabled
        onSelectionsChange={setSelecedFeedback}
      />
      <TextInput
        style={styles.input}
        numberOfLines={3}
        value={feedbackText}
        label="Feedback"
        mode="outlined"
        onChangeText={setFeedbackText}
      />
      <Button style={styles.btnStyle} onPress={onHandleSubmit} mode="contained">
        Submit
      </Button>
    </ScrollView>
  );
};

export default DistributorFeedBackScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  btnStyle: {
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.light,
  },
});
