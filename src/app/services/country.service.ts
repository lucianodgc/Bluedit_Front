import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  public countries$: Observable<any[]>;

  constructor(private http: HttpClient) {
    this.countries$ = this.http.get<any[]>(`${environment.countryUrl}?fields=name,cca3,translations`).pipe(
      map(countries => {
        return countries.sort((a, b) => {
          const nameA = a.name?.translations?.spa?.common || a.name?.common || '';
          const nameB = b.name?.translations?.spa?.common || b.name?.common || '';
          
          return nameA.localeCompare(nameB);
        });
      }),
      shareReplay(1) 
    );
  }
}
