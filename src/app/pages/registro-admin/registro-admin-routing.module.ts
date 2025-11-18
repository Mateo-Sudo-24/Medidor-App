import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroAdminPage } from './registro-admin.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroAdminPageRoutingModule {}
