import { inject, Injectable } from '@angular/core';
import { Post } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/posts.php';

  createPost(data: Partial<Post>) {
    return this.http.post(`${this.url}`, data);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}?user_id=${userId}`);
  }
}
