export interface Discount {
  id?: number;
  code: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  status: number;
  meta?: any | null;
  createdAt?: string;
  updatedAt?: string;
} 