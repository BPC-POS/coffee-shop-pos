export interface InventoryItem {
  id: number;
  productId?: number;
  name: string;
  sku: string;
  category: InventoryCategory;
  unit: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  location: string;
  cost: number;
  supplier?: Supplier;
  lastRestocked?: Date;
  expiryDate?: Date;
  status: InventoryStatus;
  notes?: string;
}

export interface InventoryTransaction {
  id: number;
  itemId: number;
  type: TransactionType;
  quantity: number;
  date: Date;
  reason: string;
  performedBy: number;
  cost?: number;
  supplierId?: number;
  notes?: string;
}

export enum InventoryCategory {
  COFFEE_BEANS = 'coffee_beans',
  MILK = 'milk',
  SYRUP = 'syrup',
  TEA = 'tea',
  FOOD = 'food',
  PACKAGING = 'packaging',
  EQUIPMENT = 'equipment',
  OTHER = 'other',
}

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  EXPIRED = 'expired',
  DISCONTINUED = 'discontinued',
}

export enum TransactionType {
  PURCHASE = 'purchase',
  USAGE = 'usage',
  ADJUSTMENT = 'adjustment',
  WASTE = 'waste',
  RETURN = 'return',
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  orderDate: Date;
  expectedDelivery: Date;
  status: POStatus;
  items: POItem[];
  totalAmount: number;
  notes?: string;
}

export interface POItem {
  id: number;
  itemId: number;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export enum POStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  ORDERED = 'ordered',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
} 