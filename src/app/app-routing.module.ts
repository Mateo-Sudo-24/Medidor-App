import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin-guard';
import { MedidorGuard } from './guards/medidor-guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'medidor',
    loadChildren: () => import('./pages/medidor/medidor.module').then( m => m.MedidorPageModule),
    canActivate: [MedidorGuard]
  },
  {
    path: 'registro-medidor',
    loadChildren: () => import('./pages/registro-medidor/registro-medidor.module').then( m => m.RegistroMedidorPageModule)
  },
  {
    path: 'registro-admin',
    loadChildren: () => import('./pages/registro-admin/registro-admin.module').then( m => m.RegistroAdminPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
