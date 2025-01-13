export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  area: string;
  isActive: boolean;
  qrCode?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TableStatus {
  AVAILABLE = 'available',    // Bàn trống
  OCCUPIED = 'occupied',      // Có khách
  RESERVED = 'reserved',      // Đã đặt trước
  CLEANING = 'cleaning',      // Đang dọn dẹp
  MAINTENANCE = 'maintenance' // Đang bảo trì
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
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
} 