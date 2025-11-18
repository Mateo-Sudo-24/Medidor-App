import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { firstValueFrom } from 'rxjs';

export const MedidorGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperar a que se cargue el estado del usuario
  await firstValueFrom(authService.userLoaded$);

  const user = authService.currentUser;
  
  if (!user) {
    router.navigate(['/home']);
    return false;
  }

  const rol = await authService.getUserRole();
  
  if (rol === 'Medidor') {
    return true;
  } else {
    router.navigate(['/medidor']);
    return false;
  }
};