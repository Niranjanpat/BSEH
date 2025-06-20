
import React, {useEffect, useLayoutEffect, useState,memo} from 'react';
import {View, StyleSheet, FlatList, ScrollView} from 'react-native';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  RadioButton,
  Title,
} from 'react-native-paper';
import {getBeatList} from '../services/retailer_services';
import {useNavigation} from '@react-navigation/native';


const BeatModal = ({isMyVisits, value, setValue}) => {
  const [visible, setVisible] = useState(false);
  const [beat, setBeat] = useState([]);

  const [loading, setLoading] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="filter-variant"
          onPress={() => {
            setVisible(true);
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    getBeat();
  }, []);

  const getBeat = () => {
    setLoading(true);
    getBeatList(isMyVisits)
      .then(res => {
        const {data, success, errors} = res.data;
        if (success) {
          setBeat(data.routes);
        }
      })
      .catch(e => {
        alert(e);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        style={styles.container}
        onDismiss={() => setVisible(false)}>
        <Title>Select Beat</Title>

        <RadioButton.Group onValueChange={setValue} value={value}>
          <RadioButton.Item label="All Beat" value="" />
          <ScrollView
            style={{height: 300}}
            showsVerticalScrollIndicator={false}>
            <FlatList
              scrollEnabled={false}
              data={beat}
              keyExtractor={(item, _) => item._id}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={false}
              renderItem={({item}) => {
                return <RadioButton.Item label={item.name} value={item._id} />;
              }}
            />
          </ScrollView>
        </RadioButton.Group>
        <Button
          mode="contained"
          style={{margin: 10}}
          onPress={() => setVisible(false)}>

          Done
        </Button>
      </Modal>
    </Portal>
  );
};

export default memo(BeatModal);

const styles = StyleSheet.create({

  container: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    height: '60%',
    marginTop: '40%',

  },
});
