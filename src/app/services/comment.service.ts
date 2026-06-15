import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    private http = inject(HttpClient);
    private url = environment.apiUrl + "/comments";

    createComment(data: FormData): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.url}/create.php`, data);
    }

    getComments(currentUserId: number | null): Observable<ApiResponse> {
        let url = `${this.url}/get_all.php`

        if (currentUserId) {
            url += `?userId=${currentUserId}`;
        }
        return this.http.get<ApiResponse>(url);
    }

    getCommentsByPostId(postId: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.url}/get_all.php?postId=${postId}`);
    }

    getCommentsByUserId(userId: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.url}/get_all.php?userId=${userId}`);
    }

    deleteComment(commentId: number): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${this.url}/delete.php?commentId=${commentId}`);
    }
}