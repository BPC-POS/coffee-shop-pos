export interface Voucher {
  id: number;
  code: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface CreateVoucherDTO {
  code: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
} 