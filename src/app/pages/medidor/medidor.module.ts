import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedidorPageRoutingModule } from './medidor-routing.module';

import { MedidorPage } from './medidor.page';

import { ImagenModalComponent } from '../../components/imagen-modal/imagen-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedidorPageRoutingModule
  ],
  declarations: [MedidorPage, ImagenModalComponent]
})
export class MedidorPageModule {}
