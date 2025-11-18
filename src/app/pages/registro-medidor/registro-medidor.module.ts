import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroMedidorPageRoutingModule } from './registro-medidor-routing.module';

import { RegistroMedidorPage } from './registro-medidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroMedidorPageRoutingModule
  ],
  declarations: [RegistroMedidorPage]
})
export class RegistroMedidorPageModule {}
