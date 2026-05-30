# EcoVision API — Ejemplos de requests y responses

Base URL: `http://localhost:3000/api`

Todas las respuestas exitosas:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {}
}
```

Errores:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

## Auth — Registro manual

**POST** `/auth/register`

```json
{
  "nombre": "María García",
  "email": "maria@ecovision.edu",
  "password": "MiClaveSegura123"
}
```

**201 Created**

```json
{
  "success": true,
  "message": "Registro exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "María García",
      "email": "maria@ecovision.edu",
      "authMethod": "MANUAL",
      "avatarUrl": null,
      "createdAt": "2025-05-30T12:00:00.000Z",
      "updatedAt": "2025-05-30T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-06-06T12:00:00.000Z"
  }
}
```

---

## Auth — Login manual

**POST** `/auth/login`

```json
{
  "email": "maria@ecovision.edu",
  "password": "MiClaveSegura123"
}
```

**200 OK** — misma estructura `data` que registro.

**401** — credenciales inválidas.

---

## Auth — Registro facial

**POST** `/auth/register-face`

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ecovision.edu",
  "facialEmbedding": [0.12, -0.34, 0.56, 0.78]
}
```

> En producción el embedding tendrá cientos de dimensiones (p. ej. 128 o 512 floats desde face-api / TensorFlow.js).

**201 Created**

```json
{
  "success": true,
  "message": "Registro facial exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "Juan Pérez",
      "email": "juan@ecovision.edu",
      "authMethod": "FACIAL",
      "avatarUrl": null,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJ...",
    "expiresAt": "..."
  }
}
```

**409** — rostro duplicado:

```json
{
  "success": false,
  "message": "Este rostro ya está registrado en el sistema. No se permiten duplicados."
}
```

---

## Auth — Login facial

**POST** `/auth/login-face`

```json
{
  "facialEmbedding": [0.11, -0.33, 0.55, 0.77]
}
```

**200 OK**

```json
{
  "success": true,
  "message": "Autenticación facial exitosa",
  "data": {
    "user": { "id": "uuid", "nombre": "Juan Pérez", "authMethod": "FACIAL" },
    "token": "eyJ...",
    "expiresAt": "...",
    "similarity": 0.92
  }
}
```

**403** — sin coincidencia ≥ umbral (0.85):

```json
{
  "success": false,
  "message": "Acceso denegado: no se encontró coincidencia facial con el umbral requerido"
}
```

---

## Auth — Usuario actual

**GET** `/auth/me`

Header: `Authorization: Bearer <token>`

```json
{
  "success": true,
  "message": "Usuario autenticado",
  "data": {
    "user": {
      "id": "uuid",
      "nombre": "María García",
      "email": "maria@ecovision.edu",
      "authMethod": "MANUAL",
      "avatarUrl": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

## Users — Perfil

**GET** `/users/profile` — requiere JWT.

**PUT** `/users/profile`

```json
{
  "nombre": "María G.",
  "avatarUrl": "https://ejemplo.com/avatar.png"
}
```

---

## Predictions — Guardar (desde TensorFlow.js)

**POST** `/predictions`

```json
{
  "residuoDetectado": "Botella PET transparente",
  "categoria": "PLASTICO",
  "confianza": 0.94
}
```

Categorías válidas: `PLASTICO`, `CARTON`, `VIDRIO`, `ORGANICO`.

**201 Created**

```json
{
  "success": true,
  "message": "Predicción guardada en el historial",
  "data": {
    "prediction": {
      "id": "uuid",
      "usuarioId": "uuid",
      "residuoDetectado": "Botella PET transparente",
      "categoria": "PLASTICO",
      "confianza": 0.94,
      "createdAt": "...",
      "residuoInfo": {
        "nombre": "Plástico",
        "categoria": "PLASTICO",
        "colorTacho": "#FFD700"
      }
    }
  }
}
```

---

## Predictions — Historial

**GET** `/predictions/history?limit=20&offset=0`

```json
{
  "success": true,
  "message": "Historial de predicciones",
  "data": {
    "items": [],
    "total": 0,
    "limit": 20,
    "offset": 0
  }
}
```

---

## Predictions — Eliminar

**DELETE** `/predictions/history/:id`

```json
{
  "success": true,
  "message": "Predicción eliminada del historial",
  "data": { "id": "uuid" }
}
```

---

## cURL rápido

```bash
# Health
curl http://localhost:3000/api/health

# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","password":"password123"}'

# Predicción (con token)
curl -X POST http://localhost:3000/api/predictions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"residuoDetectado":"Lata","categoria":"METAL","confianza":0.9}'
```

> Nota: `METAL` no es válido; usar solo las 4 categorías del enum.
