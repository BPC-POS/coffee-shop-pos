export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CASHIER = 'cashier',
  WAITER = 'waiter',
  CUSTOMER = 'customer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending'
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  email?: string;
  fullName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilter {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface Member {
  id: number;
  createdAt: string;
  updatedAt: string;
  avatar: null;
  email: string;
  phone_number: string;
  gender: number; 
  day_of_birth: string;
  token: null; 
  name: string;
  status: number; 
  first_login: null;
  meta: null;
  employees?: Employee[]; 
}

export interface Employee {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone_number: string;
  role_id: number;
  status: number;
  meta: null;
  member_id: number;
}

export interface Role {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  status: number; 
  description: string;
  meta: Record<string, any>;
}