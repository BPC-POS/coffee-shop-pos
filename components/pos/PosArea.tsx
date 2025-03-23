import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import PosTableModal from './Modal/PosTableModal';
import { Table, TableStatus, TableArea } from '@/types/Table';
import { getTableAreas, getTables } from '@/api/table';

interface Props {
    onTableSelect: (table: Table | null) => void;
}

const POSArea: React.FC<Props> = ({ onTableSelect }) => {
    const [selectedArea, setSelectedArea] = useState<string>('1');
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [tableToConfirm, setTableToConfirm] = useState<number | null>(null);
    const [confirmedTables, setConfirmedTables] = useState<number[]>([]);
    const [isCancelling, setIsCancelling] = useState(false);

    const [areasFromApi, setAreasFromApi] = useState<TableArea[]>([]);
    const [tablesFromApi, setTablesFromApi] = useState<Table[]>([]);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const [errorAreas, setErrorAreas] = useState<string | null>(null);
    const [loadingTables, setLoadingTables] = useState(true);
    const [errorTables, setErrorTables] = useState<string | null>(null);

    useEffect(() => {
        fetchAreas();
        fetchTablesData();
    }, []);

    const fetchAreas = async () => {
        setLoadingAreas(true);
        setErrorAreas(null);
        try {
            const response = await getTableAreas();
            if (response.status >= 200 && response.status < 300) {
                setAreasFromApi([{ id: '1', name: 'Tất cả', code: 'indoor', isActive: true }, ...response.data]);
            } else {
                setErrorAreas(`Lỗi khi tải khu vực bàn. Status code: ${response.status}`);
            }
        } catch (error: any) {
            setErrorAreas("Lỗi kết nối hoặc lỗi không xác định khi tải khu vực bàn.");
            console.error("Error fetching table areas:", error);
        } finally {
            setLoadingAreas(false);
        }
    };

    const fetchTablesData = async () => {
        setLoadingTables(true);
        setErrorTables(null);
        try {
            const response = await getTables();
            if (response.status >= 200 && response.status < 300) {
                setTablesFromApi(response.data);
            } else {
                setErrorTables(`Lỗi khi tải dữ liệu bàn. Status code: ${response.status}`);
            }
        } catch (error: any) {
            setErrorTables("Lỗi kết nối hoặc lỗi không xác định khi tải dữ liệu bàn.");
            console.error("Error fetching tables:", error);
        } finally {
            setLoadingTables(false);
        }
    };

    const areaColors: { [key: string]: string } = {
        '1': '#e0e0e0', // Tất cả
        '2': '#a5d6a7', // Trong nhà - light green
        '3': '#81d4fa', // Tầng 1 - light blue
        '4': '#ffcc80', // Sân vườn - light orange
    };

    const getAreaColor = (areaId: string) => {
        return areaColors[areaId] || '#e0e0e0';
    };


    const tableStatusColors: Record<TableStatus, string> = {
        [TableStatus.AVAILABLE]: '#4CAF50', // Green for Available
        [TableStatus.OCCUPIED]: '#F44336',  // Red for Occupied
        [TableStatus.RESERVED]: '#FFC107', // Amber for Reserved
        [TableStatus.CLEANING]: '#2196F3',  // Blue for Cleaning
        [TableStatus.MAINTENANCE]: '#FF5722',  // Deep Orange for Maintenance
    };

    const filteredTables = tablesFromApi.filter(table =>
        selectedArea === '1' || (table.area && String(table.area.id) === selectedArea)
    );

    const renderAreaItem = ({ item }: { item: TableArea }) => (
        <TouchableOpacity
            style={[styles.areaButton, selectedArea === String(item.id) && styles.selectedAreaButton]}
            onPress={() => setSelectedArea(String(item.id))}
        >
            <Text style={[styles.areaText, selectedArea === String(item.id) && styles.selectedAreaText]}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderTableItem = ({ item }: { item: Table }) => {
        const isTableConfirmed = confirmedTables.includes(item.id);
        const handleTablePress = () => {
            setTableToConfirm(item.id);
            setIsCancelling(isTableConfirmed);
            setModalVisible(true);
        };

        const tableStatusColor = tableStatusColors[item.status as TableStatus] || tableStatusColors[TableStatus.AVAILABLE]; // Default color if status is not defined

        const tableStyle = [
            styles.tableButton,
            { backgroundColor: isTableConfirmed ? '#388e3c' : tableStatusColor }, 
            selectedTable?.id === item.id && styles.selectedTableButton,
        ];

        return (
            <TouchableOpacity
                style={tableStyle}
                onPress={handleTablePress}
            >
                <Text style={styles.tableText}>{item.name}</Text>
                <Text style={styles.tableCapacity}>{item.capacity} Seats</Text>
            </TouchableOpacity>
        );
    };

    const handleConfirmTable = () => {
        if (tableToConfirm) {
            const table = tablesFromApi.find(t => t.id === tableToConfirm) || null;
            setSelectedTable(table);
            onTableSelect(table);
            if (!isCancelling) {
                setConfirmedTables(prev => [...prev, tableToConfirm]);
            }
        }
        setModalVisible(false);
        setTableToConfirm(null);
        setIsCancelling(false);
    };

    const handleCancelTable = () => {
        if (isCancelling && tableToConfirm) {
            setSelectedTable(null);
            onTableSelect(null);
            setConfirmedTables(prev => prev.filter(id => id !== tableToConfirm));
        }
        setModalVisible(false);
        setTableToConfirm(null);
        setIsCancelling(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.areaContainer}>
                {loadingAreas ? (
                    <ActivityIndicator size="small" color="#007bff" />
                ) : errorAreas ? (
                    <Text style={styles.errorText}>{errorAreas}</Text>
                ) : (
                    <FlatList
                        data={areasFromApi}
                        renderItem={renderAreaItem}
                        keyExtractor={item => String(item.id)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                )}
            </View>
            <View style={styles.tableContainer}>
                {loadingTables ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : errorTables ? (
                    <Text style={styles.errorText}>{errorTables}</Text>
                ) : (
                    <FlatList
                        data={filteredTables}
                        renderItem={renderTableItem}
                        keyExtractor={item => String(item.id)}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
            <PosTableModal
                isVisible={modalVisible}
                tableNumber={tablesFromApi.find(table => table.id === tableToConfirm)?.name ?? null}
                onConfirm={handleConfirmTable}
                onCancel={handleCancelTable}
                isCancelling={isCancelling}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#f4f4f4', 
    },
    areaContainer: {
        marginBottom: 20,
        paddingVertical: 10,
    },
    areaButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 25, 
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedAreaButton: {
        backgroundColor: '#007bff', 
    },
    areaText: {
        color: '#555',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    selectedAreaText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
    },
    tableContainer: {
        flex: 1,
    },
    tableButton: {
        borderRadius: 15,  
        margin: 8,
        width: '30%', 
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectedTableButton: {
        borderColor: '#28a745',
        borderWidth: 3,
    },
    tableText: {
        color: '#fff',
        fontSize: 18, 
        marginBottom: 3,
        fontFamily: 'Poppins-Medium',
    },
    tableCapacity: {
        color: '#eee',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Poppins-Regular',
    }
});

export default POSArea;