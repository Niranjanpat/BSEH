import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import React, {useEffect} from 'react';
import useReport from '../../hooks/useReport';
import {COLORS} from '../../constants/theme/colors';
import MtdList from '../../components/settings/MtdList';

const KamMtdReportScreen = () => {
  const {reports, loading, fetchMtdReport} = useReport();

  useEffect(() => {
    fetchMtdReport();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={reports}
        refreshing={loading}
        onRefresh={fetchMtdReport}
        renderItem={({item}) => <MtdList item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.light,
    flex: 1,
  },
});

export default KamMtdReportScreen;
