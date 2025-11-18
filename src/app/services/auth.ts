import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  
  currentUser: User | null = null;
  private userLoaded = new BehaviorSubject<boolean>(false);
  userLoaded$ = this.userLoaded.asObservable();

  constructor() {
    // Observar cambios en la autenticación
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUser = user;
      
      if (user) {
        // Usuario autenticado, verificar su rol
        const rol = await this.getUserRole();
        const currentPath = window.location.pathname;
        
        // Solo redirigir si está en home o página de registro
        if (currentPath === '/home' || currentPath === '/registro-medidor' || currentPath === '/') {
          if (rol === 'Administrador') {
            this.router.navigate(['/admin']);
          } else if (rol === 'Medidor') {
            this.router.navigate(['/medidor']);
          }
        }
      }
      
      this.userLoaded.next(true);
    });
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Obtener el rol del usuario desde Firestore
      const userDoc = doc(this.firestore, `Usuarios/${user.uid}`);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const rol = userData['rol'];
        
        // Redirigir según el rol
        if (rol === 'Administrador') {
          this.router.navigate(['/admin']);
        } else if (rol === 'Medidor') {
          this.router.navigate(['/medidor']);
        } else {
          throw new Error('Rol no reconocido');
        }
        
        return { success: true, rol };
      } else {
        throw new Error('Usuario no encontrado en la base de datos');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/home']);
  }

  async getUserRole(): Promise<string | null> {
    if (!this.currentUser) return null;
    
    try {
      const userDoc = doc(this.firestore, `Usuarios/${this.currentUser.uid}`);
      const userSnapshot = await getDoc(userDoc);
      
      if (userSnapshot.exists()) {
        return userSnapshot.data()['rol'];
      }
    } catch (error) {
      console.error('Error al obtener rol:', error);
    }
    return null;
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Error al enviar email:', error);
      return { success: false, error: error.message };
    }
  }

  async registrarMedidor(email: string, password: string, displayName: string) {
    try {
      // Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Actualizar el displayName
      await updateProfile(user, {
        displayName: displayName
      });

      // Crear documento en Firestore con rol Medidor
      const userDoc = doc(this.firestore, `Usuarios/${user.uid}`);
      await setDoc(userDoc, {
        uid: user.uid,
        email: email,
        displayName: displayName,
        rol: 'Medidor',
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { success: true, uid: user.uid };
    } catch (error: any) {
      console.error('Error al registrar medidor:', error);
      return { success: false, error: error.message };
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async registrarAdministrador(email: string, password: string, displayName: string) {
  try {
    // Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    // Actualizar el displayName
    await updateProfile(user, {
      displayName: displayName
    });

    // Crear documento en Firestore con rol Administrador
    const userDoc = doc(this.firestore, `Usuarios/${user.uid}`);
    await setDoc(userDoc, {
      uid: user.uid,
      email: email,
      displayName: displayName,
      rol: 'Administrador',
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, uid: user.uid };
  } catch (error: any) {
    console.error('Error al registrar administrador:', error);
    return { success: false, error: error.message };
  }
}
}