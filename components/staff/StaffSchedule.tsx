import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Dimensions, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Staff } from '@/types/Staff';
import { Picker } from '@react-native-picker/picker';
import { mockStaff } from '@/mock/mockStaff';

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('vi-VN');
};

interface StaffScheduleProps {
  staff: Staff[];
}

const SHIFTS = [
  { id: 1, name: 'Ca sáng', startTime: '07:00', endTime: '11:00', color: '#66BB6A' },
  { id: 2, name: 'Ca trưa', startTime: '11:00', endTime: '15:00', color: '#FFA726' },
  { id: 3, name: 'Ca tối', startTime: '15:00', endTime: '22:00', color: '#29B6F6' },
];

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  shift: typeof SHIFTS[0];
  date: Date;
  staff: Staff[];
  assignedStaff: number[];
  onAssign: (staffId: number) => void;
  onRemove: (staffId: number) => void;
}

const { width, height } = Dimensions.get('window');
const baseFontSize = 16;
const responsiveFontSize = baseFontSize * (width / 375);

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onClose,
  shift,
  date,
  staff,
  assignedStaff,
  onAssign,
  onRemove,
}) => {
  const [selectedStaff, setSelectedStaff] = useState<number>(0);
  const availableStaff = staff.filter(s => !assignedStaff.includes(s.id));

  const renderAssignedStaff = ({ item }: { item: number }) => {
    const staffMember = staff.find(s => s.id === item);
    if (!staffMember) return null;
    return (
      <View key={item} style={styles.listItem}>
        <View style={styles.listItemText}>
          <Text style={styles.listItemPrimary}>{staffMember.fullName}</Text>
          <Text style={styles.listItemSecondary}>ID: {staffMember.userId}</Text>
        </View>
        <TouchableOpacity style={styles.removeButtonContainer} onPress={() => onRemove(item)}>
          <Icon name="delete" size={24} color="#E57373" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Sắp xếp lịch làm - {shift.name}</Text>
            <Text style={styles.modalSubtitle}>
              {formatDate(date)} ({shift.startTime} - {shift.endTime})
            </Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.selectStaff}>
              <Text style={styles.selectLabel}>Chọn nhân viên</Text>
              <View style={styles.picker}>
                <Picker
                  selectedValue={selectedStaff}
                  style={styles.select}
                  onValueChange={(itemValue) => setSelectedStaff(Number(itemValue))}
                >
                  <Picker.Item label="-- Chọn nhân viên --" value={0} />
                  {availableStaff.map(s => (
                    <Picker.Item key={s.id} label={s.fullName} value={s.id} />
                  ))}
                </Picker>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (selectedStaff) {
                    onAssign(selectedStaff);
                    setSelectedStaff(0);
                  }
                }}
                disabled={!selectedStaff}
              >
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={assignedStaff}
              renderItem={renderAssignedStaff}
              keyExtractor={item => String(item)}
              ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 10 }}>Không có nhân viên nào được phân công.</Text>}
            />
          </View>
          <TouchableOpacity onPress={onClose} style={styles.modalFooter}>
            <Text style={styles.modalFooterText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const StaffSchedule: React.FC<StaffScheduleProps> = ({ staff = mockStaff }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleDialog, setScheduleDialog] = useState<{
    open: boolean;
    shift: typeof SHIFTS[0];
    date: Date;
  } | null>(null);
  const [schedules, setSchedules] = useState<Record<string, number[]>>({});

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getScheduleKey = (date: Date, shiftId: number) => {
    return `${date.toISOString().split('T')[0]}-${shiftId}`;
  };

  const getAssignedStaff = (date: Date, shiftId: number) => {
    const key = getScheduleKey(date, shiftId);
    return schedules[key] || [];
  };

  const handleAssignStaff = (staffId: number) => {
    if (!scheduleDialog) return;
    const key = getScheduleKey(scheduleDialog.date, scheduleDialog.shift.id);
    setSchedules(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), staffId],
    }));
  };

  const handleRemoveStaff = (staffId: number) => {
    if (!scheduleDialog) return;
    const key = getScheduleKey(scheduleDialog.date, scheduleDialog.shift.id);
    setSchedules(prev => ({
      ...prev,
      [key]: prev[key]?.filter(id => id !== staffId) || [],
    }));
  };

  const renderWeekHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerCell}>Ca làm việc</Text>
      {getWeekDates().map((date) => (
        <View key={date.toISOString()} style={[styles.headerCell, { flexBasis: 130 }]}>
          <Text style={styles.dayName}>
            {date.toLocaleDateString('vi-VN', { weekday: 'long' })}
          </Text>
          <Text style={styles.dayDate}>
            {date.toLocaleDateString('vi-VN')}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderSchedule = ({ item: shift }: { item: typeof SHIFTS[0] }) => {
    return (
      <View key={shift.id} style={styles.row}>
        <View style={styles.shiftCell}>
          <Text style={[styles.shiftName, { color: shift.color }]}>
            {shift.name}
          </Text>
          <Text style={styles.shiftTime}>
            {shift.startTime} - {shift.endTime}
          </Text>
        </View>
        {getWeekDates().map((date) => {
          const assignedStaff = getAssignedStaff(date, shift.id);
          return (
            <TouchableOpacity
              key={date.toISOString()}
              onPress={() => setScheduleDialog({ open: true, shift, date })}
              style={[styles.dayCell, { backgroundColor: assignedStaff.length ? `${shift.color}20` : undefined }]}
            >
              {assignedStaff.length > 0 ? (
                <View style={styles.staffList}>
                  {assignedStaff.map(staffId => {
                    const staffMember = staff.find(s => s.id === staffId);
                    return (
                      <View key={staffId} style={styles.staffAvatarContainer}>
                        <Text style={styles.staffAvatar}>{staffMember?.fullName[0]}</Text>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Icon name="person-add" size={24} color="#78909C" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            <Text>Lịch làm </Text>
            <Text>{formatDate(getWeekDates()[0])} - {formatDate(getWeekDates()[6])}
            </Text>
          </Text>
          <View style={styles.buttonControl}>
            <TouchableOpacity style={styles.navButton} onPress={handlePreviousWeek}>
              <Icon name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleNextWeek}>
              <Icon name="chevron-right" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {renderWeekHeader()}
            <FlatList
              data={SHIFTS}
              renderItem={renderSchedule}
              keyExtractor={item => String(item.id)}
            />
          </View>
        </ScrollView>

        {scheduleDialog && (
          <ScheduleDialog
            open={scheduleDialog.open}
            onClose={() => setScheduleDialog(null)}
            shift={scheduleDialog.shift}
            date={scheduleDialog.date}
            staff={staff}
            assignedStaff={getAssignedStaff(scheduleDialog.date, scheduleDialog.shift.id)}
            onAssign={handleAssignStaff}
            onRemove={handleRemoveStaff}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width < 375 ? width * 0.02 : width * 0.025,
    paddingVertical: width * 0.025,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: responsiveFontSize * 1.2,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  buttonControl: {
    flexDirection: 'row',
    gap: width * 0.02,
  },
  navButton: {
    backgroundColor: '#42A5F5',
    padding: width * 0.02,
    borderRadius: 5,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderBottomWidth: 1,
    borderBottomColor: '#BBD2E9',
  },
  headerCell: {
    flex: 1,
    flexBasis: 130,
    padding: width * 0.03,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: responsiveFontSize,
    color: '#333',
  },
  dayName: {
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: responsiveFontSize * 0.9,
    color: '#666',
  },
  dayDate: {
    fontFamily: 'Poppins-Light',
    color: '#999',
    fontSize: responsiveFontSize * 0.8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  shiftCell: {
    flex: 1,
    padding: width * 0.03,
  },
  shiftName: {
    fontSize: responsiveFontSize * 1.1,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  shiftTime: {
    fontSize: responsiveFontSize * 0.9,
    color: '#777',
    fontFamily: 'Poppins-Light',
  },
  dayCell: {
    flex: 1,
    padding: width * 0.03,
    alignItems: 'center',
  },
  staffList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  staffAvatarContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.035,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffAvatar: {
    fontSize: responsiveFontSize * 0.9,
    fontWeight: 'bold',
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.9,
    maxWidth: 450,
    maxHeight: height * 0.8,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: width * 0.05,
    backgroundColor: '#42A5F5',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: responsiveFontSize * 1.2,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalSubtitle: {
    fontFamily: 'Poppins-Light',
    fontSize: responsiveFontSize,
    color: '#eee',
  },
  modalCloseButton: {
    padding: width * 0.02,
  },
  modalBody: {
    padding: width * 0.05,
    maxHeight: height * 0.6,
    overflow: 'scroll',
  },
  selectStaff: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.025,
    marginBottom: height * 0.02,
  },
  selectLabel: {
    fontFamily: 'Poppins',
    fontSize: responsiveFontSize * 1.1,
    fontWeight: '500',
    color: '#444',
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BBD2E9',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  select: {
    fontFamily: 'Poppins',
    fontSize: responsiveFontSize,
    color: '#555',
  },
  addButton: {
    backgroundColor: '#42A5F5',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  listItemText: {
    flex: 1,
  },
  listItemPrimary: {
    fontSize: responsiveFontSize * 1.1,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
  listItemSecondary: {
    fontSize: responsiveFontSize * 0.9,
    fontFamily: 'Poppins-Medium',
    color: '#777',
  },
  removeButtonContainer: {
    padding: width * 0.02,
  },
  modalFooter: {
    padding: width * 0.05,
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderTopWidth: 1,
    borderTopColor: '#BBD2E9',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  modalFooterText: {
    fontSize: responsiveFontSize * 1.1,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default StaffSchedule;