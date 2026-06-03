import { inject, Injectable } from '@angular/core';
import { ApiResponse, Post } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/posts.php';

  createPost(data: Partial<Post>) : Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}`, data);
  }

  getPosts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.url);
  }

  getPostsByUserId(userId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.url}?user_id=${userId}`);
  }
}
