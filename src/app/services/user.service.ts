import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, RegisterRequest } from '../interfaces';


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
    return this.http.get<ApiResponse>(`${this.url}/profile.php?id=${id}`);
  }

  updateProfile(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/update.php`, formData);
  }
}