## SISTEMA DE MEDICIONES DE AGUA - QUITO

### 1. INFORMACIÓN DEL PROYECTO
- **Nombre**: Sistema de Mediciones de Agua - Distrito de Quito
- **Tecnologías**: Ionic Framework, Angular, Firebase (Authentication, Firestore)
- **Plataforma**: Web y Móvil (Android)

### 2. ARQUITECTURA DEL SISTEMA
#### 2.1 Estructura de Usuarios
El sistema cuenta con dos roles de usuario:
- **Administrador**: Acceso completo al sistema, visualización de todas las mediciones, gestión de usuarios.
- **Medidor**: Registro de mediciones y visualización de sus propios registros.

#### 2.2 Tecnologías Implementadas
- Framework: Ionic 7 con Angular
- Base de datos: Firebase Firestore
- Autenticación: Firebase Authentication
- Cámara: @capacitor/camera
- Geolocalización: @capacitor/geolocation
- Almacenamiento: @capacitor/filesystem
- Preferencias: @capacitor/preferences

### 3. INSTALACIÓN Y CONFIGURACIÓN
#### 3.1 Dependencias Instaladas
Ejecuta los siguientes comandos en orden para instalar las dependencias necesarias:

```bash
npm install @angular/fire
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/geolocation
npm install @capacitor/preferences
npm install firebase
```

#### 3.2 Configuración de Firebase
Archivo: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyD_example_api_key_1234567890",
    authDomain: "mediciones-agua-quito.firebaseapp.com",
    projectId: "mediciones-agua-quito",
    storageBucket: "mediciones-agua-quito.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
  }
};
```

#### 3.3 Configuración de Permisos Android
Archivo: `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### 4. ESTRUCTURA DE LA BASE DE DATOS
#### 4.1 Colección: Usuarios
```
Usuarios/
  └── {uid}
      ├── uid: string
      ├── email: string
      ├── displayName: string
      ├── rol: string ("Administrador" | "Medidor")
      ├── emailVerified: boolean
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

#### 4.2 Colección: Mediciones
```
Mediciones/
  └── {medicionId}
      ├── userId: string
      ├── userName: string
      ├── valorMedidor: string
      ├── observaciones: string
      ├── fotoMedidor: string (base64)
      ├── fotoFachada: string (base64)
      ├── latitud: number
      ├── longitud: number
      ├── googleMapsUrl: string
      └── fechaRegistro: timestamp
