import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { inject } from '@angular/core';

export const profileGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();
  
  const profileIdInUrl = Number(route.paramMap.get('id'));

  if (currentUser && currentUser.id === profileIdInUrl) {
    return true;
  }

  router.navigate(['/feed']); 
  return false;
};
