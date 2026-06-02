# Documentación Técnica - EcoVision Smart City

## 📋 Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Base de Datos](#base-de-datos)
7. [Autenticación y Seguridad](#autenticación-y-seguridad)
8. [Funcionalidades Principales](#funcionalidades-principales)
9. [Configuración y Despliegue](#configuración-y-despliegue)
10. [API Reference](#api-reference)

---

## Resumen Ejecutivo

**EcoVision Smart City** es una plataforma inteligente de clasificación de residuos que integra:
- **Reconocimiento facial biométrico** para autenticación de usuarios
- **Clasificación de residuos mediante IA** (detección de plástico, cartón, vidrio, orgánico)
- **Sistema de mapeo** de puntos de reciclaje con geolocalización
- **Dashboard analítico** con métricas de reciclaje y estadísticas de usuario

### Problema que Resuelve
Facilita la gestión inteligente de residuos urbanos mediante tecnología de visión por computadora, permitiendo a los usuarios clasificar correctamente sus desechos y encontrar puntos de reciclaje cercanos.

### Usuarios Objetivo
- Ciudadanos comprometidos con el medio ambiente
- Instituciones educativas y empresas con programas de sostenibilidad
- Municipios que implementan sistemas de reciclaje inteligente

---

## Arquitectura del Sistema

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │     Auth     │  │  Dashboard   │      │
│  │     Page     │  │    Modals    │  │   (Usuario)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│          │                │                  │               │
│          └────────────────┴──────────────────┘               │
│                           │                                  │
│                           ▼                                  │
│              ┌─────────────────────────┐                    │
│              │  Context API (Auth)     │                    │
│              │  - Face Recognition     │                    │
│              │  - Manual Login         │                    │
│              └─────────────────────────┘                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API (Node.js/Express)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Routes    │  │ Controllers  │  │   Services   │      │
│  │              │→ │              │→ │              │      │
│  │ - Auth       │  │ - Auth       │  │ - Auth       │      │
│  │ - Users      │  │ - Users      │  │ - Prediction │      │
│  │ - Predictions│  │ - Predictions│  │ - Supabase   │      │
│  │ - Residuos   │  │ - Residuos   │  │ - Overpass   │      │
│  │ - Puntos     │  │ - Puntos     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                                      │             │
│         └──────────────────────────────────────┘             │
│                           │                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │          Middlewares & Utilities                   │     │
│  │  - JWT Auth        - Validators (Zod)              │     │
│  │  - Rate Limiting   - Face Recognition (Cosine)     │     │
│  │  - Sanitization    - Bcrypt                        │     │
│  │  - Error Handling  - Logger                        │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (PostgreSQL)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   usuarios   │  │  historial_  │  │   residuos   │      │
│  │              │  │ predicciones │  │   (catálogo) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   sesiones   │  │   puntos_    │                        │
│  │              │  │  reciclaje   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos Principal

1. **Usuario accede al sistema** → Landing Page (React)
2. **Autenticación biométrica o manual** → Frontend captura embedding facial o credenciales
3. **Validación en Backend** → Comparación coseno de embeddings / Bcrypt password
4. **JWT Token** → Almacenado en localStorage y Supabase
5. **Dashboard interactivo** → CRUD de predicciones, mapa de puntos de reciclaje
6. **Clasificación de residuos** → Captura de imagen → Hash visual → Categorización
7. **Persistencia** → Supabase PostgreSQL

---

## Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| Node.js | 18+ | Runtime JavaScript |
| Express.js | 4.18.2 | Framework web REST |
| Supabase JS | 2.49.1 | Cliente PostgreSQL BaaS |
| JWT | 9.0.2 | Autenticación stateless |
| Bcrypt | 5.1.1 | Hashing de contraseñas |
| Zod | 3.22.4 | Validación de esquemas |
| Helmet | 7.1.0 | Seguridad HTTP headers |
| CORS | 2.8.5 | Políticas de origen cruzado |
| Swagger | 6.2.8 | Documentación API |

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19.2.6 | Biblioteca UI |
| Vite | 8.0.12 | Build tool y dev server |
| TailwindCSS | 4.3.0 | Framework CSS utility-first |
| Framer Motion | 12.40.0 | Animaciones y transiciones |
| React Leaflet | 5.0.0 | Mapas interactivos |
| @vladmandic/face-api | 1.7.15 | Reconocimiento facial |
| @mediapipe/tasks-vision | 0.10.35 | Detección de landmarks faciales |

### Base de Datos
| Componente | Tecnología |
|-----------|-----------|
| DBMS | PostgreSQL (Supabase) |
| ORM | Supabase Client (queries nativas) |
| Migraciones | SQL directo (schema.sql) |
| Row Level Security | Habilitado |

### Infraestructura
| Servicio | Plataforma | URL |
|---------|-----------|-----|
| Backend API | Railway | `https://machine-learning-production-be9b.up.railway.app` |
| Frontend Web | Vercel | `https://machine-learning-pied.vercel.app` |
| Base de Datos | Supabase | `wishguhgzpjnhjgczucd.supabase.co` |

---

## Backend

### Estructura de Directorios

```
backend/
├── src/
│   ├── config/              # Configuración centralizada
│   │   ├── env.js          # Variables de entorno (Zod parsing)
│   │   ├── supabase.js     # Cliente Supabase
│   │   └── swagger.js      # Especificación OpenAPI
│   ├── controllers/         # Lógica de controladores REST
│   │   ├── auth.controller.js
│   │   ├── prediction.controller.js
│   │   ├── puntoReciclaje.controller.js
│   │   ├── recoleccion.controller.js
│   │   ├── residuo.controller.js
│   │   └── user.controller.js
│   ├── middlewares/         # Interceptores de request/response
│   │   ├── auth.middleware.js       # Validación JWT
│   │   ├── error.middleware.js      # Manejo de errores centralizado
│   │   ├── sanitize.middleware.js   # Limpieza de inputs
│   │   └── validate.middleware.js   # Validación con Zod
│   ├── repositories/        # Capa de acceso a datos
│   │   ├── prediction.repository.js
│   │   ├── puntoReciclaje.repository.js
│   │   ├── residuo.repository.js
│   │   ├── session.repository.js
│   │   └── user.repository.js
│   ├── routes/              # Definición de endpoints
│   │   ├── auth.routes.js
│   │   ├── prediction.routes.js
│   │   ├── puntoReciclaje.routes.js
│   │   ├── recoleccion.routes.js
│   │   ├── residuo.routes.js
│   │   ├── user.routes.js
│   │   └── index.js         # Router principal
│   ├── services/            # Lógica de negocio
│   │   ├── auth.service.js
│   │   ├── overpass.service.js      # Integración OpenStreetMap
│   │   ├── prediction.service.js
│   │   ├── puntoReciclaje.service.js
│   │   ├── session.service.js
│   │   ├── supabase.service.js
│   │   └── user.service.js
│   ├── types/               # Constantes y tipos
│   │   └── constants.js
│   ├── utils/               # Utilidades compartidas
│   │   ├── apiResponse.js
│   │   ├── bcrypt.js
│   │   ├── errors.js        # Errores personalizados
│   │   ├── faceRecognition.js  # Algoritmos de matching facial
│   │   ├── geo.js           # Cálculos geoespaciales
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   ├── sanitize.js
│   │   ├── supabaseDb.js
│   │   └── userMapper.js
│   ├── validators/          # Esquemas Zod
│   │   ├── auth.validator.js
│   │   ├── prediction.validator.js
│   │   ├── puntoReciclaje.validator.js
│   │   └── user.validator.js
│   ├── app.js              # Configuración Express
│   └── index.js            # Entry point
├── supabase/
│   ├── schema.sql          # Schema PostgreSQL
│   └── seed.mjs            # Datos iniciales
├── .env.example
├── package.json
└── README.md
```

### Capa de Servicios (Business Logic)

#### Auth Service (`auth.service.js`)
**Responsabilidades:**
- Registro y login manual (email/password)
- Registro y login facial (embedding comparison)
- Vinculación de métodos de autenticación (BOTH)
- Validación anti-duplicados faciales

**Algoritmo de Matching Facial:**
```javascript
// Similitud coseno entre embeddings
function compareFaceEmbeddings(embeddingA, embeddingB) {
  // Producto punto normalizado
  similarity = dot(A, B) / (||A|| * ||B||)
  // Rango: [-1, 1] donde 1 = idéntico
}

// Evaluación con umbral y margen anti-ambigüedad
function evaluateFaceMatch(embedding, users, threshold=0.95, margin=0.12) {
  1. Rankear todos los usuarios por similitud
  2. Verificar que best.similarity >= threshold (95%)
  3. Verificar margen: (best - second) >= margin (12%)
  4. Si ambas condiciones OK → ACCESO CONCEDIDO
  5. Sino → DENEGADO (log detallado)
}
```

**Thresholds configurables:**
- `FACE_SIMILARITY_THRESHOLD=0.95` → Umbral de aceptación (95% similitud mínima)
- `FACE_SIMILARITY_MARGIN=0.12` → Margen anti-ambigüedad (12% diferencia entre 1º y 2º)
- Registro duplicado: `DUPLICATE_THRESHOLD=0.85` (85% para evitar doble registro)

#### Prediction Service (`prediction.service.js`)
- Creación de predicciones de residuos
- Historial paginado por usuario
- Eliminación de predicciones

#### Punto Reciclaje Service (`puntoReciclaje.service.js`)
- Búsqueda por radio (lat/lng + km)
- Integración con OpenStreetMap Overpass API
- Cálculo de distancias geoespaciales (Haversine)

### Middlewares

#### Auth Middleware (`auth.middleware.js`)
```javascript
export const requireAuth = async (req, res, next) => {
  // 1. Extraer Bearer token del header Authorization
  // 2. Verificar JWT signature con JWT_SECRET
  // 3. Buscar sesión activa en DB (no expirada)
  // 4. Inyectar userId en req.userId
  // 5. Si falla → 401 Unauthorized
}
```

#### Validate Middleware (`validate.middleware.js`)
```javascript
export const validate = (schema) => async (req, res, next) => {
  // Zod schema validation
  // Si invalido → 400 Bad Request con detalles
}
```

#### Sanitize Middleware (`sanitize.middleware.js`)
```javascript
// Limpieza recursiva de strings en req.body/query/params
// Elimina caracteres peligrosos (XSS prevention)
```

### Endpoints Principales

#### Autenticación
```
POST   /api/auth/register/manual        # Registro email/password
POST   /api/auth/login/manual           # Login email/password
POST   /api/auth/register/face          # Registro facial
POST   /api/auth/login/face             # Login facial
GET    /api/auth/me                     # Obtener usuario autenticado
POST   /api/auth/link/manual            # Vincular email/password a cuenta existente
POST   /api/auth/link/face              # Vincular rostro a cuenta existente
```

#### Usuarios
```
GET    /api/users/:id                   # Perfil de usuario
PATCH  /api/users/:id                   # Actualizar perfil
DELETE /api/users/:id                   # Eliminar cuenta
```

#### Predicciones
```
POST   /api/predictions                 # Crear predicción de residuo
GET    /api/predictions/history         # Historial de predicciones (paginado)
DELETE /api/predictions/:id             # Eliminar predicción
```

#### Residuos (Catálogo)
```
GET    /api/residuos                    # Listar tipos de residuos
GET    /api/residuos/:id                # Detalle de residuo
```

#### Puntos de Reciclaje
```
GET    /api/puntos-reciclaje            # Buscar por radio (lat, lng, radio)
POST   /api/puntos-reciclaje            # Crear punto manualmente
```

---

## Frontend

### Estructura de Directorios

```
frontend/
├── src/
│   ├── assets/              # Imágenes estáticas
│   ├── components/
│   │   ├── auth/            # Modales de autenticación
│   │   │   ├── AuthModal.jsx
│   │   │   ├── FacialAuth.jsx
│   │   │   └── ManualAuth.jsx
│   │   ├── dashboard/       # Componentes del dashboard
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── PredictionHistory.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   └── WasteClassifier.jsx
│   │   ├── layout/          # Layout general
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   └── PollenCanvas.jsx  # Animación canvas
│   │   ├── recycling-map/   # Mapa de reciclaje
│   │   │   ├── RecyclingMap.jsx
│   │   │   └── MapMarkers.jsx
│   │   └── sections/        # Secciones landing page
│   │       ├── Hero.jsx
│   │       ├── Metodologia.jsx
│   │       ├── Impacto.jsx
│   │       ├── Vision.jsx
│   │       └── Metas.jsx
│   ├── constants/           # Constantes (filtros de residuos)
│   ├── context/             # Context API
│   │   ├── AuthContext.jsx  # Estado global de autenticación
│   │   └── ThemeContext.jsx # Estado global de tema
│   ├── hooks/               # Custom hooks
│   │   ├── useGeolocation.js
│   │   ├── usePollenCanvas.js
│   │   ├── usePuntosReciclaje.js
│   │   └── useScrollEffects.js
│   ├── lib/                 # Utilidades y servicios
│   │   ├── api.js           # Cliente HTTP (fetch wrapper)
│   │   ├── auth.js          # Funciones de autenticación
│   │   ├── faceEmbedding.js # Generación de embeddings faciales
│   │   ├── faceLandmarksMediaPipe.js  # MediaPipe integration
│   │   ├── geo.js           # Cálculos geoespaciales
│   │   ├── loadFaceModels.js
│   │   ├── predictions.js   # API de predicciones
│   │   ├── puntosReciclaje.js
│   │   ├── recyclingMetrics.js
│   │   ├── residuos.js
│   │   ├── speech.js        # Síntesis de voz
│   │   ├── supabase.js      # Cliente Supabase (opcional)
│   │   └── wasteClassifier.js  # Clasificador de residuos
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### Context API

#### AuthContext (`AuthContext.jsx`)
**Estado global:**
```javascript
{
  user: {
    id: string,
    nombre: string,
    email: string,
    avatarUrl: string,
    authMethod: 'MANUAL' | 'FACIAL' | 'BOTH',
    createdAt: string
  } | null,
  loading: boolean,
  loginWithSession: (token, userData) => void,
  logout: () => void,
  refreshUser: () => Promise<User | null>
}
```

**Persistencia:**
- Token JWT almacenado en `localStorage.ecovision_token`
- Refresh automático al montar la aplicación
- Logout limpia token y estado

### Componentes Clave

#### AuthModal
Modal de autenticación con dos modos:
- **Manual:** Email + Password
- **Facial:** Captura de webcam → Extracción de embedding → Envío al backend

**Flujo facial:**
```
1. Usuario hace clic en "Autenticar con Rostro"
2. Solicitar permiso de cámara (getUserMedia)
3. Detectar rostro con face-api.js
4. Extraer embedding de 128 dimensiones
5. POST /api/auth/login/face { facialEmbedding: [...] }
6. Backend compara con DB usando similitud coseno
7. Si match → JWT token → Dashboard
8. Sino → Mostrar error
```

#### WasteClassifier
Clasificador de residuos con captura de imagen:
- Modo cámara en vivo o subida de imagen
- Clasificación por hash visual (demo)
- Guardar predicción en historial
- Feedback visual (categoría, confianza, tiempo de latencia)

#### RecyclingMap
Mapa interactivo con React Leaflet:
- Geolocalización del usuario
- Marcadores de puntos de reciclaje cercanos
- Filtro por tipo de residuo
- Cálculo de distancia en tiempo real

### Librerías Especializadas

#### Face Recognition
```javascript
// lib/faceEmbedding.js
import * as faceapi from '@vladmandic/face-api';

export async function extractFaceEmbedding(imageOrVideo) {
  const detection = await faceapi
    .detectSingleFace(imageOrVideo)
    .withFaceLandmarks()
    .withFaceDescriptor();
  
  if (!detection) throw new Error('No se detectó un rostro');
  
  return Array.from(detection.descriptor); // 128 dimensiones
}
```

#### Waste Classification
```javascript
// lib/wasteClassifier.js
export async function classifyWasteImage(source) {
  // Modo demo: hash visual estable
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0, 224, 224);
  
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const hash = hashImageData(imageData);
  const idx = hash % TYPE_KEYS.length;
  
  return {
    type: WASTE_TYPES[TYPE_KEYS[idx]],
    confianza: 0.88 + (hash % 120) / 1000,
    demo: true
  };
}
```

---

## Base de Datos

### Modelo Entidad-Relación

```
┌─────────────────┐
│    usuarios     │
├─────────────────┤
│ id (PK)         │──┐
│ nombre          │  │
│ email (UNIQUE)  │  │
│ passwordHash    │  │  1:N
│ facialEmbedding │  ├────────────┐
│ authMethod      │  │            │
│ avatarUrl       │  │            ▼
│ createdAt       │  │  ┌──────────────────────┐
│ updatedAt       │  │  │ historial_pred       │
└─────────────────┘  │  ├──────────────────────┤
          │          │  │ id (PK)              │
          │          │  │ usuarioId (FK)       │
          │ 1:N      │  │ residuoDetectado     │
          ▼          │  │ categoria            │
┌─────────────────┐  │  │ confianza            │
│    sesiones     │  │  │ createdAt            │
├─────────────────┤  │  └──────────────────────┘
│ id (PK)         │  │
│ usuarioId (FK)  │◀─┘
│ token (UNIQUE)  │
│ expiresAt       │
│ createdAt       │
└─────────────────┘

┌─────────────────────┐
│      residuos       │
├─────────────────────┤
│ id (PK)             │
│ nombre              │
│ categoria (UNIQUE)  │
│ descripcion         │
│ colorTacho          │
└─────────────────────┘

┌──────────────────────┐
│  puntos_reciclaje    │
├──────────────────────┤
│ id (PK)              │
│ nombre               │
│ direccion            │
│ latitud              │
│ longitud             │
│ tipos_residuos       │
│ horario              │
│ activo               │
│ created_at           │
└──────────────────────┘
```

### Esquema de Tablas

#### usuarios
| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID generado por defecto |
| nombre | TEXT | NOT NULL | Nombre del usuario |
| email | TEXT | UNIQUE | Email (opcional si auth facial) |
| passwordHash | TEXT | | Bcrypt hash (NULL si solo facial) |
| facialEmbedding | JSONB | | Array de 128 floats (vector facial) |
| authMethod | AuthMethod | NOT NULL | MANUAL, FACIAL o BOTH |
| avatarUrl | TEXT | | URL de imagen de perfil |
| createdAt | TIMESTAMPTZ | NOT NULL | Fecha de registro |
| updatedAt | TIMESTAMPTZ | NOT NULL | Última modificación (trigger) |

**Enums:**
```sql
CREATE TYPE "AuthMethod" AS ENUM ('FACIAL', 'MANUAL', 'BOTH');
```

#### sesiones
| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| usuarioId | TEXT | FK → usuarios.id | Propietario de la sesión |
| token | TEXT | UNIQUE, NOT NULL | JWT token |
| expiresAt | TIMESTAMPTZ | NOT NULL | Fecha de expiración |
| createdAt | TIMESTAMPTZ | NOT NULL | Fecha de creación |

**Índices:**
- `sesiones_usuario_id_idx` → usuarioId
- `sesiones_token_idx` → token

#### historial_predicciones
| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| usuarioId | TEXT | FK → usuarios.id | Usuario que hizo la predicción |
| residuoDetectado | TEXT | NOT NULL | Nombre del residuo detectado |
| categoria | CategoriaResiduo | NOT NULL | PLASTICO, CARTON, VIDRIO, ORGANICO |
| confianza | DOUBLE PRECISION | CHECK (0–1) | Confianza del modelo |
| createdAt | TIMESTAMPTZ | NOT NULL | Timestamp de la predicción |

**Enums:**
```sql
CREATE TYPE "CategoriaResiduo" AS ENUM ('PLASTICO', 'CARTON', 'VIDRIO', 'ORGANICO');
```

**Índices:**
- `historial_usuario_id_idx` → usuarioId
- `historial_categoria_idx` → categoria
- `historial_created_at_idx` → createdAt DESC

#### residuos (Catálogo)
| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| nombre | TEXT | NOT NULL | Nombre del tipo de residuo |
| categoria | CategoriaResiduo | UNIQUE, NOT NULL | Categoría |
| descripcion | TEXT | NOT NULL | Descripción del residuo |
| colorTacho | TEXT | NOT NULL | Color del tacho de reciclaje |

#### puntos_reciclaje
| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY | Auto-incremental |
| nombre | VARCHAR(100) | NOT NULL | Nombre del punto |
| direccion | TEXT | | Dirección completa |
| latitud | DECIMAL(10,8) | NOT NULL | Coordenada latitud |
| longitud | DECIMAL(11,8) | NOT NULL | Coordenada longitud |
| tipos_residuos | TEXT | | Tipos aceptados (CSV) |
| horario | VARCHAR(100) | | Horario de atención |
| activo | BOOLEAN | DEFAULT TRUE | Estado del punto |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

### Row Level Security (RLS)

**Estado:** Habilitado en todas las tablas

**Políticas actuales:**
```sql
-- Residuos: lectura pública
CREATE POLICY "residuos_lectura_publica"
  ON residuos FOR SELECT
  USING (true);
```

**Nota:** El backend usa `service_role_key` que bypasea RLS. Las políticas son relevantes si el frontend accede directamente a Supabase (no es el caso actual).

---

## Autenticación y Seguridad

### Sistema de Autenticación Biométrica

#### Registro Facial