```

#### 4.3 Reglas de Seguridad Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Usuarios/{userId} {
      allow read, write: if request.auth != null;
    }
    
    match /Mediciones/{medicionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

#### 4.4 Índice Compuesto Requerido
- Colección: Mediciones
- Campos:
  - userId (Ascendente)
  - fechaRegistro (Descendente)

### 5. SERVICIOS IMPLEMENTADOS
#### 5.1 AuthService
Ubicación: `src/app/services/auth.service.ts`

Métodos principales:
- `login(email: string, password: string)` - Inicio de sesión con redirección según rol
- `logout()` - Cierre de sesión
- `getUserRole()` - Obtención del rol del usuario actual
- `resetPassword(email: string)` - Recuperación de contraseña
- `registrarMedidor(email, password, displayName)` - Registro de nuevo medidor
- `registrarAdministrador(email, password, displayName)` - Registro de nuevo administrador
- `isAuthenticated()` - Verificación de estado de autenticación

#### 5.2 MedicionesService
Ubicación: `src/app/services/mediciones.service.ts`

Métodos principales:
- `tomarFoto()` - Captura de fotografía con cámara del dispositivo
- `obtenerUbicacion()` - Obtención de coordenadas GPS
- `generarGoogleMapsUrl(latitud, longitud)` - Generación de URL de Google Maps
- `guardarMedicion(medicion)` - Guardado de medición en Firestore
- `obtenerMedicionesUsuario()` - Obtención de mediciones del usuario actual
- `obtenerTodasLasMediciones()` - Obtención de todas las mediciones (Admin)
- `eliminarMedicion(medicionId)` - Eliminación de medición
- `contarMedicionesUsuario()` - Conteo de mediciones del usuario

### 6. GUARDS DE NAVEGACIÓN
#### 6.1 AdminGuard
Ubicación: `src/app/guards/admin.guard.ts`

Protege rutas que solo pueden ser accedidas por usuarios con rol "Administrador".

#### 6.2 MedidorGuard
Ubicación: `src/app/guards/medidor.guard.ts`

Protege rutas que solo pueden ser accedidas por usuarios con rol "Medidor".

### 7. PÁGINAS DEL SISTEMA
#### 7.1 Home (Login)
- Ruta: `/home`
- Archivo: `src/app/home/`

Funcionalidades:
- Formulario de inicio de sesión
- Recuperación de contraseña
- Enlace a registro de medidor
- Redirección automática según rol

#### 7.2 Registro de Medidor
- Ruta: `/registro-medidor`
- Archivo: `src/app/pages/registro-medidor/`

Funcionalidades:
- Registro de nuevos usuarios con rol "Medidor"
- Validación de contraseñas
- Creación automática de documento en Firestore
- Acceso público (sin guard)

#### 7.3 Registro de Administrador
- Ruta: `/registro-admin`
- Archivo: `src/app/pages/registro-admin/`
- Guard: AdminGuard

Funcionalidades:
- Registro de nuevos administradores
- Solo accesible por administradores existentes
- Validación de datos
- Creación de usuario con rol "Administrador"

#### 7.4 Panel de Medidor
- Ruta: `/medidor`
- Archivo: `src/app/pages/medidor/`
- Guard: MedidorGuard

Funcionalidades:
- **Vista: Nueva Medición**
  - Captura de valor del medidor
  - Campo de observaciones
  - Captura de foto del medidor
  - Captura de foto de la fachada
  - Obtención de ubicación GPS
  - Guardado de medición completa
- **Vista: Mis Mediciones**
  - Listado de mediciones propias
  - Visualización con acordeones
  - Información completa de cada medición
  - Enlace a Google Maps
  - Visualización de imágenes en modal
  - Contador de mediciones realizadas

#### 7.5 Panel de Administrador
- Ruta: `/admin`
- Archivo: `src/app/pages/admin/`
- Guard: AdminGuard

Funcionalidades:
- Visualización de todas las mediciones del sistema
- Identificación del usuario que realizó cada medición
- Eliminación de mediciones con confirmación
- Acceso a registro de medidores
- Acceso a registro de administradores
- Contador total de mediciones
- Visualización de imágenes en modal

### 8. COMPONENTES AUXILIARES
#### 8.1 ImagenModalComponent
Ubicación: `src/app/components/imagen-modal/`

Funcionalidad:
- Visualización de imágenes en pantalla completa
- Cierre con botón específico
- Adaptación responsive

### 9. FUNCIONALIDADES IMPLEMENTADAS
#### Autenticación
- Inicio de sesión con email y contraseña
- Cierre de sesión
- Recuperación de contraseña por email
- Persistencia de sesión entre recargas
- Redirección automática según rol

#### Gestión de Usuarios
- Auto-registro de medidores
- Registro de administradores por admin
- Asignación automática de roles
- Almacenamiento en Firestore

#### Registro de Mediciones
- Captura de valor del medidor
- Observaciones opcionales
- Fotografía del medidor (evidencia)
- Fotografía de la fachada
- Geolocalización GPS automática
- Generación de enlace a Google Maps
- Timestamp automático

#### Visualización de Mediciones
- **Para Medidores:**
  - Listado de mediciones propias
  - Ordenadas por fecha descendente
  - Vista compacta con acordeones
  - Imágenes optimizadas (120px altura)
  - Modal para ver imagen completa
- **Para Administradores:**
  - Todas las mediciones del sistema
  - Identificación de usuario creador
  - Capacidad de eliminación
  - Confirmación antes de eliminar
  - Mismas características de visualización

#### 1Geolocalización
- Obtención de coordenadas GPS
- Precisión de 6 decimales
- Generación automática de URL Google Maps
- Apertura de ubicación en nueva pestaña

#### Manejo de Imágenes
- Captura con cámara del dispositivo
- Almacenamiento en formato base64
- Compresión a 60% de calidad
- Thumbnails en listados
- Vista completa en modal


