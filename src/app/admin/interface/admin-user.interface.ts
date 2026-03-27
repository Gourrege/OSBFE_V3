import { AuthRole } from '../../auth/interface/auth-driver';

export type AdminUserRole = AuthRole;
export type AdminUserStatus = 'active' | 'suspended';

export interface AdminUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  racingNumber?: number | null;
  nationality?: string;
  driverImage?: string;
  driverTeam?: string;
  driverDES?: string;
  wins?: number | null;
  podiums?: number | null;
  driverWC?: number | null;
  dob?: string | Date | null;
  dateJoined?: string | Date;
  lastUpdate?: string | Date;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  countsByRole: Record<AdminUserRole, number>;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  racingNumber?: number;
  nationality?: string;
  driverImage?: string;
  driverTeam?: string;
  driverDES?: string;
  wins?: number;
  podiums?: number;
  driverWC?: number;
  dob?: string;
}

export interface AdminUsersResponse {
  page: number;
  limit: number;
  total: number;
  users: AdminUser[];
}

export interface AdminActionResponse {
  message: string;
}

export interface AdminCreateUserResponse extends AdminActionResponse {
  user: AdminUser;
}
