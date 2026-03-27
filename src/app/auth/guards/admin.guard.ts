import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthCustomService } from '../service/auth-custom.service';

export const adminGuard = () => {
  const auth = inject(AuthCustomService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  router.navigate(['/drivers']);
  return false;
};
