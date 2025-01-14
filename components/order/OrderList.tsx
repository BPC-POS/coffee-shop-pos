import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Order, OrderStatus, PaymentStatus } from '@/types/Order';
import { formatCurrency } from '@/utils/format';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from 'react-native';


interface OrderListProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: number, status: PaymentStatus) => void;
}


const statusColors = {
    [OrderStatus.PENDING]: '#ffc107',
    [OrderStatus.CONFIRMED]: '#17a2b8',
    [OrderStatus.PREPARING]: '#007bff',
    [OrderStatus.READY]: '#6c757d',
    [OrderStatus.COMPLETED]: '#28a745',
    [OrderStatus.CANCELLED]: '#dc3545',
} as const;

const statusLabels = {
    [OrderStatus.PENDING]: 'Chờ xác nhận',
    [OrderStatus.CONFIRMED]: 'Đã xác nhận',
    [OrderStatus.PREPARING]: 'Đang pha chế',
    [OrderStatus.READY]: 'Sẵn sàng phục vụ',
    [OrderStatus.COMPLETED]: 'Hoàn thành',
    [OrderStatus.CANCELLED]: 'Đã hủy',
};

const paymentStatusColors = {
    [PaymentStatus.UNPAID]: '#dc3545',
    [PaymentStatus.PARTIALLY_PAID]: '#ffc107',
    [PaymentStatus.PAID]: '#28a745',
    [PaymentStatus.REFUNDED]: '#17a2b8',
} as const;

const paymentStatusLabels = {
    [PaymentStatus.UNPAID]: 'Chưa thanh toán',
    [PaymentStatus.PARTIALLY_PAID]: 'Thanh toán một phần',
    [PaymentStatus.PAID]: 'Đã thanh toán',
    [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
};

const ITEMS_PER_PAGE = 5;

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewDetail,
  onStatusChange,
  onPaymentStatusChange,
}) => {
    const [page, setPage] = useState(1);

    const paginatedOrders = React.useMemo(() => {
     const startIndex = (page - 1) * ITEMS_PER_PAGE;
     const endIndex = page * ITEMS_PER_PAGE;
      return orders.slice(startIndex, endIndex);
    }, [orders, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };


  const renderItem = ({ item }: { item: Order }) => (
     <TouchableOpacity
        style={styles.row}
         onPress={() => onViewDetail(item)}
    >
        <View style={styles.cell}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
             <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
         <View style={styles.cell}>
             <Text style={styles.customerName}>{item.customerName}</Text>
            {item.customerPhone && (
                <Text style={styles.customerPhone}>{item.customerPhone}</Text>
            )}
        </View>
        <Text style={styles.tableCell}>{item.tableId || '-'}</Text>
         <View style={styles.cell}>
          <View style={[styles.chip, {backgroundColor: statusColors[item.status]}]}>
               <Text style={styles.chipText}>{statusLabels[item.status]}</Text>
            </View>
        </View>
          <View style={styles.cell}>
           <View style={[styles.chip, {backgroundColor: paymentStatusColors[item.paymentStatus]}]}>
               <Text style={styles.chipText}>{paymentStatusLabels[item.paymentStatus]}</Text>
            </View>
        </View>
       <Text style={styles.totalAmount}>{formatCurrency(item.totalAmount)}</Text>
        <View style={styles.actions}>
              <TouchableOpacity  onPress={() => onViewDetail(item)}>
               <Icon name="visibility" size={24} color="#007bff" />
             </TouchableOpacity>
        </View>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

     if (totalPages <= 1) {
      return null;
    }


    const renderPageNumbers = () => {
          const pageButtons = [];
        for (let i = 1; i <= totalPages; i++) {
          pageButtons.push(
            <TouchableOpacity
            key={i}
             style={[styles.pageButton, page === i && styles.activePageButton]}
             onPress={() => handlePageChange(i)}
         >
                <Text style={[styles.pageButtonText, page === i && styles.activePageButtonText]}>{i}</Text>
            </TouchableOpacity>
          )
        }

         return pageButtons
       }

    return (
         <View style={styles.paginationContainer}>
               {renderPageNumbers()}
           </View>
    );
  };



  return (
    <View style={styles.container}>
         <View style={styles.header}>
                 <Text style={styles.headerCell}>Mã đơn</Text>
                 <Text style={styles.headerCell}>Khách hàng</Text>
                 <Text style={styles.headerCell}>Bàn</Text>
                 <Text style={styles.headerCell}>Trạng thái</Text>
                 <Text style={styles.headerCell}>Thanh toán</Text>
                 <Text style={styles.headerCell}>Tổng tiền</Text>
                <Text style={styles.headerCell}>Thao tác</Text>
         </View>
        <FlatList
           data={paginatedOrders}
           renderItem={renderItem}
           keyExtractor={(item) => String(item.id)}
        />

        {renderPagination()}
      </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        margin: 10
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
         paddingVertical: 5,
        borderBottomWidth: 1,
         borderBottomColor: 'rgba(0, 123, 255, 0.1)',
    },
      cell: {
        flex: 1,
        paddingHorizontal: 5,
          textAlign: 'center',
    },
    orderNumber: {
         fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    orderDate: {
          fontFamily: 'Poppins-Light',
        fontSize: 12,
      color: 'gray'
    },
     customerName: {
        fontFamily: 'Poppins-Medium',
         fontSize: 14,
       flexWrap: 'wrap'
    },
    customerPhone: {
       fontFamily: 'Poppins-Light',
        fontSize: 12,
        color: 'gray'
    },
    tableCell: {
        fontFamily: 'Poppins-Medium',
         flex: 1,
        textAlign: 'center',
    },
      totalAmount: {
          flex: 1,
          fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
      textAlign: 'right',
      paddingRight: 10
     },
     actions: {
       flex: 0.5,
         alignItems: 'center',
     },
      chip: {
          paddingVertical: 5,
          paddingHorizontal: 8,
        borderRadius: 5,
          alignSelf: 'center'
    },
       chipText: {
        color: '#fff',
        fontFamily: 'Poppins-Medium',
    },
    paginationContainer: {
        flexDirection: 'row',
         justifyContent: 'center',
        padding: 10,
    },
      pageButton: {
        padding: 8,
        borderRadius: 5,
      marginHorizontal: 3,

    },
    activePageButton: {
       backgroundColor: '#007bff',
    },
      pageButtonText: {
      fontFamily: 'Poppins-Medium',
        color: '#333'
      },
      activePageButtonText: {
         color: '#fff'
      }

});

export default OrderList;