import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

let isShowingAlert = false;

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
        isShowingAlert = true;
        authService.logout();
        Swal.fire({
          title: "Token Expirado",
          icon: "error",
          text: "Token expirado, por favor inicia sesion de nuevo.",
          confirmButtonText: "Entendido"
        }).then(() => {
          router.navigate(['/login']);
          isShowingAlert = false;
        })
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};
