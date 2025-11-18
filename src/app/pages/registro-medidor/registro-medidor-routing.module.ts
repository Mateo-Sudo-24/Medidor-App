import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroMedidorPage } from './registro-medidor.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroMedidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroMedidorPageRoutingModule {}
