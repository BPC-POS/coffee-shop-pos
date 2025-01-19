import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Staff, WorkSchedule, ScheduleStatus, Shift } from '@/types/Staff';
import { formatDate } from '@/utils/format';
import { Picker } from '@react-native-picker/picker';
import { mockStaff } from '@/mock/mockStaff';

interface StaffScheduleProps {
  staff: Staff[];
}

const SHIFTS = [
  { id: 1, name: 'Ca sáng', startTime: '07:00', endTime: '11:00', color: '#4caf50' },
  { id: 2, name: 'Ca trưa', startTime: '11:00', endTime: '15:00', color: '#ff9800' },
  { id: 3, name: 'Ca tối', startTime: '15:00', endTime: '22:00', color: '#2196f3' },
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
      if (!staffMember) {
        return null;
    }
    return (
      <View key={item} style={styles.listItem}>
          <View style={styles.listItemText}>
                <Text style={styles.listItemPrimary}>{staffMember.fullName}</Text>
                <Text style={styles.listItemSecondary}>ID: {staffMember.userId}</Text>
           </View>
          <TouchableOpacity style={styles.removeButtonContainer} onPress={() => onRemove(item)}>
             <Icon name="delete" size={24} color="red" />
          </TouchableOpacity>
      </View>
    )
  }

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
                            <TouchableOpacity style={styles.addButton}  onPress={() => {
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
                     />
               </View>
                  <TouchableOpacity onPress={onClose} style={styles.modalFooter}  >
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
                 <View key={date.toISOString()} style={[styles.headerCell,{ minWidth: 130 }]}>
                      <Text style={styles.dayName}>
                          {date.toLocaleDateString('vi-VN', { weekday: 'long' })}
                      </Text>
                      <Text style={styles.dayDate}>
                          {date.toLocaleDateString('vi-VN')}
                      </Text>
                 </View>
               ))}
         </View>
  )

   const renderSchedule = ({item: shift} : { item: typeof SHIFTS[0] })=> {
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
                          style={[styles.dayCell, {backgroundColor: assignedStaff.length ? `${shift.color}10` : undefined}]}
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
                         <Icon name="add" size={24} color="#333"/>
                     )}
                </TouchableOpacity>
             );
        })}
     </View>
        )

   }


  return (
    <View style={styles.container}>
         <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Lịch làm việc tuần {formatDate(getWeekDates()[0])} - {formatDate(getWeekDates()[6])}
        </Text>
        <View style={styles.buttonControl}>
          <TouchableOpacity onPress={handlePreviousWeek}>
                <Icon name="chevron-left" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextWeek}>
                 <Icon name="chevron-right" size={24} color="#333"/>
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
  );
};


const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
         marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
         fontFamily: 'Poppins-SemiBold',
    },
    buttonControl: {
         flexDirection: 'row',
      gap: 10
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
          overflow: 'hidden',
          shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,

    },
       header: {
      flexDirection: 'row',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
         borderBottomWidth: 1,
         borderBottomColor: '#ccc'
      },
      headerCell: {
         flex: 1,
         padding: 10,
         fontFamily: 'Poppins-SemiBold',
         textAlign: 'center',
          fontSize: 14
      },
     dayName: {
        fontFamily: 'Poppins-Medium',
         textAlign: 'center',
        fontSize: 14
    },
     dayDate: {
         fontFamily: 'Poppins-Light',
         color: 'gray',
           fontSize: 12,
         textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
         borderBottomWidth: 1,
           borderBottomColor: 'rgba(0, 123, 255, 0.1)',
    },
    shiftCell: {
         flex: 1,
        padding: 10,
    },
      shiftName: {
        fontSize: 16,
         fontFamily: 'Poppins-SemiBold',
    },
    shiftTime: {
        fontSize: 12,
        color: 'gray',
         fontFamily: 'Poppins-Light',
    },
     dayCell: {
         flex: 1,
         padding: 10,
        alignItems: 'center'
     },
       staffList: {
         flexDirection: 'row',
           flexWrap: 'wrap',
         justifyContent: 'center',
           gap: 2,
     },
     staffAvatarContainer: {
         backgroundColor: 'rgba(0,0,0,0.1)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
     },
      staffAvatar: {
         fontSize: 12,
        fontWeight: 'bold',
     },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
    },
    modalContent: {
      backgroundColor: '#fff',
        borderRadius: 10,
      width: '90%',
    },
     modalHeader: {
        padding: 15,
        backgroundColor: '#007bff',
      borderRadius: 10,
         borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalTitle: {
         fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
      color: '#fff'
   },
    modalSubtitle: {
        fontFamily: 'Poppins-Light',
        fontSize: 12,
        color: '#eee'
    },
      modalCloseButton: {
          padding: 5
    },
      modalBody: {
          padding: 15
      },
    selectStaff: {
         flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
         marginBottom: 10
    },
     selectLabel: {
         fontFamily: 'Poppins',
         fontSize: 16,
    },
     picker: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
   },
    select: {
         fontFamily: 'Poppins',
       fontSize: 14
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5
    },
     addButtonText: {
      color: '#fff',
        fontFamily: 'Poppins-SemiBold',
    },
    listItem: {
         flexDirection: 'row',
        alignItems: 'center',
         justifyContent: 'space-between',
          padding: 10,
        borderBottomWidth: 1,
         borderBottomColor: 'rgba(0, 123, 255, 0.1)',
    },
      listItemText: {
         flex: 1,
      },
       listItemPrimary: {
        fontFamily: 'Poppins-Medium'
      },
       listItemSecondary: {
         fontFamily: 'Poppins-Light',
         color: 'gray'
       },
   removeButtonContainer: {
         padding: 5,
     },
    modalFooter: {
        padding: 15,
        alignItems: 'center',
       backgroundColor: 'rgba(0, 123, 255, 0.1)',
       borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    modalFooterText: {
      fontSize: 16,
      fontWeight: 'bold'
        ,  fontFamily: 'Poppins-SemiBold',
    }
});

export default StaffSchedule;