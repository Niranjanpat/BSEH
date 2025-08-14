import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {Card, Text, IconButton} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';

const HEADER_HEIGHT = 48;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ViewLeaveScreen = () => {
  const [leaves, setLeaves] = useState([
    {
      title: 'Project Alpha',
      reason: 'Requirement Gathering',
      sDate: '2025-01-05',
      eDate: '2025-01-10',
      status: 'Completed',
    },
    {
      title: 'System Upgrade',
      reason: 'Server Maintenance',
      sDate: '2025-02-01',
      eDate: '2025-02-05',
      status: 'In Progress',
    },
    {
      title: 'Website Revamp',
      reason: 'UI/UX Improvements with additional features and long reason to test wrapping',
      sDate: '2025-03-10',
      eDate: '2025-03-20',
      status: 'Pending',
    },
    {
      title: 'Training Session',
      reason: 'Skill Development',
      sDate: '2025-04-15',
      eDate: '2025-04-16',
      status: 'Completed',
    },
    {
      title: 'Audit Review',
      reason: 'Annual Compliance',
      sDate: '2025-05-01',
      eDate: '2025-05-03',
      status: 'In Progress',
    },
    {
      title: 'Marketing Campaign',
      reason: 'Product Launch',
      sDate: '2025-05-15',
      eDate: '2025-05-30',
      status: 'Pending',
    },
     {
      title: 'Project Alpha',
      reason: 'Requirement Gathering',
      sDate: '2025-01-05',
      eDate: '2025-01-10',
      status: 'Completed',
    },
    {
      title: 'System Upgrade',
      reason: 'Server Maintenance',
      sDate: '2025-02-01',
      eDate: '2025-02-05',
      status: 'In Progress',
    },
    {
      title: 'Website Revamp',
      reason: 'UI/UX Improvements with additional features and long reason to test wrapping',
      sDate: '2025-03-10',
      eDate: '2025-03-20',
      status: 'Pending',
    },
    {
      title: 'Training Session',
      reason: 'Skill Development',
      sDate: '2025-04-15',
      eDate: '2025-04-16',
      status: 'Completed',
    },
    {
      title: 'Audit Review',
      reason: 'Annual Compliance',
      sDate: '2025-05-01',
      eDate: '2025-05-03',
      status: 'In Progress',
    },
    {
      title: 'Marketing Campaign',
      reason: 'Product Launch',
      sDate: '2025-05-15',
      eDate: '2025-05-30',
      status: 'Pending',
    },
     {
      title: 'Project Alpha',
      reason: 'Requirement Gathering',
      sDate: '2025-01-05',
      eDate: '2025-01-10',
      status: 'Completed',
    },
    {
      title: 'System Upgrade',
      reason: 'Server Maintenance',
      sDate: '2025-02-01',
      eDate: '2025-02-05',
      status: 'In Progress',
    },
    {
      title: 'Website Revamp',
      reason: 'UI/UX Improvements with additional features and long reason to test wrapping',
      sDate: '2025-03-10',
      eDate: '2025-03-20',
      status: 'Pending',
    },
    {
      title: 'Training Session',
      reason: 'Skill Development',
      sDate: '2025-04-15',
      eDate: '2025-04-16',
      status: 'Completed',
    },
    {
      title: 'Audit Review',
      reason: 'Annual Compliance',
      sDate: '2025-05-01',
      eDate: '2025-05-03',
      status: 'In Progress',
    },
    {
      title: 'Marketing Campaign',
      reason: 'Product Launch',
      sDate: '2025-05-15',
      eDate: '2025-05-30',
      status: 'Pending',
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const rowsMaxHeight = SCREEN_HEIGHT - HEADER_HEIGHT - 150;

  const getStatusStyle = status => {
    switch (status) {
      case 'Completed':
        return {backgroundColor: '#d4edda', color: '#155724'};
      case 'In Progress':
        return {backgroundColor: '#fff3cd', color: '#856404'};
      case 'Pending':
        return {backgroundColor: '#f8d7da', color: '#721c24'};
      default:
        return {backgroundColor: '#e2e3e5', color: '#383d41'};
    }
  };

  // Filter logic
  const displayData = selectedFilter
    ? leaves.filter(item =>
        selectedFilter === 'All'
          ? true
          : item.status.toLowerCase() === selectedFilter.toLowerCase(),
      )
    : leaves;

  const filterOptions = ['All', 'Completed', 'In Progress', 'Pending'];

  return (
    <View style={styles.container}>
      {/* Filter Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={filterVisible}
        onRequestClose={() => setFilterVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setFilterVisible(false)}>
          <View style={styles.modalContent}>
            {filterOptions.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setSelectedFilter(option === 'All' ? null : option);
                  setFilterVisible(false);
                }}>
                <Text style={styles.filterOption}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Table */}
      <Card style={styles.card}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table Header */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.headerCell, {width: 60}]}>SR.No</Text>
              <Text style={[styles.headerCell, {width: 180}]}>TITLE</Text>
              <Text style={[styles.headerCell, {width: 250}]}>REASON</Text>
              <Text style={[styles.headerCell, {width: 120}]}>START DATE</Text>
              <Text style={[styles.headerCell, {width: 120}]}>END DATE</Text>
              <View style={styles.statusHeader}>
                <Text style={styles.headerCell}>STATUS</Text>
                <IconButton
                  icon="filter"
                  size={20}
                  iconColor="white"
                  onPress={() => setFilterVisible(true)}
                />
              </View>
            </View>

            {/* Table Body */}
            <ScrollView 
              nestedScrollEnabled 
              style={{maxHeight: rowsMaxHeight}}
              showsVerticalScrollIndicator={true}
            >
              {loading ? (
                <ActivityIndicator style={{marginVertical: 20}} />
              ) : displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <View
                    key={`${item.title}-${index}`}
                    style={[
                      styles.row,
                      {
                        backgroundColor:
                          index % 2 === 0 ? '#fdfdfd' : '#f7f9fc',
                      },
                    ]}>
                    <Text style={[styles.cell, {width: 60}]}>{index + 1}</Text>
                    <Text style={[styles.cell, {width: 180}]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.cell, {width: 250}]}>
                      {item.reason}
                    </Text>
                    <Text style={[styles.cell, {width: 120}]}>
                      {item.sDate}
                    </Text>
                    <Text style={[styles.cell, {width: 120}]}>
                      {item.eDate}
                    </Text>
                    <Text
                      style={[
                        styles.cell,
                        styles.statusPill,
                        {
                          width: 120,
                          backgroundColor: getStatusStyle(item.status)
                            .backgroundColor,
                          color: getStatusStyle(item.status).color,
                        },
                      ]}>
                      {item.status}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{textAlign: 'center', paddingVertical: 20}}>
                  No leave records found
                </Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.background,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: COLORS.primary || '#3498db',
    height: HEADER_HEIGHT,
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    fontSize: 13,
    flexWrap: 'wrap',
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusHeader: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusPill: {
    borderRadius: 12,
    textAlign: 'center',
    paddingVertical: 3,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 4,
    width: 200,
    alignSelf: 'flex-end',
  },
  filterOption: {
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export default ViewLeaveScreen;