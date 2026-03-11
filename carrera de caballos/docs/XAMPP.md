# Configurar el juego con XAMPP (MySQL)

El servidor usa **MySQL** como base de datos. Con XAMPP es fácil tener MySQL y phpMyAdmin en tu PC.

## 1. Instalar XAMPP

1. Descarga XAMPP desde https://www.apachefriends.org/
2. Instala y abre el **Panel de Control**.
3. Inicia **Apache** y **MySQL** (botón Start).

## 2. Crear la base de datos

1. Abre el navegador y entra a **http://localhost/phpmyadmin**
2. Pulsa **Nueva** (o "New") para crear una base de datos.
3. Nombre: **carrera**
4. Cotejamiento: **utf8mb4_general_ci**
5. Clic en **Crear**.

## 3. Crear las tablas

1. En phpMyAdmin, selecciona la base de datos **carrera** (clic en el nombre a la izquierda).
2. Ve a la pestaña **SQL**.
3. Abre el archivo `server/src/db/schema-mysql.sql` del proyecto en un editor de texto.
4. Copia todo el contenido y pégalo en el cuadro SQL de phpMyAdmin.
5. Pulsa **Continuar** (o "Go").

Las tablas `users`, `rooms`, `room_players`, `point_transactions` y `point_purchases` quedarán creadas con índices para buen rendimiento.

**Si ya tenías la base de datos creada** con un esquema anterior, puedes ejecutar además `server/src/db/migration-add-indexes.sql` en la pestaña SQL para añadir índices (mejora el rendimiento).

## 4. Configurar el servidor Node

En la carpeta del proyecto:

1. Instala dependencias del servidor (si no lo has hecho):
   ```bash
   npm run install:server
   ```

2. Opcional: crea un archivo **.env** dentro de `server/` (puedes copiar `server/.env.example`). Por defecto el servidor usa:
   - **DB_HOST=localhost**
   - **DB_USER=root**
   - **DB_PASSWORD=** (vacío, típico en XAMPP)
   - **DB_NAME=carrera**

   Si en XAMPP tienes otra contraseña para `root`, ponla en `DB_PASSWORD`.

## 5. Arrancar el juego

Desde la raíz del proyecto:

```bash
npm start
```

Abre en el navegador: **http://localhost:3000**

Ya puedes registrarte, crear salas y jugar. Los datos se guardan en MySQL.

### Reglas del juego (guardadas en BD)

- **Registro**: la app asigna **1000 puntos** al usuario.
- **Salas**: **4 usuarios por sala**; la carrera solo inicia cuando hay 4 jugadores. Precio de entrada **variable (10–1000 puntos)**.
- **Premio**: si ganas, recibes **puntos apostados × 5**.
- **Comprar puntos**: paquete de **1000 puntos por $10.000 COP** (si se te acaban los puntos).
