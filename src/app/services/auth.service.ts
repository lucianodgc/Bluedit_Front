import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse, User } from '../interfaces';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private url = environment.apiUrl + '/users.php';

  currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string) {
      return this.http.post<ApiResponse>(`${this.url}?action=login`, { 
          email, 
          password 
      }).pipe(
        tap(response => {
          const { token, ...user } = response.data;
          this.saveSession(token, user);
        })
      );
    }

  saveSession(token: string, user: User ) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null && localStorage.getItem('token') !== null;
  }
}
