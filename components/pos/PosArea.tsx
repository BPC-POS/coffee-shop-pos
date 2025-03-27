import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import PosTableModal from './Modal/PosTableModal';
import { Table, TableStatus, TableArea, numericStatusToTableStatus, UpdateTableDTO, tableStatusToNumericStatus } from '@/types/Table';
import { getTableAreas, getTables, updateTable as updateTableAPI } from '@/api/table';

interface Props {
    onTableSelect: (table: Table | null) => void;
    tables?: Table[];
}

const POSArea: React.FC<Props> = ({ onTableSelect, tables = [] }) => {
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
    const [updatingTableStatus, setUpdatingTableStatus] = useState<number | null>(null);

    useEffect(() => {
        fetchAreas();
        if (tables.length === 0) {
            fetchTablesData();
        } else {
            setTablesFromApi(tables);
            setLoadingTables(false);
        }
    }, [tables]);

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
        '1': '#e0e0e0',
        '2': '#c8e6c9',
        '3': '#bbdefb',
        '4': '#ffe0b2',
        'default': '#f0f0f0',
    };

    const getAreaColor = (areaId: string) => {
        return areaColors[areaId] || areaColors['default'];
    };


    const tableStatusColors: Record<TableStatus, string> = {
        [TableStatus.AVAILABLE]: '#4CAF50',
        [TableStatus.OCCUPIED]: '#F44336',
        [TableStatus.RESERVED]: '#FFC107',
        [TableStatus.CLEANING]: '#03A9F4',
        [TableStatus.MAINTENANCE]: '#FF7043',
    };

    const filteredTables = tablesFromApi.filter(table =>
        selectedArea === '1' || (table.area && String(table.area.id) === selectedArea)
    );

    const renderAreaItem = ({ item }: { item: TableArea }) => (
        <TouchableOpacity
            style={[
                styles.areaButton,
                { backgroundColor: getAreaColor(String(item.id)) },
                selectedArea === String(item.id) && styles.selectedAreaButton
            ]}
            onPress={() => setSelectedArea(String(item.id))}
        >
            <Text style={[styles.areaText, selectedArea === String(item.id) && styles.selectedAreaText]}>{item.name}</Text>
        </TouchableOpacity>
    );

    const handleStatusChange = async (tableId: number, newStatus: TableStatus) => {
        setUpdatingTableStatus(tableId);
        try {
            const numericNewStatus = tableStatusToNumericStatus[newStatus];
            
            // Tìm thông tin đầy đủ của bàn hiện tại
            const currentTable = tablesFromApi.find(t => t.id === tableId);
            if (!currentTable) {
                throw new Error("Không tìm thấy thông tin bàn");
            }
            
            // Chuẩn bị dữ liệu đầy đủ để cập nhật
            const updateData = {
                id: tableId,
                name: currentTable.name,
                capacity: currentTable.capacity,
                notes: currentTable.note || "",
                status: numericNewStatus,
                areaId: currentTable.areaId
            };
            
            // Gọi API cập nhật bàn
            await updateTableAPI(updateData);

            // Cập nhật state local
            setTablesFromApi(prevTables =>
                prevTables.map(table =>
                    table.id === tableId ? { ...table, status: numericNewStatus } : table
                )
            );
            
            Alert.alert("Thành công", `Đã cập nhật trạng thái bàn ${currentTable.name}`);
        } catch (error) {
            console.error("Error updating table status:", error);
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái bàn.");
        } finally {
            setUpdatingTableStatus(null);
        }
    };


    const renderTableItem = ({ item }: { item: Table }) => {
        const isTableConfirmed = confirmedTables.includes(item.id);
        const isOccupied = item.status === tableStatusToNumericStatus[TableStatus.OCCUPIED];
        const handleTablePress = () => {
            if (isOccupied) {
                Alert.alert("Bàn đang có khách", "Không thể chọn bàn đang có khách. Vui lòng chọn bàn trống hoặc bàn khác.");
                return;
            }
            setTableToConfirm(item.id);
            setIsCancelling(isTableConfirmed);
            setModalVisible(true);
        };

        const tableStatusEnum = numericStatusToTableStatus[item.status as keyof typeof numericStatusToTableStatus] || TableStatus.AVAILABLE;
        const tableStatusColor = tableStatusColors[tableStatusEnum] || tableStatusColors[TableStatus.AVAILABLE];


        const tableStyle = [
            styles.tableButton,
            { backgroundColor: isTableConfirmed ? '#81c784' : tableStatusColor },
            selectedTable?.id === item.id && styles.selectedTableButton,
            isOccupied && styles.occupiedTableButton,
        ];

        return (
            <TouchableOpacity
                style={tableStyle}
                onPress={handleTablePress}
                disabled={updatingTableStatus === item.id || isOccupied}
                activeOpacity={isOccupied ? 1 : 0.8}
            >
                {updatingTableStatus === item.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Text style={styles.tableText}>{item.name}</Text>
                        <Text style={styles.tableCapacity}>{item.capacity} Seats</Text>
                        {isOccupied && <Text style={styles.occupiedText}>Đang có khách</Text>}
                    </>
                )}
                <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => {
                        Alert.alert(
                            "Thay đổi trạng thái bàn",
                            `Chọn trạng thái mới cho bàn ${item.name}`,
                            Object.keys(TableStatus).map(key => ({
                                text: key, 
                                onPress: () => handleStatusChange(item.id, TableStatus[key as keyof typeof TableStatus]),
                            })),
                            { cancelable: true }
                        );
                    }}
                >
                    <Text style={styles.statusButtonText}>...</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 15,
        paddingTop: 15,
        backgroundColor: '#f4f4f4',
    },
    areaContainer: {
        marginBottom: 15,
        paddingVertical: 8,
    },
    areaButton: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        backgroundColor: '#e0e0e0',
        borderRadius: 22,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedAreaButton: {
        backgroundColor: '#007bff',
    },
    areaText: {
        color: '#555',
        fontSize: 15,
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
        borderRadius: 12,
        margin: 7,
        width: '30%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedTableButton: {
        borderColor: '#28a745',
        borderWidth: 3,
    },
    tableText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 2,
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
    },
    tableCapacity: {
        color: '#eee',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 15,
        fontFamily: 'Poppins-Regular',
    },
    statusButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        padding: 5,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    statusButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    occupiedTableButton: {
        opacity: 0.6,
    },
    occupiedText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
        textAlign: 'center',
    }
});

export default POSArea;