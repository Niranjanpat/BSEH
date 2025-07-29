import {FlatList, View, StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Text, Searchbar} from 'react-native-paper';
import {useBeatInformation} from '../../../../hooks/supplier/useBeatInfomation';
import BeatInfoListItem from '../../../../components/settings/supplier/BeatInfoListItem';
import {ROUTES} from '../../../../constants/routes';
import {SPACINGS} from '../../../../constants/theme';
import BeatFrequencyFilter from '../../../../components/settings/supplier/BeatFrequencyFilter';
import BeatAssigneeFilter from '../../../../components/settings/supplier/BeatAssigneeFilter';

const BeatInfoListScreen = ({route, navigation}) => {
 
  const {beats, isLoading, fetchBeats,changeQuery} = useBeatInformation(route.params?.id);

  const selectedFrequency = useRef('');
  const selectedAssignee = useRef('');

  useEffect(() => {
    fetchBeats();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BeatFrequencyFilter
          onFilterChange={v => {
            selectedFrequency.current = v;
            fetchBeats(selectedAssignee.current, v);
          }}
        />
      ),
    });
  }, [navigation]);


  const handleChange = e => {
    changeQuery(e);
  };

  return (
    <>
      <Searchbar
        style={styles.searchbar}
        onChangeText={handleChange}
        placeholder="Search retailer by name"
      />

      <BeatAssigneeFilter
        onAssigneeChange={v => {
          selectedAssignee.current = v;
          fetchBeats(v, selectedFrequency.current);
        }}
      />
      <View style={styles.container}>
         <FlatList
        refreshing={isLoading}
        onRefresh={() =>
          fetchBeats(selectedAssignee.current, selectedFrequency.current)
        }
        data={beats}
        renderItem={({item}) => (
          <BeatInfoListItem
            beat={item}
            onItemPressed={() =>
              navigation.navigate(ROUTES.beat_info_screen, {
                beatId: item._id,
                name: item.name,
              })
            }
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={{padding: 10}}
        ListEmptyComponent={
          <Text variant="bodyMedium" style={{alignSelf: 'center'}}>
            No Beat
          </Text>
        }
      />
      </View>
    </>
  );
};

export default BeatInfoListScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 10,
  },
  searchbar: {
    margin: SPACINGS.sm,
    marginBottom: 10,
    elevation: 0,
  },
});
