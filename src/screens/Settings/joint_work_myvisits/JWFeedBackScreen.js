import React from 'react';
import {Button, Caption, TextInput} from 'react-native-paper';
import {Alert, Keyboard, ScrollView, StyleSheet} from 'react-native';

import VerticalSpacer from '../../../components/VerticalSpacer';

import {SPACINGS} from '../../../constants/theme';
import {COLORS} from '../../../constants/theme/colors';
import {customerCheckOut, postFeedback} from '../../../services/joint_service';
import {ROUTES} from '../../../constants/routes';

const JWFeedbackScreen = ({route, navigation}) => {
  const {node, body} = route.params;
  const [feedback, setFeedback] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const submitFeedback = async () => {
    Keyboard.dismiss();

    if (!feedback) {
      return Alert.alert('Denied', 'Your feedback is empty!');
    }

    if (node && node === 'check_out') {
      return postCustomerCheckOut();
    }

    setLoading(true);
    try {
      const res = await postFeedback({feedback});
      const {success, errors} = res.data;

      if (success) {
        Alert.alert(
          'Success',
          'Feedback successfully submitted! You can check-in now.',
        );

        navigation.goBack();
      } else {
        if (errors?.save_feedback) {
          return Alert.alert('Error', errors.save_feedback);
        }

        if (errors?.feedback) {
          return Alert.alert('Error', errors.feedback);
        }

        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('save feedback', error);
      console.log('save feedback', error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const postCustomerCheckOut = () => {
    setLoading(true);

    const data = {
      ...body,
      feedback,
    };
    customerCheckOut(data)
      .then(res => {
        const {errors, success} = res.data;

        if (success) {
          setLoading(false);
          alert('Checked out & feedback submitted!');
          navigation.navigate('Home');
        } else {
          if (errors.feedback) {
            return alert(errors.feedback);
          }

          Alert.alert('Errors', JSON.stringify(errors));
        }
      })
      .catch(e => {
        console.log('postCustomerCheckOut exp::', e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.contentContainerStyle}>
      <Caption>Your Feedback</Caption>
      <VerticalSpacer size={10} />
      <TextInput
        multiline
        autoFocus
        autoCorrect={false}
        value={feedback}
        style={styles.input_feedback}
        placeholder="Type out your custom feedback"
        onChangeText={setFeedback}
        selectionColor={COLORS.lightGrey}
        autoCapitalize="sentences"
      />
      <VerticalSpacer size={25} />
      <Button loading={loading} onPress={submitFeedback} mode="contained">
        Submit
      </Button>
    </ScrollView>
  );
};

export default JWFeedbackScreen;

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: SPACINGS.xs,
    paddingTop: SPACINGS.lg,
  },

  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input_feedback: {
    minHeight: 100,
    maxHeight: 140,
    borderRadius: 0,
  },
});
