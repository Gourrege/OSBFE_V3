export type AuthRole = 'viewer' | 'creator' | 'admin';

export interface AuthDriver {
    id: string;
    email : string;
    role: AuthRole;
}
