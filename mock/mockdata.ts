import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/Order';

export const mockOrders: Order[] = [
    {
        id: 1,
        orderNumber: 'OD-12345',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        tableId: 1,
        items: [
            { id: 1, productId: 1, productName: 'Cafe Đen', quantity: 2, price: 25000, note: 'Ít đường' },
            { id: 2, productId: 2, productName: 'Cafe Sữa', quantity: 1, price: 30000, note: '' },
        ],
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        paymentMethod: PaymentMethod.CASH,
        totalAmount: 80000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        orderNumber: 'OD-12346',
        customerName: 'Trần Thị B',
        customerPhone: '0901234568',
        tableId: 2,
        items: [
            { id: 3, productId: 3, productName: 'Trà Sữa', quantity: 2, price: 35000, note: '50% đường' },
        ],
        status: OrderStatus.PREPARING,
        paymentStatus: PaymentStatus.UNPAID,
        paymentMethod: PaymentMethod.CASH,
        totalAmount: 70000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 3,
        orderNumber: 'OD-12347',
        customerName: 'Lê Văn C',
        customerPhone: '0901234569',
        tableId: 3,
        items: [
            { id: 4, productId: 4, productName: 'Cappuccino', quantity: 1, price: 45000, note: 'Thêm shot espresso' },
            { id: 5, productId: 5, productName: 'Bánh Flan', quantity: 2, price: 25000, note: '' },
        ],
        status: OrderStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.MOMO,
        totalAmount: 95000,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];