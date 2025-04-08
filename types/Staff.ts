export interface Staff {
  id?: number; 
  createdAt?: string; 
  updatedAt?: string; 
  name: string;       
  email: string;       
  phone_number: string; 
  role_id?: StaffPosition | null; 
  status?: StaffStatus;     
  meta?: StaffMeta;      
  member_id?: number;
  role?: Role;  
  shifts?: Shift[];   
  member?: Member;       
  position?: StaffPosition; 
  department?: Department; 
  startDate?: string | Date;
  userId?: string | number; 
  leaves?: LeaveRequest[];
}

export interface Member { 
  id: number;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  email: string;
  phone_number: string;
  gender: number;
  day_of_birth: string;
  token: string | null;
  name: string;
  status: number;
  first_login: string | null;
  meta: Record<string, unknown>;
}

export interface Role { 
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: number;
  description: string;
  meta: Record<string, unknown>; 
}

export enum StaffPosition {
  MANAGER = 1,
  SUPERVISOR = 2,
  BARISTA = 3,
  WAITER = 4,
  CASHIER = 5,
}

export enum Department {
  COFFEE_BAR = 1,
  KITCHEN = 2,
  SERVICE = 3,
  CASHIER = 4,
}

export enum StaffStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export interface WorkSchedule {
  id: number;
  staffId: number;
  date: Date;
  shift: Shift;
  status: ScheduleStatus;
  note?: string;
}

export enum ScheduleStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  ABSENT = 'absent',
  ON_LEAVE = 'on_leave',
}

export interface LeaveRequest {
  id: number;
  staffId: number;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  approvedBy?: number;
  approvedAt?: Date;
  note?: string;
}

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  PERSONAL = 'personal',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface ShiftAssignment {
  id: number;
  staffId: number;
  shiftId: number;
  date: Date;
  status: ShiftStatus;
  checkin?: Date;
  checkout?: Date;
  note?: string;
}

export enum ShiftStatus {
  PENDING = 'pending',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  MISSED = 'missed',
}

export interface PayrollRecord {
  id: number;
  staffId: number;
  month: number;
  year: number;
  workingDays: number;
  totalHours: number;
  overtime: number;

  bonus: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  note?: string;
}

export enum PayrollStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PAID = 'paid',
}

export interface Shift {
  id?: number; 
  employee_id: number;
  start_time: string; 
  end_time: string;   
  meta?: ShiftMeta;   
  createdAt?: string;
  updatedAt?: string;
  employee?: Staff; // Add the nested employee object (optional as it might not always be included)
}

export interface ShiftMeta {
  shiftId?: number;
  additionalData: {
    [key: string]: Record<string, unknown>;
  }
}

export interface ShiftSchedule {
  shiftId: number; 
  date: string;   
}

export interface StaffMeta {
  [key: string]: Record<string, unknown>; 
}