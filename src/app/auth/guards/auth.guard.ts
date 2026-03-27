import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthCustomService } from '../service/auth-custom.service';

export const authGuard = () => {
  const auth = inject(AuthCustomService);
  const router = inject(Router);

  if (auth.isAuthenticated$.value) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
