import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Dimensions, SafeAreaView, ActivityIndicator, Platform // Added ActivityIndicator and Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Staff, Shift } from '@/types/Staff'; // Adjust path if needed
import { Picker } from '@react-native-picker/picker';
import { getShifts, createShift, deleteShift } from '@/api/shift'; // Adjust path if needed

// --- Helper Functions ---
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
  return date.toLocaleDateString('vi-VN', options);
};

// Consistent date string format for comparison (YYYY-MM-DD)
const getDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
}

// --- Constants ---
const SHIFT_TYPES = [
  { id: 1, name: 'Ca sáng', startTime: '07:00', endTime: '11:00', color: '#4caf50' }, // Matched Next.js example
  { id: 2, name: 'Ca trưa', startTime: '11:00', endTime: '15:00', color: '#ff9800' }, // Matched Next.js example
  { id: 3, name: 'Ca tối', startTime: '15:00', endTime: '22:00', color: '#2196f3' }, // Matched Next.js example
];

const { width, height } = Dimensions.get('window');
const baseFontSize = Platform.OS === 'ios' ? 15 : 14; // Adjust base font size per platform
const responsiveFontSize = (size: number) => size * (width / 375); // Helper for responsive font size

// --- Schedule Dialog Component ---
interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  shift: typeof SHIFT_TYPES[0]; // The specific shift type being edited
  date: Date;
  staff: Staff[]; // Full list of staff
  assignedStaffIds: number[]; // IDs of staff ALREADY assigned to this specific shift/date
  onAssign: (staffId: number) => Promise<void>; // Make async to handle loading state
  onRemove: (staffId: number) => Promise<void>; // Make async to handle loading state
  isSubmitting: boolean; // Indicate if an add/remove operation is in progress
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onClose,
  shift,
  date,
  staff,
  assignedStaffIds,
  onAssign,
  onRemove,
  isSubmitting, // Receive submitting state
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number>(0); // Store the ID

  // Filter staff who have an ID and are NOT already assigned to this specific shift/date
  const availableStaff = staff.filter(s => typeof s.id === 'number' && !assignedStaffIds.includes(s.id));

  // Find the full staff objects for the assigned IDs
  const assignedStaffObjects = staff.filter(s => typeof s.id === 'number' && assignedStaffIds.includes(s.id));

  const handleAssign = async () => {
    if (selectedStaffId) {
      await onAssign(selectedStaffId); // Wait for the async operation
      setSelectedStaffId(0); // Reset picker only after successful assignment (handled by parent)
    }
  };

  const handleRemove = async (staffId: number) => {
    await onRemove(staffId); // Wait for the async operation
  };

  const renderAssignedStaffItem = ({ item }: { item: Staff }) => {
    return (
      <View key={item.id} style={styles.listItem}>
        <View style={styles.listItemTextContainer}>
          <Text style={styles.listItemPrimary}>{item.name}</Text>
          {/* Displaying userId might be less relevant than employee ID */}
          <Text style={styles.listItemSecondary}>ID: {item.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButtonContainer}
          onPress={() => handleRemove(item.id!)} // Use the correct ID
          disabled={isSubmitting} // Disable during operation
        >
          {isSubmitting ? <ActivityIndicator size="small" color="#E57373" /> : <Icon name="delete" size={responsiveFontSize(22)} color="#E57373" />}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={open}
      animationType="fade" // Fade is often smoother than slide
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent // Allows content behind status bar if needed
    >
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.modalHeader}>
             <View>
                 <Text style={styles.modalTitle}>Sắp xếp lịch làm - {shift.name}</Text>
                 <Text style={styles.modalSubtitle}>
                   {formatDate(date)} ({shift.startTime} - {shift.endTime})
                 </Text>
             </View>
             {/* Explicit Close Button */}
             <TouchableOpacity style={styles.modalCloseButton} onPress={onClose} disabled={isSubmitting}>
               <Icon name="close" size={responsiveFontSize(24)} color="#fff" />
             </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.modalBody}>
            {/* Staff Selection */}
            <View style={styles.selectStaffContainer}>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedStaffId}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedStaffId(Number(itemValue))}
                  enabled={!isSubmitting} // Disable during operation
                  dropdownIconColor="#555" // Style the dropdown icon
                >
                  <Picker.Item label="-- Chọn nhân viên --" value={0} style={styles.pickerItem}/>
                  {availableStaff.map(s => (
                    <Picker.Item key={s.id} label={s.name} value={s.id} style={styles.pickerItem} />
                  ))}
                </Picker>
                {/* Android requires a View wrapper for border */}
                {Platform.OS === 'android' && <View style={styles.pickerBorderAndroid} />}
              </View>
              <TouchableOpacity
                style={[styles.addButton, (!selectedStaffId || isSubmitting) && styles.buttonDisabled]} // Style disabled state
                onPress={handleAssign}
                disabled={!selectedStaffId || isSubmitting}
              >
                {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.addButtonText}>Thêm</Text>}
              </TouchableOpacity>
            </View>

            {/* Assigned Staff List */}
            <Text style={styles.assignedListTitle}>Nhân viên đã phân công:</Text>
            <FlatList
              data={assignedStaffObjects}
              renderItem={renderAssignedStaffItem}
              keyExtractor={item => String(item.id)}
              ListEmptyComponent={<Text style={styles.emptyListText}>Chưa có nhân viên nào.</Text>}
              style={styles.assignedStaffList} // Added style for potential max height
            />
          </View>

          {/* Footer (Optional - Close button moved to header) */}
          {/* <TouchableOpacity onPress={onClose} style={styles.modalFooter} disabled={isSubmitting}>
            <Text style={styles.modalFooterText}>Đóng</Text>
          </TouchableOpacity> */}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};


