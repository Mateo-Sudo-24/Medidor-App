import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    const result = await this.authService.login(this.email, this.password);

    await loading.dismiss();

    if (!result.success) {
      this.showAlert('Error', result.error || 'Error al iniciar sesión');
    }
  }

  async recuperarContrasena() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      message: 'Ingresa tu email para recibir el enlace de recuperación',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'correo@ejemplo.com',
          value: this.email
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (!data.email) {
              this.showAlert('Error', 'Por favor ingresa un email válido');
              return false;
            }

            const loading = await this.loadingController.create({
              message: 'Enviando email...',
            });
            await loading.present();

            const result = await this.authService.resetPassword(data.email);

            await loading.dismiss();

            if (result.success) {
              this.showAlert('Éxito', 'Se ha enviado un email para recuperar tu contraseña');
            } else {
              this.showAlert('Error', result.error || 'No se pudo enviar el email');
            }
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}