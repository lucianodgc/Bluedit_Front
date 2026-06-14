import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/posts.php';

  createPost(data: FormData) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}`, data);
  }

  getPosts(currentUserId: number | null): Observable<ApiResponse> {
    let url = this.url;
  
    if (currentUserId) {
      url += `?currentUserId=${currentUserId}`;
    }
    return this.http.get<ApiResponse>(url);
  }

  getPostsByUserId(userId: number, currentUserId: number | null): Observable<ApiResponse> {
    let url = `${this.url}?userId=${userId}`;
  
    if (currentUserId) {
      url += `?currentUserId=${currentUserId}`;
    }
    
    return this.http.get<ApiResponse>(url);
  }
}
