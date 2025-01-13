export interface Staff {
  id: number;
  userId: number;
  fullName: string;
  position: StaffPosition;
  department: Department;
  startDate: Date;
  salary: {
    base: number;
    hourly: number;
    allowance: number;
  };
  schedule: WorkSchedule[];
  leaves: LeaveRequest[];
  shifts: ShiftAssignment[];
}

export enum StaffPosition {
  MANAGER = 'manager',
  SUPERVISOR = 'supervisor',
  BARISTA = 'barista',
  WAITER = 'waiter',
  CASHIER = 'cashier',
}

export enum Department {
  COFFEE_BAR = 'coffee_bar',
  KITCHEN = 'kitchen',
  SERVICE = 'service',
  CASHIER = 'cashier',
}

export interface WorkSchedule {
  id: number;
  staffId: number;
  date: Date;
  shift: Shift;
  status: ScheduleStatus;
  note?: string;
}

export interface Shift {
  id: number;
  name: string;
  startTime: string; // Format: "HH:mm"
  endTime: string;
  requiredStaff: number;
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
  baseSalary: number;
  allowance: number;
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
