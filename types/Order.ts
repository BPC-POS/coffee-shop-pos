  export interface Order {
    id: number;
    orderNumber: string;
    customerName: string;
    customerPhone?: string;
    tableId?: number;
    items: OrderItem[];
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    totalAmount: number;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    note?: string;
  }

  export enum OrderStatus {
    PENDING = 'pending',         // Chờ xác nhận
    CONFIRMED = 'confirmed',     // Đã xác nhận
    PREPARING = 'preparing',     // Đang pha chế
    READY = 'ready',            // Sẵn sàng phục vụ
    COMPLETED = 'completed',     // Hoàn thành
    CANCELLED = 'cancelled'      // Đã hủy
  }

  export enum PaymentStatus {
    UNPAID = 'unpaid',          // Chưa thanh toán
    PARTIALLY_PAID = 'partial', // Thanh toán một phần
    PAID = 'paid',             // Đã thanh toán
    REFUNDED = 'refunded'      // Đã hoàn tiền
  }

  export enum PaymentMethod {
    CASH = 'cash',              // Tiền mặt
    CARD = 'card',              // Thẻ
    TRANSFER = 'transfer',      // Chuyển khoản
    MOMO = 'momo',             // Ví MoMo
    VNPAY = 'vnpay',           // VNPay
    ZALOPAY = 'zalopay'        // ZaloPay
  }

  export interface OrderFilter {
    search?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
    tableId?: number;
  }

  export interface OrderStats {
    totalOrders: number;
    totalAmount: number;
    byStatus: Record<OrderStatus, number>;
    byPayment: Record<PaymentStatus, number>;
  } 