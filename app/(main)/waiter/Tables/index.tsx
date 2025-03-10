import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Table, TableArea, TableStatus } from '@/types/Table';
import { mockTable } from '@/mock/mockTable';
import WaiterTableModal from '@/components/waiter/WaiterTableModal';
import OrdersScreen from '@/app/(main)/waiter/Orders/index'; // Import OrdersScreen


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
  const [tables, setTables] = useState<Table[]>(mockTable);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null); // Bàn được chọn để thay đổi trạng thái
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị Modal
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false); // Hiển thị Modal OrdersScreen
  const waitrTableModel = new WaiterTableModal(tables);

  // Lọc danh sách bàn theo khu vực
  const filteredTables = selectedArea === '1'
    ? tables
    : tables.filter(table => table.area === selectedArea);

  // Xử lý khi bấm vào bàn
  const handleTablePress = (table: Table) => {
    setSelectedTable(table); // Lưu bàn được chọn
    setIsModalVisible(true); // Hiển thị Modal
  };

  // Xử lý khi chọn trạng thái từ Modal
  const handleStatusSelect = (status: TableStatus) => {
    if (selectedTable) {
      const updatedTables = waitrTableModel.updateTableStatus(selectedTable.id, status);
      setTables(updatedTables); // Cập nhật danh sách bàn
      setIsModalVisible(false); // Ẩn Modal
    }
  };
  // Mở popup OrdersScreen
  const openOrderPopup = () => {
    setIsOrderModalVisible(true);
  };

  // Đóng popup OrdersScreen
  const closeOrderPopup = () => {
    setIsOrderModalVisible(false);
  };

  const renderAreaItem = ({ item }: { item: TableArea }) => (
    <TouchableOpacity
      style={[styles.areaButton, selectedArea === item.id && styles.selectedArea]}
      onPress={() => setSelectedArea(item.id)}
    >
      <Text style={styles.areaText}>{item.name}</Text>
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
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.orderButton} onPress={openOrderPopup}>
        <Text style={styles.orderButtonText}>Xem đơn hàng</Text>
      </TouchableOpacity>
      {/* Danh sách khu vực và bàn */}
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
          keyExtractor={item => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.tableRow}
          showsVerticalScrollIndicator={false}
        />
      </View>
      

      {/* Modal chọn trạng thái */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn trạng thái bàn</Text>
            {Object.values(TableStatus).map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.statusButton}
                onPress={() => handleStatusSelect(status)}
              >
                <Text style={styles.statusText}>{statusMapping[status]}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

       {/* Modal OrdersScreen */}
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
  reserved: {
    color: '#ffc107', // Màu vàng cho trạng thái "Đã đặt trước"
  },
  cleaning: {
    color: '#17a2b8', // Màu xanh dương nhạt cho trạng thái "Đang dọn dẹp"
  },
  maintenance: {
    color: '#6c757d', // Màu xám cho trạng thái "Đang bảo trì"
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
});

export default AreaTableScreen;