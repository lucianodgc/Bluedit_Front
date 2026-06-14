import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { VoteRequest } from '../interfaces/vote-request';

@Injectable({
  providedIn: 'root',
})
export class VoteService {

  private http = inject(HttpClient);
  private url = environment.apiUrl + '/votes.php';

  votePost(data: VoteRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.url}/votar.php`, data);
  }
}
