import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import PosTableModal from './PosTableModal';

// Định nghĩa kiểu cho khu vực
interface Area {
    id: string;
    name: string;
    color: string;
}

// Định nghĩa kiểu cho bàn
interface Table {
    id: string;
    areaId: string;
    number: string;
    capacity: number;
}

interface Props {
    onTableSelect: (tableId: string | null) => void;
}
// Dữ liệu khu vực
const areas: Area[] = [
    { id: '1', name: 'Tất cả', color: '#e0e0e0' },
    { id: '2', name: 'Trong nhà', color: '#a5d6a7' },
    { id: '3', name: 'Tầng 1', color: '#81d4fa' },
    { id: '4', name: 'Sân vườn', color: '#ffcc80' },
];

// Tạo mock data cho bàn
const generateTables = (areaId: string) => {
    return Array.from({ length: 10 }, (_, index) => ({
        id: `${areaId}-${index + 1}`,
        areaId,
        number: `Bàn ${index + 1}`,
        capacity: Math.floor(Math.random() * 4) + 2,
    }));
};

// Tạo danh sách bàn cho từng khu vực
const tables: Table[] = [
    ...generateTables('2'),
    ...generateTables('3'),
    ...generateTables('4'),
];

const POSArea: React.FC<Props> = ({ onTableSelect }) => {
    const [selectedArea, setSelectedArea] = useState<string>('1');
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [tableToConfirm, setTableToConfirm] = useState<string | null>(null);
    const [confirmedTables, setConfirmedTables] = useState<string[]>([]);
    const [isCancelling, setIsCancelling] = useState(false);


    const getAreaColor = (areaId: string) => {
        const area = areas.find(area => area.id === areaId);
        return area ? area.color : '#e0e0e0';
    };

    const filteredTables = tables.filter(table =>
        selectedArea === '1' || table.areaId === selectedArea
    );

    const renderAreaItem = ({ item }: { item: Area }) => (
        <TouchableOpacity
            style={[styles.areaButton, selectedArea === item.id && styles.selectedArea]}
            onPress={() => setSelectedArea(item.id)}
        >
            <Text style={styles.areaText}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderTableItem = ({ item }: { item: Table }) => {
        const tableColor = selectedArea === '1' ? getAreaColor(item.areaId) : getAreaColor(selectedArea);
        const isTableConfirmed = confirmedTables.includes(item.id);
        const handleTablePress = () => {
            setTableToConfirm(item.id);
            setIsCancelling(isTableConfirmed);
            setModalVisible(true);
        };

        const tableStyle = [
            styles.tableButton,
            { backgroundColor: isTableConfirmed ? '#388e3c' : tableColor },
            selectedTable === item.id && styles.selectedTable,
        ];

        return (
            <TouchableOpacity
                style={tableStyle}
                 onPress={handleTablePress}
            >
                <Text style={styles.tableText}>{item.number}</Text>
                <Text style={styles.tableCapacity}>{item.capacity}</Text>
            </TouchableOpacity>
        );
    };

    const handleConfirmTable = () => {
        if (tableToConfirm) {
            setSelectedTable(tableToConfirm);
            onTableSelect(tableToConfirm);
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
                <FlatList
                    data={areas}
                    renderItem={renderAreaItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={styles.tableContainer}>
                <FlatList
                    data={filteredTables}
                    renderItem={renderTableItem}
                    keyExtractor={item => item.id}
                    numColumns={4}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <PosTableModal
                isVisible={modalVisible}
                tableNumber={tables.find(table => table.id === tableToConfirm)?.number ?? null}
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
        color: '#333',
    },
    tableContainer: {
        flex: 1,
    },
    tableButton: {
        padding: 10,
        borderRadius: 5,
        margin: 5,
        width: '22%',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    selectedTable: {
        borderWidth: 2,
        borderColor: '#28a745',
    },
    tableText: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    tableCapacity: {
        color: '#fff',
        fontSize: 14,
    },
});

export default POSArea;