import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-imagen-modal',
  templateUrl: './imagen-modal.component.html',
  styleUrls: ['./imagen-modal.component.scss'],
  standalone: false
})
export class ImagenModalComponent {
  @Input() imagenUrl: string = '';

  constructor(private modalController: ModalController) {}

  cerrar() {
    this.modalController.dismiss();
  }
}
