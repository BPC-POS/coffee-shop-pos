import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Table, TableArea, TableStatus } from '@/types/Table';
import { getTables, getTableAreas, updateTable } from '@/api/table';
import OrdersScreen from '@/app/(main)/waiter/Orders/index';

interface Props {
  onTableSelect: (table: Table | null) => void;
}

const AreaTableScreen = () => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [tables, setTables] = useState<Table[]>([]);
  const [areas, setAreas] = useState<TableArea[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tables
      const tablesResponse = await getTables();
      console.log('Tables response from API:', JSON.stringify(tablesResponse.data[0], null, 2));
      setTables(tablesResponse.data);

      // Fetch areas
      const areasResponse = await getTableAreas();
      console.log('Areas response from API:', JSON.stringify(areasResponse.data, null, 2));
      
      // Add "All" option to areas
      const allAreas: TableArea[] = [
        { id: 'all', name: 'Tất cả', code: 'indoor' as const, isActive: true },
        ...areasResponse.data
      ];
      
      // Log để kiểm tra
      console.log('All areas after adding "All" option:', allAreas);
      
      setAreas(allAreas);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tables and areas data
  useEffect(() => {
    fetchData();
  }, []);

  // Filter tables by area
  const filteredTables = useMemo(() => {
    console.log('Filtering tables with selectedArea:', selectedArea);
    console.log('All tables:', tables);
    
    if (selectedArea === 'all') {
      return tables;
    }
    
    // So sánh areaId với selectedArea
    return tables.filter(table => {
      console.log('Table:', table.id, 'Area ID:', table.areaId, 'type:', typeof table.areaId);
      console.log('Selected Area:', selectedArea, 'type:', typeof selectedArea);
      
      // Chuyển đổi cả hai thành chuỗi để so sánh
      return String(table.areaId) === String(selectedArea);
    });
  }, [selectedArea, tables]);

  console.log('Filtered tables:', filteredTables);

  // Handle table status update
  const handleStatusSelect = async (status: TableStatus) => {
    if (selectedTable) {
      try {
        setLoading(true);
        const updatedTable = {
          ...selectedTable,
          status: status
        };

        await updateTable({
          id: selectedTable.id,
          name: selectedTable.name,
          capacity: selectedTable.capacity,
          notes: selectedTable.note || '',
          status: status,
          areaId: selectedTable.areaId
        });

        // Update local state
        setTables(prevTables =>
          prevTables.map(table =>
            table.id === selectedTable.id ? { ...table, status } : table
          )
        );

      } catch (err) {
        console.error('Error updating table status:', err);
        setError('Không thể cập nhật trạng thái bàn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
        setIsModalVisible(false);
      }
    }
  };

  const handleTablePress = (table: Table) => {
    setSelectedTable(table);
    setIsModalVisible(true);
  };

  const openOrderPopup = () => {
    setIsOrderModalVisible(true);
  };

  const closeOrderPopup = () => {
    setIsOrderModalVisible(false);
  };

  const renderAreaItem = ({ item }: { item: TableArea }) => (
    <TouchableOpacity
      style={[styles.areaButton, selectedArea === item.id && styles.selectedArea]}
      onPress={() => {
        console.log('Selecting area:', item);
        setSelectedArea(item.id);
      }}
    >
      <Text style={[styles.areaText, selectedArea === item.id && styles.selectedAreaText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const statusMapping: Record<TableStatus, string> = {
    [TableStatus.AVAILABLE]: 'Trống',
    [TableStatus.OCCUPIED]: 'Có khách',
    [TableStatus.RESERVED]: 'Đã đặt trước',
    [TableStatus.CLEANING]: 'Đang dọn dẹp',
    [TableStatus.MAINTENANCE]: 'Đang bảo trì',
  };

  const renderTableItem = ({ item }: { item: Table }) => {
    let statusText = statusMapping[item.status];
    let statusStyle = styles.available;

    switch (item.status) {
      case TableStatus.AVAILABLE:
        statusStyle = styles.available;
        break;
      case TableStatus.OCCUPIED:
        statusStyle = styles.occupied;
        break;
      case TableStatus.RESERVED:
        statusStyle = styles.reserved;
        break;
      case TableStatus.CLEANING:
        statusStyle = styles.cleaning;
        break;
      case TableStatus.MAINTENANCE:
        statusStyle = styles.maintenance;
        break;
      default:
        statusStyle = styles.available;
    }

    return (
      <TouchableOpacity
        style={styles.tableCard}
        onPress={() => handleTablePress(item)}
      >
        <Text style={styles.tableName}>{item.name}</Text>
        <Text style={styles.tableCapacity}>Số chỗ: {item.capacity}</Text>
        <Text style={[styles.tableStatus, statusStyle]}>
          {statusText}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading && tables.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            // Re-fetch data
            fetchData();
          }}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.orderButton} onPress={openOrderPopup}>
        <Text style={styles.orderButtonText}>Xem đơn hàng</Text>
      </TouchableOpacity>

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
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredTables.length === 0 ? (
          <Text style={styles.emptyText}>Không có bàn nào trong khu vực này</Text>
        ) : (
          <FlatList
            data={filteredTables}
            renderItem={renderTableItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.tableList}
          />
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn trạng thái bàn</Text>
            {(Object.values(TableStatus) as TableStatus[]).map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.statusButton}
                onPress={() => handleStatusSelect(status)}
                disabled={loading}
              >
                <Text style={styles.statusText}>{statusMapping[status]}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isOrderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeOrderPopup}
      >
        <View style={styles.fullScreenModal}>
          <OrdersScreen />
          <TouchableOpacity style={styles.closeButton} onPress={closeOrderPopup}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  areaContainer: {
    marginBottom: 16,
  },
  orderButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  selectedAreaText: {
    color: '#fff',
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
  reserved: {
    color: '#ffc107',
  },
  cleaning: {
    color: '#17a2b8',
  },
  maintenance: {
    color: '#6c757d',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusButton: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
  },
  tableList: {
    padding: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AreaTableScreen;