import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, RegisterRequest } from '../interfaces';
import { UpdatePasswordRequest } from '../interfaces/update-password-request';
import { UpdateUsernameRequest } from '../interfaces/update-username-request';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private http = inject(HttpClient);
  private url = environment.apiUrl + '/users';

  register(data: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/register.php`, data);
  }

  getProfileById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.url}/get_profile.php?id=${id}`);
  }

  updateProfile(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/update.php`, formData);
  }

  updatePassword(data: UpdatePasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/update_password.php`, data);
  }

  updateUsername(data: UpdateUsernameRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/update_username.php`, data);
  }

  deleteUser(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.url}/delete.php?id=${id}`);
  }
}