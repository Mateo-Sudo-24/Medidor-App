import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, deleteDoc, doc } from '@angular/fire/firestore';import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from './auth';

export interface Medicion {
  id?: string;
  userId: string;
  userName: string;
  valorMedidor: string;
  observaciones: string;
  fotoMedidor: string;
  fotoFachada: string;
  latitud: number;
  longitud: number;
  googleMapsUrl: string;
  fechaRegistro: any;
}

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor() { }

  async tomarFoto(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      
      return image.dataUrl || '';
    } catch (error) {
      console.error('Error al tomar foto:', error);
      throw error;
    }
  }

  async obtenerUbicacion(): Promise<{ latitud: number, longitud: number }> {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      return {
        latitud: coordinates.coords.latitude,
        longitud: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      throw error;
    }
  }

  generarGoogleMapsUrl(latitud: number, longitud: number): string {
    return `https://www.google.com/maps?q=${latitud},${longitud}`;
  }

  async guardarMedicion(medicion: Omit<Medicion, 'id' | 'userId' | 'userName' | 'fechaRegistro'>): Promise<any> {
    try {
      const user = this.authService.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      const medicionesRef = collection(this.firestore, 'Mediciones');
      
      const nuevaMedicion = {
        ...medicion,
        userId: user.uid,
        userName: user.displayName || user.email || 'Usuario',
        fechaRegistro: serverTimestamp()
      };

      const docRef = await addDoc(medicionesRef, nuevaMedicion);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Error al guardar medición:', error);
      return { success: false, error: error.message };
    }
  }

  async obtenerMedicionesUsuario(): Promise<Medicion[]> {
    try {
      const user = this.authService.currentUser;
      if (!user) return [];

      const medicionesRef = collection(this.firestore, 'Mediciones');
      const q = query(
        medicionesRef, 
        where('userId', '==', user.uid),
        orderBy('fechaRegistro', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const mediciones: Medicion[] = [];

      querySnapshot.forEach((doc) => {
        mediciones.push({
          id: doc.id,
          ...doc.data()
        } as Medicion);
      });

      return mediciones;
    } catch (error) {
      console.error('Error al obtener mediciones:', error);
      return [];
    }
  }

  async contarMedicionesUsuario(): Promise<number> {
    const mediciones = await this.obtenerMedicionesUsuario();
    return mediciones.length;
  }

  async obtenerTodasLasMediciones(): Promise<Medicion[]> {
  try {
    console.log('=== OBTENIENDO TODAS LAS MEDICIONES (ADMIN) ===');

    const medicionesRef = collection(this.firestore, 'Mediciones');
    const q = query(medicionesRef, orderBy('fechaRegistro', 'desc'));

    const querySnapshot = await getDocs(q);
    console.log('Total documentos encontrados:', querySnapshot.size);

    const mediciones: Medicion[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      mediciones.push({
        id: doc.id,
        userId: data['userId'],
        userName: data['userName'],
        valorMedidor: data['valorMedidor'],
        observaciones: data['observaciones'],
        fotoMedidor: data['fotoMedidor'],
        fotoFachada: data['fotoFachada'],
        latitud: data['latitud'],
        longitud: data['longitud'],
        googleMapsUrl: data['googleMapsUrl'],
        fechaRegistro: data['fechaRegistro']
      });
    });

    console.log('Total mediciones obtenidas:', mediciones.length);
    return mediciones;
  } catch (error) {
    console.error('Error al obtener todas las mediciones:', error);
    return [];
  }
}

async eliminarMedicion(medicionId: string): Promise<any> {
  try {
    const medicionDoc = doc(this.firestore, `Mediciones/${medicionId}`);
    await deleteDoc(medicionDoc);
    console.log('Medición eliminada:', medicionId);
    return { success: true };
  } catch (error: any) {
    console.error('Error al eliminar medición:', error);
    return { success: false, error: error.message };
  }
}
}