import app from './app.js';
import { env } from './config/env.js';
import { supabaseService } from './services/supabase.service.js';
import { logger } from './utils/logger.js';

function listen(appInstance, port) {
  return new Promise((resolve, reject) => {
    const server = appInstance.listen(port);
    server.once('listening', () => resolve(server));
    server.once('error', reject);
  });
}

async function start() {
  try {
    await supabaseService.ping();
    logger.info('Conexión a Supabase establecida');

    const server = await listen(app, env.PORT);

    logger.info(`EcoVision API escuchando en http://localhost:${env.PORT}`);
    logger.info(`Documentación Swagger: http://localhost:${env.PORT}/api/docs`);
    logger.info(`Umbral facial (cosine): ${env.FACE_SIMILARITY_THRESHOLD}`);
    logger.info(`Margen anti-ambigüedad facial: ${env.FACE_SIMILARITY_MARGIN}`);

    const shutdown = () => {
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      logger.error(
        `El puerto ${env.PORT} ya está en uso. Ejecuta: npm run free-port\n` +
          `Luego vuelve a: npm run dev`
      );
    } else {
      logger.error('No se pudo iniciar el servidor:', err.message);
      logger.error(
        'Verifica SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y tablas (supabase/schema.sql + seed.sql)'
      );
    }
    process.exitCode = 1;
  }
}

start();
