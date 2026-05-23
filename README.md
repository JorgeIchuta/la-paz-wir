# La Paz Wir

Juego 2D de accion lateral en HTML, CSS y JavaScript.

## Requisitos

- Node.js 18 o superior.

Verificar instalacion:

```bash
node --version
```

## Instalar Dependencias

El proyecto no usa paquetes externos por ahora, asi que no hace falta ejecutar `npm install`.

## Levantar El Proyecto

Desde esta carpeta:

```bash
node src/main.mjs
```

Luego abrir en el navegador:

```text
http://127.0.0.1:5173/
```

## Cambiar Puerto

En PowerShell:

```powershell
$env:PORT=5174; node src/main.mjs
```

En bash:

```bash
PORT=5174 node src/main.mjs
```

## Estructura

```text
index.html          Pagina HTML que sirve el servidor y carga src/main.mjs
styles.css          Estilos y layout
src/main.mjs        Entrypoint de navegador y servidor local
src/game-app.mjs    Composition root del navegador
src/app/            Bootstrap, loop, estado y ensamblaje del juego
src/server/         Servidor local ESM
assets/             Fondos, sprites y recursos visuales
docs/               Documentacion de produccion
```

## Notas

- Si no ves cambios recientes en el navegador, recarga con `Ctrl+F5`.
- Los logs locales `server.out.log` y `server.err.log` estan ignorados por git.
