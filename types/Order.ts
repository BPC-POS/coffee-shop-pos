export interface OrderAPI {
  id?: number;
  user_id: number; 
  member_id?: number; 
  order_date: Date | string;
  total_amount: number;
  discount: number;
  tax: number;
  status: OrderStatusAPI;
  payment_info: string;
  shipping_address: string;
  items: OrderItemAPI[];
  meta?: {
    table_id: number;
    payment_method?: number;
  }; 
  createdAt?: string; 
  updatedAt?: string; 
  orderItems?: OrderItemAPI[];
};

export enum OrderStatusAPI{
  PENDING = 6,        
  CONFIRMED = 1,    
  PREPARING = 2,     
  READY = 3,            
  COMPLETED = 4,     
  CANCELLED = 5      
};

export interface OrderItemAPI{
  id?: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  discount?: number;
  variant_id: number;
  meta?: Record<string, unknown>;
  product_name?: string;
  createdAt?: string; 
  updatedAt?: string;
  product?: ProductInOrderItemAPI;
}

export interface ProductInOrderItemAPI {
  id: number;
  createdAt: string; 
  updatedAt: string; 
  name: string;
  description: string | null;
  price: string; 
  sku: string;
  stock_quantity: number;
  status: number;
  avatar: string | null;
  meta: {
    recipes: Record<string, unknown>;
    image_id: string;
    extension: string;
    image_url: string;
  };
}

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
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
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