import { Staff, StaffPosition, Department, WorkSchedule, Shift, ScheduleStatus, LeaveRequest, LeaveType, LeaveStatus, ShiftAssignment, ShiftStatus } from '@/types/Staff';

export const mockStaff: Staff[] = [
  {
    id: 1,
    userId: 1,
    fullName: 'Nguyễn Văn A',
    position: StaffPosition.BARISTA,
    department: Department.COFFEE_BAR,
    startDate: new Date('2023-01-15'),
    salary: {
      base: 5000000,
      hourly: 30000,
      allowance: 500000,
    },
    schedule: [],
     leaves: [],
      shifts: [],
    
  },
  {
    id: 2,
    userId: 2,
    fullName: 'Trần Thị B',
       position: StaffPosition.WAITER,
    department: Department.SERVICE,
    startDate: new Date('2023-02-20'),
      salary: {
        base: 4500000,
        hourly: 25000,
        allowance: 300000,
      },
    schedule: [],
       leaves: [],
       shifts: [],

  },
    {
    id: 3,
        userId: 3,
      fullName: 'Lê Văn C',
      position: StaffPosition.CASHIER,
     department: Department.CASHIER,
    startDate: new Date('2023-03-10'),
        salary: {
        base: 5500000,
        hourly: 35000,
        allowance: 600000,
      },
      schedule: [],
         leaves: [],
         shifts: [],

  },
    {
    id: 4,
        userId: 4,
     fullName: 'Lý Thị D',
      position: StaffPosition.MANAGER,
    department: Department.SERVICE,
    startDate: new Date('2023-04-01'),
        salary: {
        base: 8000000,
        hourly: 50000,
        allowance: 1000000,
      },
      schedule: [],
       leaves: [],
        shifts: [],

  },
    {
      id: 5,
      userId: 5,
     fullName: 'Huỳnh Văn E',
        position: StaffPosition.SUPERVISOR,
    department: Department.KITCHEN,
      startDate: new Date('2023-05-05'),
        salary: {
        base: 6000000,
        hourly: 40000,
        allowance: 800000,
      },
      schedule: [],
      leaves: [],
        shifts: [],
    }
];

export const mockShifts: Shift[] = [
  { id: 1, name: 'Ca sáng', startTime: '07:00', endTime: '11:00', requiredStaff: 2 },
  { id: 2, name: 'Ca trưa', startTime: '11:00', endTime: '15:00', requiredStaff: 3 },
  { id: 3, name: 'Ca tối', startTime: '15:00', endTime: '22:00', requiredStaff: 2 },
];


export const mockWorkSchedules: WorkSchedule[] = [];
export const mockLeaveRequests: LeaveRequest[] = [];
export const mockShiftAssignments: ShiftAssignment[] = []