import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthCustomService } from '../service/auth-custom.service';

export const creatorGuard = () => {
  const auth = inject(AuthCustomService);
  const router = inject(Router);

  if (auth.isCreator()) {
    return true;
  }

  router.navigate(['/drivers']);
  return false;
};