import { Table, TableArea, TableStatus } from '@/types/Table';

export const mockTable: Table[] = [
    { id: 1, area: '2', name: 'Bàn 1', capacity: 4, status: TableStatus.AVAILABLE, isActive: true, createdAt: new Date, updatedAt: new Date},
    { id: 2, area: '2', name: 'Bàn 2', capacity: 6, status: TableStatus.OCCUPIED, isActive: true, createdAt: new Date, updatedAt: new Date},
    { id: 3, area: '3', name: 'Bàn 3', capacity: 2, status: TableStatus.RESERVED, isActive: true, createdAt: new Date, updatedAt: new Date},
    { id: 4, area: '4', name: 'Bàn 4', capacity: 4, status: TableStatus.AVAILABLE, isActive: true, createdAt: new Date, updatedAt: new Date},
]