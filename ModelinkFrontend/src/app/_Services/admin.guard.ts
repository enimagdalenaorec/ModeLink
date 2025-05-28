import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  if (userRole === 'admin') {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};

// to prevent admins from accessing non-admin routes
export const nonAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  if (userRole === 'admin') {
    router.navigate(['/admin']);
    return false;
  }
  return true;
};
