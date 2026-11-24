Para ejecutar el entorno localmente:

# UI
Open UI in `http://localhost:8080`.

# API
1. First initialize DB.
`docker run --name postgres-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mydb -p 5432:5432 -d postgres:14.24-alpine3.23`

2. Then run the server
`npm run dev`

3. Then update the DB if the container is new.
`npm run db:seed:dev`
    > wait for the 'Database schema is ready and seed data has been inserted.' message.

La UI usa `/api` como ruta relativa para que las peticiones sean same-origin y
no dependan de CORS. En desarrollo, Vite reenvia `/api` a
`http://localhost:3000`; con Docker Compose, Nginx reenvia la misma ruta al
servicio `api`.

Para desarrollo local, ejecuta la API en el puerto 3000 y la UI en el 5173.
Si la API escucha en otro destino, configura `API_PROXY_TARGET` en `ui/.env`.

Con Compose, abre la UI en `http://localhost:8080`.

## Report once playwright continer stopped
npx playwright show-report artifacts/playwright-report