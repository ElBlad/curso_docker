# Containers

1. Crear un contenedor sin ejecutarlo
   
   `docker create <image_name>`

2. Correr un contenedor

   `docker run <image_name>`
   > Note: para correrlo en segundo plano (osea, sin bloquear la terminal, agregar `-d`)
   `docker run -d <image_name>`

3. borrar contenedor

   `docker rm <container>`

4. ver contenedores corriendo
   
   `docker ps`

# Volume
1. Crear un volumen

   `docker volume create mi-volumen`

2. Correr contenedor usando un volumen.

   `docker run -d -v mi-volumen:/Users/username/volume <image_name>`

# Networks

1. Crear una network

   `docker network create <network-name>`

2. Correr contenedor usando un network.
 
   `docker run -d --name database 
  --network <network-name> <image_name>`



# Db operations
1. Ver las tablas de la db.

`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`


2. Crear tabla users.
  ```
  CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    age INT CHECK (age >= 18),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
   );
  ```

# Dockerfile

1. Construir una imagen
   `docker build -t mi-app:version-tag .`

2. Dockerfile reserved words.
   > **FROM**: Define la imagen a usar.

   > **WORKDIR**: Define el nombre del folder actual (en la imagen), donde se ejecutan los sig pasos.

   > **COPY**: Copia archivos de la maquina local a la imagen.
   
   > **RUN**: Ejecuta comandos durante la construccion de la imagen.   

   > **CMD**: Comando por defecto que se corre al iniciar un contenedor.

   > **ENV**: Define variables de entorno.

   > **EXPOSE**: Define el puerto que el contenedor va a "escuchar".

