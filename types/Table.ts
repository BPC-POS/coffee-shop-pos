export interface Table {
  areaId: number;
  meta: Record<string, unknown>;
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  area: TableArea; 
  isActive: boolean;
  qrCode?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance'
}

export interface CreateTableDTO {
  name: string;
  capacity: number;
  area: string; 
  isActive: boolean;
  note?: string;
}

export interface UpdateTableDTO extends Partial<CreateTableDTO> {
  id: number;
  status?: TableStatus;
}

export interface TableArea {
  code: "indoor" | "outdoor" | "vip";
  id: string; 
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateTableAreaDTO {
  name: string;
  description?: string;
  isActive: boolean;
}

export const numericStatusToTableStatus = {
  1: TableStatus.AVAILABLE,   // Ví dụ: 1 là "Trống" (AVAILABLE)
  2: TableStatus.OCCUPIED,    // Ví dụ: 2 là "Có khách" (OCCUPIED)
  3: TableStatus.RESERVED,    // Ví dụ: 3 là "Đã đặt" (RESERVED)
  4: TableStatus.CLEANING,    // Ví dụ: 4 là "Đang dọn" (CLEANING)
  5: TableStatus.MAINTENANCE, // Ví dụ: 5 là "Bảo trì" (MAINTENANCE)
} as const;

export const tableStatusToNumericStatus = {
  [TableStatus.AVAILABLE]: 1,   // "Trống" (AVAILABLE) là 1
  [TableStatus.OCCUPIED]: 2,    // "Có khách" (OCCUPIED) là 2
  [TableStatus.RESERVED]: 3,    // "Đã đặt" (RESERVED) là 3
  [TableStatus.CLEANING]: 4,    // "Đang dọn" (CLEANING) là 4
  [TableStatus.MAINTENANCE]: 5, // "Bảo trì" (MAINTENANCE) là 5
} as const;