export interface Coupon {
  id?: number;
  code: string;
  description: string;
  discount_amount: number;
  discount_percentage: number;
  max_usage: number;
  used_count: number;
  start_date: string;
  end_date: string;
  status: number;
  meta?: any | null;
  createdAt?: string;
  updatedAt?: string;
} 