// --- Main Schedule Component ---
interface StaffScheduleProps {
  staff: Staff[]; // Receive staff list via props
  // Removed onStaffUpdate prop - handled internally by refetching shifts
}

const StaffSchedule: React.FC<StaffScheduleProps> = ({ staff }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleDialog, setScheduleDialog] = useState<{
    open: boolean;
    shift: typeof SHIFT_TYPES[0]; // The type of shift being edited
    date: Date; // The date being edited
  } | null>(null);
  const [shiftsData, setShiftsData] = useState<Shift[]>([]); // State for fetched shifts
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial fetch
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for create/delete actions in dialog
  const [error, setError] = useState<string | null>(null); // Error state

  // --- Data Fetching ---
  const fetchShiftsData = async () => {
    // Don't set loading true here if it's just a refresh
    setError(null);
    try {
      const response = await getShifts();
      if (response && response.data) { // Basic check for valid response
          setShiftsData(response.data);
      } else {
          console.error("Invalid response structure from getShifts:", response);
          setError("Không thể tải dữ liệu lịch (phản hồi không hợp lệ).");
          setShiftsData([]); // Clear data on invalid response
      }
    } catch (err: any) {
      console.error("Error fetching shifts:", err);
      setError(`Không thể tải dữ liệu lịch: ${err.message || 'Lỗi không xác định'}`);
      setShiftsData([]); // Clear data on error
    } finally {
       // Only set initial loading false
       if (isLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true); // Set loading true only on initial mount fetch
    fetchShiftsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch only on mount

  // --- Week Navigation ---
  const getWeekDates = (): Date[] => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentDate);
    // Adjust to make Monday the start of the week (getDay() returns 0 for Sun, 1 for Mon)
    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when current day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(); // Calculate once per render

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    // Optionally refetch shifts for the new week if data is large and segmented by week
    // fetchShiftsData();
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    // fetchShiftsData();
  };

  // --- Shift Assignment Logic ---
  const getAssignedStaffIdsForShift = (targetDate: Date, componentShiftId: number): number[] => {
    const targetDateString = getDateString(targetDate);

    return shiftsData
      .filter(shift => {
        if (!shift.start_time || typeof shift.employee_id !== 'number' || !shift.meta?.shiftId) return false;
        try {
          // Compare date part and the shift type ID from meta
          const shiftDateString = getDateString(new Date(shift.start_time));
          // Ensure robust comparison (e.g., handle string vs number from API)
          return shiftDateString === targetDateString && String(shift.meta.shiftId) === String(componentShiftId);
        } catch (e) {
          console.error("Error parsing shift start_time:", shift.start_time, e);
          return false;
        }
      })
      .map(shift => shift.employee_id)
      // Filter out potential duplicates
      .filter((id, index, self) => self.indexOf(id) === index);
  };

  // Get full Staff objects for a cell
  const getAssignedStaffObjectsForCell = (targetDate: Date, componentShiftId: number): Staff[] => {
      const assignedIds = getAssignedStaffIdsForShift(targetDate, componentShiftId);
      return staff.filter(s => typeof s.id === 'number' && assignedIds.includes(s.id));
  }

  // --- API Handlers (Passed to Dialog) ---
  const handleAssignStaff = async (staffId: number) => {
    if (!scheduleDialog) return;
    setIsSubmitting(true);
    setError(null); // Clear previous errors
    try {
      const { date, shift: componentShift } = scheduleDialog;
      const dateString = getDateString(date);

      // Construct ISO strings using date and shift times
      // **Important**: This assumes the startTime/endTime are in the *local* timezone
      // of the server or where the dateString is interpreted. Adjust if UTC is needed.
      const startTimeISO = new Date(`${dateString}T${componentShift.startTime}:00`).toISOString();
      const endTimeISO = new Date(`${dateString}T${componentShift.endTime}:00`).toISOString();

      // Handle cases where endTime is on the next day (e.g., Ca Tối 15:00 - 22:00 is fine, but 22:00 - 06:00 needs date adjustment)
      // This example assumes endTime is on the same day. Add logic here if shifts cross midnight.

      const newShiftPayload: Omit<Shift, 'id' | 'createdAt' | 'updatedAt' | 'employee'> = {
        employee_id: staffId,
        start_time: startTimeISO,
        end_time: endTimeISO,
        meta: {
          shiftId: componentShift.id,
          additionalData: {
            shift: {} // Empty object as placeholder for additional shift data
          }
        }
      };

      // Type assertion needed if createShift expects the full Shift type
      const createResponse = await createShift(newShiftPayload as Shift);

      // Check for successful status codes
      if (createResponse && (createResponse.status === 201 || createResponse.status === 200)) {
        await fetchShiftsData(); // Re-fetch shifts to update the UI
        setScheduleDialog(null); // Close dialog on success
      } else {
        // Extract error message from response if available
        const errorMsg = (createResponse?.data as any)?.message || `Status ${createResponse?.status || 'unknown'}`;
        throw new Error(`Không thể tạo ca: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("Error assigning staff:", err);
      setError(`Lỗi phân công: ${err.message || 'Lỗi không xác định'}`);
      // Keep dialog open on error for user to retry or close
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveStaff = async (staffId: number) => {
    if (!scheduleDialog) return;

    const { date, shift: componentShift } = scheduleDialog;
    const targetDateString = getDateString(date);

    // Find the specific shift entry in shiftsData to get its database ID
    const shiftToDelete = shiftsData.find(s => {
       if (!s.start_time || !s.id || typeof s.employee_id !== 'number' || !s.meta?.shiftId) return false;
       try {
         const shiftDateString = getDateString(new Date(s.start_time));
         return s.employee_id === staffId &&
                shiftDateString === targetDateString &&
                String(s.meta.shiftId) === String(componentShift.id);
       } catch (e) {
         return false;
       }
    });

    if (!shiftToDelete || typeof shiftToDelete.id !== 'number') {
      console.error("Could not find the specific shift assignment to delete.", { staffId, targetDateString, componentShiftId: componentShift.id });
      setError("Không tìm thấy ca làm việc cụ thể để xóa.");
      // Maybe set isSubmitting false here if we abort early?
      return; // Abort if shift not found
    }

    setIsSubmitting(true);
    setError(null); // Clear previous errors
    try {
      const deleteResponse = await deleteShift(shiftToDelete.id);

      // Check for successful status codes (204 No Content is common for DELETE)
      if (deleteResponse && (deleteResponse.status === 204 || deleteResponse.status === 200)) {
        await fetchShiftsData(); // Re-fetch shifts to update UI
        // Dialog remains open, allowing removal of others.
        // The dialog will re-render with updated assignedStaffIds prop.
      } else {
        const errorMsg = ((deleteResponse?.data as unknown) as { message?: string })?.message || `Status ${deleteResponse?.status || 'unknown'}`;
        throw new Error(`Không thể xóa ca: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error("Error removing staff:", err);
      setError(`Lỗi xóa phân công: ${err.message || 'Lỗi không xác định'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Functions ---
  const renderWeekHeader = () => (
    <View style={styles.headerRow}>
      {/* Fixed cell for Shift Name column */}
      <View style={[styles.headerCell, styles.shiftHeaderCell]}>
          <Text style={styles.headerCellText}>Ca làm</Text>
      </View>
      {/* Cells for each day */}
      {weekDates.map((date) => (
        <View key={getDateString(date)} style={[styles.headerCell, styles.dayHeaderCell]}>
          <Text style={styles.dayNameText} numberOfLines={1}>
            {formatDate(date, { weekday: 'short' })} {/* Short weekday name */}
          </Text>
          <Text style={styles.dayDateText}>
            {formatDate(date, { day: '2-digit', month: '2-digit' })} {/* DD/MM format */}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderScheduleRow = ({ item: shiftType }: { item: typeof SHIFT_TYPES[0] }) => {
    return (
      <View key={shiftType.id} style={styles.dataRow}>
        {/* Fixed cell for Shift Name */}
        <View style={[styles.dataCell, styles.shiftDataCell]}>
          <Text style={[styles.shiftNameText, { color: shiftType.color }]}>
            {shiftType.name}
          </Text>
          <Text style={styles.shiftTimeText}>
            {shiftType.startTime} - {shiftType.endTime}
          </Text>
        </View>
        {/* Cells for each day in this shift row */}
        {weekDates.map((date) => {
          const assignedStaffObjects = getAssignedStaffObjectsForCell(date, shiftType.id);
          const cellDateString = getDateString(date); // Unique key part

          return (
            <TouchableOpacity
              key={`${shiftType.id}-${cellDateString}`}
              onPress={() => setScheduleDialog({ open: true, shift: shiftType, date })}
              style={[
                  styles.dataCell,
                  styles.dayDataCell,
                  // Slightly change background if assigned
                  assignedStaffObjects.length > 0 && { backgroundColor: `${shiftType.color}20` } // Use alpha for background tint
              ]}
              disabled={isLoading || isSubmitting} // Disable cell interaction during loading
            >
              {assignedStaffObjects.length > 0 ? (
                <View style={styles.staffAvatarList}>
                  {assignedStaffObjects.slice(0, 3).map(staffMember => ( // Limit avatars displayed if too many
                     <View key={staffMember.id} style={[styles.staffAvatarContainer, {backgroundColor: `${shiftType.color}40`}]}>
                       <Text style={styles.staffAvatarText}>{staffMember.name ? staffMember.name[0].toUpperCase() : '?'}</Text>
                     </View>
                  ))}
                  {assignedStaffObjects.length > 3 && <Text style={styles.moreStaffText}>+{assignedStaffObjects.length - 3}</Text>}
                </View>
              ) : (
                // Show add icon to indicate clickability
                 <Icon name="add-circle-outline" size={responsiveFontSize(22)} color="#90A4AE" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // --- Main Return ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header: Title and Week Navigation */}
        <View style={styles.titleHeader}>
          <Text style={styles.titleText}>
             Lịch làm việc {'\n'} {/* Line break */}
            <Text style={styles.weekRangeText}>
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
            </Text>
          </Text>
          <View style={styles.navButtonContainer}>
            <TouchableOpacity style={styles.navButton} onPress={handlePreviousWeek} disabled={isLoading || isSubmitting}>
              <Icon name="chevron-left" size={responsiveFontSize(26)} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={handleNextWeek} disabled={isLoading || isSubmitting}>
              <Icon name="chevron-right" size={responsiveFontSize(26)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Indicator */}
        {isLoading && <ActivityIndicator size="large" color="#2196f3" style={styles.loadingIndicator} />}

         {/* Error Message */}
         {error && !isLoading && <Text style={styles.errorText}>{error}</Text>}

        {/* Schedule Table */}
        {!isLoading && !error && (
             <ScrollView horizontal showsHorizontalScrollIndicator={true} // Enable horizontal scroll
                contentContainerStyle={styles.scrollViewContent}
                style={styles.scrollView}>
                <View style={styles.table}>
                    {/* Header Row */}
                    {renderWeekHeader()}
                    {/* Data Rows (Shift Types) */}
                    <FlatList
                        data={SHIFT_TYPES}
                        renderItem={renderScheduleRow}
                        keyExtractor={item => String(item.id)}
                        scrollEnabled={false} // Disable FlatList's own scroll
                    />
                </View>
             </ScrollView>
        )}


        {/* Schedule Editing Dialog */}
        {scheduleDialog && (
          <ScheduleDialog
            open={scheduleDialog.open}
            onClose={() => { if(!isSubmitting) setScheduleDialog(null) }} // Prevent closing while submitting
            shift={scheduleDialog.shift}
            date={scheduleDialog.date}
            staff={staff}
            assignedStaffIds={getAssignedStaffIdsForShift(scheduleDialog.date, scheduleDialog.shift.id)}
            onAssign={handleAssignStaff}
            onRemove={handleRemoveStaff}
            isSubmitting={isSubmitting} // Pass submitting state
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8', // Light background for the whole screen
  },
  container: {
    flex: 1,
    padding: width * 0.03, // Consistent padding
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.02, // Padding for header content
  },
  titleText: {
    fontSize: responsiveFontSize(18),
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium', // Platform-specific font
    fontWeight: '600',
    color: '#263238', // Darker title color
  },
   weekRangeText: {
       fontSize: responsiveFontSize(14),
       fontWeight: '400',
       color: '#546E7A', // Softer color for date range
   },
  navButtonContainer: {
    flexDirection: 'row',
  },
  navButton: {
    backgroundColor: '#2196f3', // Match Next.js color
    padding: width * 0.018,
    borderRadius: 20, // Circular buttons
    marginLeft: width * 0.02,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  loadingIndicator: {
    marginTop: height * 0.1,
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
      fontSize: responsiveFontSize(14),
      paddingHorizontal: 15,
  },
  scrollView: {
       // The ScrollView itself doesn't need much style here
       // flex: 1, // Allows it to take remaining space if needed
       // marginBottom: 10, // Space at the bottom
   },
   scrollViewContent: {
       // This styles the content *inside* the ScrollView
       // paddingBottom: 10, // Ensure content doesn't touch bottom edge
   },
   table: {
       backgroundColor: '#FFFFFF',
       borderRadius: 8,
       borderWidth: 1,
       borderColor: '#E0E0E0', // Light border for the table
       overflow: 'hidden', // Clip content to border radius
       elevation: 1,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 1 },
       shadowOpacity: 0.1,
       shadowRadius: 2,
       // minWidth needed if content is narrower than screen
       // minWidth: width * 1.5, // Example: Ensure table is wide enough
   },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5', // Lighter header background
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerCell: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  shiftHeaderCell: {
    flexBasis: width * 0.25, // Fixed width for shift column
    minWidth: 100,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    alignItems: 'flex-start', // Align text left
    paddingLeft: width * 0.03,
  },
  dayHeaderCell: {
     flexBasis: width * 0.22, // Flexible width for day columns
     minWidth: 90, // Minimum width for readability
     borderRightWidth: 1,
     borderRightColor: '#E0E0E0',
  },
  headerCellText: {
    fontSize: responsiveFontSize(13),
    fontWeight: '600', // Bolder header text
    color: '#37474F', // Dark grey header text
    textAlign: 'center',
  },
  dayNameText: {
    fontSize: responsiveFontSize(13),
    fontWeight: '500',
    color: '#546E7A',
    textAlign: 'center',
  },
  dayDateText: {
    fontSize: responsiveFontSize(11),
    color: '#78909C',
    marginTop: 2,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1', // Lighter row separator
    minHeight: height * 0.08, // Ensure rows have enough height
  },
  dataCell: {
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
      justifyContent: 'center', // Center content vertically by default
      alignItems: 'center',
  },
  shiftDataCell: {
      flexBasis: width * 0.25,
      minWidth: 100,
      borderRightWidth: 1,
      borderRightColor: '#ECEFF1',
      alignItems: 'flex-start', // Align shift names left
      paddingLeft: width * 0.03,
      justifyContent: 'center', // Center text block vertically
  },
   dayDataCell: {
       flexBasis: width * 0.22,
       minWidth: 90,
       borderRightWidth: 1,
       borderRightColor: '#ECEFF1',
       // alignItems: 'center', // Center avatars/icon
   },
   shiftNameText: {
       fontSize: responsiveFontSize(14),
       fontWeight: '600',
       marginBottom: 2,
   },
   shiftTimeText: {
       fontSize: responsiveFontSize(11),
       color: '#78909C',
   },
   staffAvatarList: {
       flexDirection: 'row',
       flexWrap: 'wrap', // Allow wrapping if many avatars
       justifyContent: 'center', // Center avatars horizontally
       alignItems: 'center', // Center avatars vertically
       paddingVertical: 4, // Add some vertical space
       gap: 4, // Space between avatars
   },
   staffAvatarContainer: {
       width: responsiveFontSize(26), // Avatar size
       height: responsiveFontSize(26),
       borderRadius: responsiveFontSize(13), // Make it circular
       alignItems: 'center',
       justifyContent: 'center',
       // backgroundColor set dynamically with alpha
   },
   staffAvatarText: {
       fontSize: responsiveFontSize(12),
       fontWeight: 'bold',
       color: '#FFFFFF', // White text on colored background
   },
   moreStaffText: {
       fontSize: responsiveFontSize(11),
       color: '#546E7A',
       marginLeft: 2,
   },

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, // Add some padding to prevent touching edges
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // More rounded corners
    width: '100%', // Take full width within overlay padding
    maxWidth: 500, // Max width for larger screens/tablets
    maxHeight: height * 0.8, // Limit modal height
    overflow: 'hidden', // Clip content
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#2196f3', // Header background color
    borderTopLeftRadius: 12, // Match content radius
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between', // Space title and close button
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: responsiveFontSize(17),
    fontWeight: '600',
    color: '#fff', // White title text
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    maxWidth: '85%', // Prevent title overlapping close button
  },
  modalSubtitle: {
    fontSize: responsiveFontSize(13),
    color: '#E3F2FD', // Lighter subtitle text
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginTop: 2,
  },
  modalCloseButton: {
    padding: 5, // Make touch target slightly larger
    position: 'absolute', // Position independently
    right: width * 0.03,
    top: height * 0.015,
  },
  modalBody: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    // maxHeight calculated dynamically if needed, or use ScrollView
  },
  selectStaffContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.025,
    gap: width * 0.03, // Gap between picker and button
  },
  pickerWrapper: {
      flex: 1, // Take available space
      borderWidth: 1,
      borderColor: '#B0BEC5', // Subtle border
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center', // Center picker text vertically on iOS
      height: Platform.OS === 'ios' ? 45 : 50, // Consistent height
  },
  picker: {
      width: '100%',
      height: '100%', // Fill wrapper
      color: '#333',
      // Note: Styling Picker itself is limited, especially on Android
  },
  // Required for Android border visual consistency
  pickerBorderAndroid: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      borderWidth: 1,
      borderColor: '#B0BEC5',
      borderRadius: 8,
      zIndex: -1, // Place behind the picker
  },
  pickerItem: {
      fontSize: responsiveFontSize(14), // Style picker items if possible
      // Note: Item styling might not work consistently across platforms
  },
  addButton: {
    backgroundColor: '#2196f3', // Match header color
    paddingVertical: Platform.OS === 'ios' ? 12 : 14, // Platform-specific padding
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    minWidth: 70, // Ensure button has minimum width
    alignItems: 'center', // Center loader/text
  },
  buttonDisabled: {
      backgroundColor: '#90CAF9', // Lighter color when disabled
      elevation: 0,
      shadowOpacity: 0,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
  },
  assignedListTitle: {
      fontSize: responsiveFontSize(14),
      fontWeight: '500',
      color: '#455A64',
      marginBottom: height * 0.01,
      marginTop: height * 0.01,
  },
  assignedStaffList: {
      maxHeight: height * 0.35, // Limit list height, make scrollable if needed
      borderTopWidth: 1,
      borderTopColor: '#ECEFF1',
      marginTop: 5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.01, // Less horizontal padding within modal body
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5', // Very light separator
  },
  listItemTextContainer: {
    flex: 1, // Allow text to take available space
    marginRight: 10, // Space before remove button
  },
  listItemPrimary: {
    fontSize: responsiveFontSize(14),
    fontWeight: '500',
    color: '#37474F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  listItemSecondary: {
    fontSize: responsiveFontSize(12),
    color: '#78909C',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginTop: 2,
  },
  removeButtonContainer: {
    padding: 8, // Larger touch target
    borderRadius: 20,
  },
  emptyListText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#78909C',
      fontSize: responsiveFontSize(13),
  },
  // Footer is optional now
  // modalFooter: { ... },
  // modalFooterText: { ... },
});

export default StaffSchedule;