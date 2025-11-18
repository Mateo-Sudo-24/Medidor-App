import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { MedicionesService, Medicion } from '../../services/mediciones';
import { AlertController, LoadingController } from '@ionic/angular';
import { ImagenModalComponent } from '../../components/imagen-modal/imagen-modal.component';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false
})
export class AdminPage implements OnInit {
  userName: string = '';
  todasMediciones: Medicion[] = [];
  totalMediciones: number = 0;

  constructor(
    private authService: AuthService,
    private medicionesService: MedicionesService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    this.userName = this.authService.currentUser?.displayName || 'Administrador';
    await this.cargarTodasMediciones();
  }

  async ionViewWillEnter() {
    await this.cargarTodasMediciones();
  }

  async cargarTodasMediciones() {
    const loading = await this.loadingController.create({
      message: 'Cargando mediciones...',
    });
    await loading.present();

    this.todasMediciones = await this.medicionesService.obtenerTodasLasMediciones();
    this.totalMediciones = this.todasMediciones.length;

    await loading.dismiss();
  }

  async confirmarEliminar(medicion: Medicion) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar la medición de ${medicion.userName}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarMedicion(medicion.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarMedicion(medicionId: string) {
    const loading = await this.loadingController.create({
      message: 'Eliminando medición...',
    });
    await loading.present();

    const result = await this.medicionesService.eliminarMedicion(medicionId);

    await loading.dismiss();

    if (result.success) {
      this.showAlert('¡Éxito!', 'Medición eliminada correctamente');
      await this.cargarTodasMediciones();
    } else {
      this.showAlert('Error', result.error || 'No se pudo eliminar la medición');
    }
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