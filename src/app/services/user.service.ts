import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, RegisterRequest, User } from '../interfaces';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private http = inject(HttpClient);
  private url = environment.apiUrl + '/users.php';

  register(data: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}?action=register`, data);
  }

  getProfileById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.url}?action=profile&id=${id}`);
  }

  updateProfile(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}?action=update`, formData);
  }
}