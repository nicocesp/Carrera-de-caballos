/**
 * Crea las tablas en MySQL (ejecutar una vez después de crear la base de datos en phpMyAdmin).
 * Uso: npm run init-db
 */
const { runSchema } = require('./database');

runSchema()
  .then(() => {
    console.log('Tablas creadas correctamente en MySQL.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error al crear tablas:', err.message);
    process.exit(1);
  });
