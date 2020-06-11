export interface User {
  uid: string;
  firstname: string;
  lastname: string;
  email: string;
  tel?: number;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}