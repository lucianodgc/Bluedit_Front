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
  private url = environment.apiUrl + '/posts';

  createPost(data: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/create.php`, data);
  }

  deletePost(postId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.url}/delete.php?id=${postId}`);
  }

  getPosts(currentUserId: number | null): Observable<ApiResponse> {
    let url = `${this.url}/get_all.php`;
  
    if (currentUserId) {
      url += `?currentUserId=${currentUserId}`;
    }
    return this.http.get<ApiResponse>(url);
  }

  getPostsByUserId(userId: number, currentUserId: number | null): Observable<ApiResponse> {
    let url = `${this.url}/get_all.php?userId=${userId}`;
  
    if (currentUserId) {
      url += `&currentUserId=${currentUserId}`;
    }
    
    return this.http.get<ApiResponse>(url);
  }

  getPostsByVotes(currentUserId: number | null): Observable<ApiResponse> {
    let url = `${this.url}/get_by_votes.php`;
  
    if (currentUserId) {
      url += `?currentUserId=${currentUserId}`;
    }
    return this.http.get<ApiResponse>(url);
  }

  getPostById(id: number, currentUserId: number | null): Observable<ApiResponse> {
    let url = `${this.url}/get_post.php?id=${id}`;
  
    if (currentUserId) {
      url += `&currentUserId=${currentUserId}`;
    }
    return this.http.get<ApiResponse>(url);
  }
}
