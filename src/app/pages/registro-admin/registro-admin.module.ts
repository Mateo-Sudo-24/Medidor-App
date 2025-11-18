import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroAdminPageRoutingModule } from './registro-admin-routing.module';

import { RegistroAdminPage } from './registro-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroAdminPageRoutingModule
  ],
  declarations: [RegistroAdminPage]
})
export class RegistroAdminPageModule {}
