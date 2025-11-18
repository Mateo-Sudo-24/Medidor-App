import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MedicionesService, Medicion } from '../../services/mediciones';
import { AlertController, LoadingController } from '@ionic/angular';
import { ImagenModalComponent } from '../../components/imagen-modal/imagen-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-medidor',
  templateUrl: './medidor.page.html',
  styleUrls: ['./medidor.page.scss'],
  standalone: false
})
export class MedidorPage implements OnInit {
  userName: string = '';
  totalMediciones: number = 0;
  mediciones: Medicion[] = [];

  // Formulario
  valorMedidor: string = '';
  observaciones: string = '';
  fotoMedidor: string = '';
  fotoFachada: string = '';
  latitud: number = 0;
  longitud: number = 0;

  // Control de vista
  mostrarFormulario: boolean = true;

  constructor(
    private authService: AuthService,
    private medicionesService: MedicionesService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.userName = this.authService.currentUser?.displayName || 'Medidor';
    await this.cargarMediciones();
  }

  async cargarMediciones() {
    const loading = await this.loadingController.create({
      message: 'Cargando mediciones...',
    });
    await loading.present();

    this.mediciones = await this.medicionesService.obtenerMedicionesUsuario();
    this.totalMediciones = this.mediciones.length;

    await loading.dismiss();
  }

  toggleVista() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  async tomarFotoMedidor() {
    try {
      this.fotoMedidor = await this.medicionesService.tomarFoto();
    } catch (error) {
      this.showAlert('Error', 'No se pudo tomar la foto del medidor');
    }
  }

  async tomarFotoFachada() {
    try {
      this.fotoFachada = await this.medicionesService.tomarFoto();
    } catch (error) {
      this.showAlert('Error', 'No se pudo tomar la foto de la fachada');
    }
  }

  async obtenerUbicacion() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo ubicación...',
    });
    await loading.present();

    try {
      const ubicacion = await this.medicionesService.obtenerUbicacion();
      this.latitud = ubicacion.latitud;
      this.longitud = ubicacion.longitud;
      await loading.dismiss();
      this.showAlert('Ubicación obtenida', `Lat: ${this.latitud.toFixed(6)}, Lng: ${this.longitud.toFixed(6)}`);
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'No se pudo obtener la ubicación. Verifica los permisos de GPS');
    }
  }

  async guardarMedicion() {
    // Validaciones
    if (!this.valorMedidor) {
      this.showAlert('Error', 'Ingresa el valor del medidor');
      return;
    }

    if (!this.fotoMedidor) {
      this.showAlert('Error', 'Toma una foto del medidor');
      return;
    }

    if (!this.fotoFachada) {
      this.showAlert('Error', 'Toma una foto de la fachada');
      return;
    }

    if (!this.latitud || !this.longitud) {
      this.showAlert('Error', 'Obtén la ubicación GPS');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando medición...',
    });
    await loading.present();

    const googleMapsUrl = this.medicionesService.generarGoogleMapsUrl(this.latitud, this.longitud);

    const result = await this.medicionesService.guardarMedicion({
      valorMedidor: this.valorMedidor,
      observaciones: this.observaciones,
      fotoMedidor: this.fotoMedidor,
      fotoFachada: this.fotoFachada,
      latitud: this.latitud,
      longitud: this.longitud,
      googleMapsUrl: googleMapsUrl
    });

    await loading.dismiss();

    if (result.success) {
      this.showAlert('¡Éxito!', 'Medición guardada correctamente');
      this.limpiarFormulario();
      await this.cargarMediciones();
    } else {
      this.showAlert('Error', result.error || 'No se pudo guardar la medición');
    }
  }

  limpiarFormulario() {
    this.valorMedidor = '';
    this.observaciones = '';
    this.fotoMedidor = '';
    this.fotoFachada = '';
    this.latitud = 0;
    this.longitud = 0;
  }

  abrirGoogleMaps(url: string) {
    window.open(url, '_blank');
  }

  formatearFecha(timestamp: any): string {
    if (!timestamp) return 'Fecha no disponible';
    
    try {
      const fecha = timestamp.toDate();
      return fecha.toLocaleString('es-EC', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
  }

async verImagenCompleta(imagenUrl: string) {
  const modal = await this.modalController.create({
    component: ImagenModalComponent,
    componentProps: {
      imagenUrl: imagenUrl
    }
  });
  await modal.present();
}
}