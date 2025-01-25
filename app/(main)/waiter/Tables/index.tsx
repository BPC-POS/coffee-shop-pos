import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Table, TableArea, TableStatus } from '@/types/Table';
import { mockTable } from '@/mock/mockTable'; 

interface Props {
    onTableSelect: (table: Table | null) => void;
  }

const areas: TableArea[] = [
    { id: '1', name: 'Tất cả', isActive: true },
    { id: '2', name: 'Trong nhà', isActive: true },
    { id: '3', name: 'Tầng 1', isActive: true },
    { id: '4', name: 'Sân vườn', isActive: true },
];

const AreaTableScreen = () => {
    const [selectedArea, setSelectedArea] = useState<string>('1');

      const [showPosArea, setShowPosArea] = useState(true); // Thêm state để kiểm soát hiển thị POSArea
    
    // Lọc danh sách bàn theo khu vực
    const filteredTables = selectedArea === '1'
        ? mockTable
        : mockTable.filter(table => table.area === selectedArea);

    const renderAreaItem = ({ item }: { item: TableArea }) => (
        <TouchableOpacity
            style={[styles.areaButton, selectedArea === item.id && styles.selectedArea]}
            onPress={() => setSelectedArea(item.id)}
        >
            <Text style={styles.areaText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderTableItem = ({ item }: { item: Table }) => (
        <View style={styles.tableCard}>
            <Text style={styles.tableName}>{item.name}</Text>
            <Text style={styles.tableCapacity}>Số chỗ: {item.capacity}</Text>
            <Text style={[styles.tableStatus, 
                item.status === 'available' ? styles.available : styles.occupied
            ]}>
                {item.status === 'available' ? 'Trống' : 'Đã đặt'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Danh sách khu vực */}
            <View style={styles.areaContainer}>
                <FlatList
                    data={areas}
                    renderItem={renderAreaItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Danh sách bàn */}
            <View style={styles.tableContainer}>
                <FlatList
                    data={filteredTables}
                    renderItem={renderTableItem}
                    keyExtractor={item => String(item.id)}
                    numColumns={2}
                    columnWrapperStyle={styles.tableRow}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    areaContainer: {
        marginBottom: 16,
    },
    areaButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginRight: 10,
    },
    selectedArea: {
        backgroundColor: '#007bff',
    },
    areaText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    tableContainer: {
        flex: 1,
    },
    tableRow: {
        justifyContent: 'space-between',
    },
    tableCard: {
        flex: 1,
        margin: 5,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        alignItems: 'center',
    },
    tableName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    tableCapacity: {
        fontSize: 14,
        color: '#555',
    },
    tableStatus: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
    },
    available: {
        color: '#28a745',
    },
    occupied: {
        color: '#dc3545',
    },
});

export default AreaTableScreen;
