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

### 9. RUTAS DEL SISTEMA
Archivo: `src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'medidor',
    loadChildren: () => import('./pages/medidor/medidor.module').then(m => m.MedidorPageModule),
    canActivate: [MedidorGuard]
  },
  {
    path: 'registro-medidor',
    loadChildren: () => import('./pages/registro-medidor/registro-medidor.module')
  },
  {
    path: 'registro-admin',
    loadChildren: () => import('./pages/registro-admin/registro-admin.module'),
    canActivate: [AdminGuard]
  }
];
```

### 10. FUNCIONALIDADES IMPLEMENTADAS
#### 10.1 Autenticación
- Inicio de sesión con email y contraseña
- Cierre de sesión
- Recuperación de contraseña por email
- Persistencia de sesión entre recargas
- Redirección automática según rol

#### 10.2 Gestión de Usuarios
- Auto-registro de medidores
- Registro de administradores por admin
- Asignación automática de roles
- Almacenamiento en Firestore

#### 10.3 Registro de Mediciones
- Captura de valor del medidor
- Observaciones opcionales
- Fotografía del medidor (evidencia)
- Fotografía de la fachada
- Geolocalización GPS automática
- Generación de enlace a Google Maps
- Timestamp automático

#### 10.4 Visualización de Mediciones
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

#### 10.5 Geolocalización
- Obtención de coordenadas GPS
- Precisión de 6 decimales
- Generación automática de URL Google Maps
- Apertura de ubicación en nueva pestaña

#### 10.6 Manejo de Imágenes
- Captura con cámara del dispositivo
- Almacenamiento en formato base64
- Compresión a 60% de calidad
- Thumbnails en listados
- Vista completa en modal

### 11. CARACTERÍSTICAS TÉCNICAS
#### 11.1 Diseño Responsivo
- Adaptación a diferentes tamaños de pantalla
- Grid system de Ionic
- Componentes optimizados para móvil

#### 11.2 Manejo de Estados
- Loading indicators durante operaciones
- Mensajes de éxito y error
- Validaciones en formularios

#### 11.3 Optimizaciones
- Lazy loading de módulos
- Ordenamiento de queries en Firestore
- Índices compuestos para performance
- Imágenes comprimidas

#### 11.4 Seguridad
- Guards en rutas protegidas
- Reglas de seguridad en Firestore
- Validación de permisos por rol
- Autenticación requerida para todas las operaciones

### 12. COMANDOS DE DESARROLLO
- **Desarrollo Web**: `ionic serve`
- **Compilación**: `ionic build`
- **Sincronización con Capacitor**: `npx cap sync`
- **Abrir en Android Studio**: `npx cap open android`
- **Generar Página**: `ionic generate page pages/nombre-pagina`
- **Generar Servicio**: `ionic generate service services/nombre-servicio`
- **Generar Guard**: `ionic generate guard guards/nombre-guard`
- **Generar Componente**: `ionic generate component components/nombre-componente`

### 13. FLUJOS DE USUARIO
#### 13.1 Flujo de Registro - Medidor
1. Usuario accede a la página de login
2. Click en "Registrarse como Medidor"
3. Completa formulario de registro
4. Sistema crea usuario en Authentication
5. Sistema crea documento en colección Usuarios con rol "Medidor"
6. Redirección automática a panel de medidor

#### 13.2 Flujo de Login
1. Usuario ingresa email y contraseña
2. Sistema valida credenciales en Firebase Authentication
3. Sistema consulta rol en Firestore
4. Redirección según rol:
   - Administrador: `/admin`
   - Medidor: `/medidor`

#### 13.3 Flujo de Registro de Medición
1. Medidor accede a "Nueva Medición"
2. Ingresa valor del medidor
3. Ingresa observaciones (opcional)
4. Captura foto del medidor
5. Captura foto de la fachada
6. Obtiene ubicación GPS
7. Sistema genera URL de Google Maps
8. Guarda medición en Firestore
9. Actualiza contador de mediciones
10. Limpia formulario

#### 13.4 Flujo de Visualización - Medidor
1. Medidor cambia a pestaña "Mis Mediciones"
2. Sistema consulta mediciones del usuario
3. Muestra listado con acordeones
4. Usuario puede:
   - Expandir/colapsar acordeones
   - Ver imágenes completas
   - Abrir ubicación en Google Maps

#### 13.5 Flujo de Administración
1. Administrador accede a panel
2. Sistema carga todas las mediciones
3. Administrador puede:
   - Ver todas las mediciones
   - Identificar quien creó cada medición
   - Eliminar mediciones (con confirmación)
   - Registrar nuevos medidores
   - Registrar nuevos administradores

<div align="center">

### 14. ESTRUCTURA DE ARCHIVOS PRINCIPALES
```
src/
├── app/
│   ├── components/
│   │   └── imagen-modal/
│   ├── guards/
│   │   ├── admin.guard.ts
│   │   └── medidor.guard.ts
│   ├── home/
│   ├── pages/
│   │   ├── admin/
│   │   ├── medidor/
│   │   ├── registro-admin/
│   │   └── registro-medidor/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── mediciones.service.ts
│   ├── app-routing.module.ts
│   └── app.module.ts
├── environments/
│   └── environment.ts
└── global.scss
```

</div>

### 15. NOTAS FINALES
#### 15.1 Consideraciones de Despliegue
- Configurar reglas de producción en Firestore
- Actualizar `environment.prod.ts` con credenciales de producción
- Generar APK firmado para distribución
- Configurar permisos específicos según plataforma

#### 15.2 Mantenimiento
- Monitorear uso de Firebase
- Revisar logs de errores
- Actualizar dependencias periódicamente
- Backup regular de datos en Firestore
