import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.page.html',
  styleUrls: ['./registro-admin.page.scss'],
  standalone: false
})
export class RegistroAdminPage implements OnInit {
  displayName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async registrar() {
    if (!this.displayName || !this.email || !this.password || !this.confirmPassword) {
      this.showAlert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.showAlert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando administrador...',
    });
    await loading.present();

    const result = await this.authService.registrarAdministrador(
      this.email, 
      this.password, 
      this.displayName
    );

    await loading.dismiss();

    if (result.success) {
      const alert = await this.alertController.create({
        header: '¡Éxito!',
        message: `Administrador ${this.displayName} registrado correctamente`,
        buttons: [{
          text: 'OK',
          handler: () => {
            this.limpiarFormulario();
            this.navCtrl.back();
          }
        }]
      });
      await alert.present();
    } else {
      this.showAlert('Error', this.traducirError(result.error || 'Error al registrar'));
    }
  }

  limpiarFormulario() {
    this.displayName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  traducirError(error: string): string {
    if (error.includes('email-already-in-use')) {
      return 'Este email ya está registrado';
    }
    if (error.includes('invalid-email')) {
      return 'Email inválido';
    }
    if (error.includes('weak-password')) {
      return 'La contraseña es muy débil';
    }
    return error;
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