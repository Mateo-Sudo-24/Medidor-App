import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedidorPage } from './medidor.page';

const routes: Routes = [
  {
    path: '',
    component: MedidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedidorPageRoutingModule {}
