import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { OrderFilter as OrderFilterType, OrderStatus, PaymentStatus } from '@/types/Order';
import DateTimePicker from '@react-native-community/datetimepicker';

interface OrderFilterProps {
    filter: OrderFilterType;
    onFilterChange: (filter: OrderFilterType) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ filter, onFilterChange }) => {
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
     const [showFilterOptions, setShowFilterOptions] = useState(false);

    const handleReset = () => {
        onFilterChange({});
        setShowFilterOptions(false);
    };

    const handleStartDateChange = (event: any, date?: Date) => {
         setShowStartDatePicker(false);
         if (date) {
          onFilterChange({ ...filter, startDate: date });
        }
    };

     const handleEndDateChange = (event: any, date?: Date) => {
         setShowEndDatePicker(false);
        if (date) {
         onFilterChange({ ...filter, endDate: date });
        }
    };

     const handleStatusChange = (itemValue : OrderStatus | undefined) => {
       onFilterChange({ ...filter, status: itemValue});
     }
       const handlePaymentChange = (itemValue : PaymentStatus | undefined) => {
        onFilterChange({ ...filter, paymentStatus: itemValue});
    }
  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

    return (
        <View style={styles.container}>
             <View style={styles.filterContainer}>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#888" style={styles.searchIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder="Tìm kiếm đơn hàng..."
                        value={filter.search || ''}
                        onChangeText={(text) => onFilterChange({ ...filter, search: text })}
                    />
                </View>
                 <TouchableOpacity style={styles.toggleButton} onPress={toggleFilterOptions}>
                    <Icon name={showFilterOptions ? "arrow-drop-up" : "arrow-drop-down"} size={24} color="#888" />
                   <Text style={styles.toggleText}>{showFilterOptions ? "Thu gọn" : "Mở rộng"}</Text>
                </TouchableOpacity>

             {showFilterOptions && (
                 <ScrollView showsVerticalScrollIndicator={false}>
                   <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Trạng thái</Text>
                         <View style={styles.picker}>
                          <Picker
                            selectedValue={filter.status || undefined}
                            style={styles.select}
                               onValueChange={handleStatusChange}
                          >
                                <Picker.Item label="Tất cả" value={undefined} />
                                {Object.values(OrderStatus).map((status) => (
                                    <Picker.Item key={status} label={status} value={status} />
                                ))}
                           </Picker>
                        </View>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Thanh toán</Text>
                          <View style={styles.picker}>
                          <Picker
                            selectedValue={filter.paymentStatus || undefined}
                            style={styles.select}
                             onValueChange={handlePaymentChange}
                          >
                                 <Picker.Item label="Tất cả" value={undefined} />
                                {Object.values(PaymentStatus).map((status) => (
                                    <Picker.Item key={status} label={status} value={status} />
                                ))}
                           </Picker>
                        </View>
                    </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.label}>Từ ngày</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
                          <Text style={styles.dateText}>{filter.startDate ? filter.startDate.toLocaleDateString() : 'Chọn ngày'}</Text>
                    </TouchableOpacity>
                   {showStartDatePicker && (
                        <DateTimePicker
                            value={filter.startDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleStartDateChange}
                        />
                    )}
                </View>
                <View style={styles.dateContainer}>
                    <Text style={styles.label}>Đến ngày</Text>
                     <TouchableOpacity style={styles.dateInput}  onPress={() => setShowEndDatePicker(true)}>
                          <Text style={styles.dateText}>{filter.endDate ? filter.endDate.toLocaleDateString() : 'Chọn ngày'}</Text>
                    </TouchableOpacity>
                       {showEndDatePicker && (
                        <DateTimePicker
                            value={filter.endDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleEndDateChange}
                        />
                    )}
                </View>
                 </ScrollView>
           )}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        style={[styles.button, styles.resetButton]}
                        onPress={handleReset}
                    >
                      <Icon name="replay" size={20} color="#fff"/>
                      <Text style={styles.buttonText}>Đặt lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.filterButton]}
                         onPress={() => {/* TODO: Apply filters */}}
                    >
                       <Icon name="filter-list" size={20} color="#fff"/>
                        <Text style={styles.buttonText}>Lọc</Text>
                    </TouchableOpacity>
                </View>
            </View>
         </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff'
    },
    filterContainer: {
         backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 10
    },
      searchIcon: {
         marginHorizontal: 10
     },
     input: {
        flex: 1,
        padding: 10,
        fontFamily: 'Poppins',
    },
       toggleButton: {
      flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
         marginBottom: 10,
    },
   toggleText: {
      fontFamily: 'Poppins-Medium',
       color: '#888'
   },
    pickerContainer: {
        marginBottom: 10,
   },
    label: {
    fontSize: 16,
      fontFamily: 'Poppins',
      color: '#333',
        marginBottom: 5
  },
  picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
   },
   select: {
        fontFamily: 'Poppins',
   },
   dateContainer: {
        marginBottom: 10,
  },
   dateInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
         backgroundColor: '#fff',
    },
    dateText: {
      fontFamily: 'Poppins',
        color: '#333'
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10
    },
    button: {
       paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
       flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    resetButton: {
        backgroundColor: '#666',
    },
    filterButton: {
        backgroundColor: '#007bff'
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
         marginLeft: 5
    },
});

export default OrderFilter;