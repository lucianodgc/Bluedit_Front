import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const isMyApi = req.url.includes(environment.serverUrl); 

  let authReq = req;

  if (token && isMyApi) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isMyApi) {
        authService.logout();
        router.navigate(['/login']);
        alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      }
      return throwError(() => error);
    })
  );
};
