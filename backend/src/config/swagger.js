import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcoVision Smart City API',
      version: '1.0.0',
      description:
        'API backend para autenticación (manual y facial), gestión de usuarios e historial de predicciones de residuos. La IA corre en el frontend con TensorFlow.js.',
      contact: {
        name: 'EcoVision Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: 'Desarrollo local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiSuccess: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        RegisterManual: {
          type: 'object',
          required: ['nombre', 'email', 'password'],
          properties: {
            nombre: { type: 'string', example: 'María García' },
            email: { type: 'string', format: 'email', example: 'maria@ecovision.edu' },
            password: { type: 'string', minLength: 8, example: 'MiClave123!' },
          },
        },
        LoginManual: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        RegisterFace: {
          type: 'object',
          required: ['nombre', 'facialEmbedding'],
          properties: {
            nombre: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', nullable: true },
            facialEmbedding: {
              type: 'array',
              items: { type: 'number' },
              description: 'Vector de embedding facial desde TensorFlow.js / face-api',
              example: [0.12, -0.34, 0.56],
            },
          },
        },
        LoginFace: {
          type: 'object',
          required: ['facialEmbedding'],
          properties: {
            facialEmbedding: {
              type: 'array',
              items: { type: 'number' },
            },
          },
        },
        CreatePrediction: {
          type: 'object',
          required: ['residuoDetectado', 'categoria', 'confianza'],
          properties: {
            residuoDetectado: { type: 'string', example: 'Botella PET' },
            categoria: {
              type: 'string',
              enum: ['PLASTICO', 'CARTON', 'VIDRIO', 'ORGANICO'],
            },
            confianza: { type: 'number', minimum: 0, maximum: 1, example: 0.94 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registro manual (email y contraseña)',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/RegisterManual' } },
            },
          },
          responses: {
            201: { description: 'Usuario registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccess' } } } },
            409: { description: 'Email ya registrado' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login manual',
          security: [],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginManual' } } },
          },
          responses: { 200: { description: 'JWT emitido' } },
        },
      },
      '/auth/register-face': {
        post: {
          tags: ['Auth'],
          summary: 'Registro con embedding facial',
          security: [],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterFace' } } },
          },
          responses: { 201: { description: 'Usuario facial registrado' }, 409: { description: 'Rostro duplicado' } },
        },
      },
      '/auth/login-face': {
        post: {
          tags: ['Auth'],
          summary: 'Login facial (cosine similarity ≥ umbral)',
          security: [],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginFace' } } },
          },
          responses: { 200: { description: 'Autenticado' }, 403: { description: 'Acceso denegado' } },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Usuario autenticado actual',
          responses: { 200: { description: 'Perfil del token' } },
        },
      },
      '/users/profile': {
        get: {
          tags: ['Users'],
          summary: 'Obtener perfil',
          responses: { 200: { description: 'Perfil del usuario' } },
        },
        put: {
          tags: ['Users'],
          summary: 'Actualizar perfil',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string' },
                    email: { type: 'string' },
                    avatarUrl: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Perfil actualizado' } },
        },
      },
      '/predictions': {
        post: {
          tags: ['Predictions'],
          summary: 'Guardar predicción del frontend (TensorFlow.js)',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePrediction' } } },
          },
          responses: { 201: { description: 'Predicción guardada' } },
        },
      },
      '/predictions/history': {
        get: {
          tags: ['Predictions'],
          summary: 'Historial de predicciones del usuario',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
          ],
          responses: { 200: { description: 'Lista paginada' } },
        },
      },
      '/predictions/history/{id}': {
        delete: {
          tags: ['Predictions'],
          summary: 'Eliminar entrada del historial',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Eliminado' }, 404: { description: 'No encontrado' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
