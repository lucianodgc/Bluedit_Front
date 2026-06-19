export interface UpdatePasswordRequest {
  id: number;
  currentPassword: string;
  newPassword?: string;
}