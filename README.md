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
node dev-server.js
```

Luego abrir en el navegador:

```text
http://127.0.0.1:5173/
```

## Cambiar Puerto

En PowerShell:

```powershell
$env:PORT=5174; node dev-server.js
```

En bash:

```bash
PORT=5174 node dev-server.js
```

## Estructura

```text
index.html          Pantalla principal del juego
styles.css          Estilos y layout
game.js             Logica del juego
dev-server.js       Servidor local
assets/             Fondos, sprites y recursos visuales
docs/               Documentacion de produccion
```

## Notas

- Si no ves cambios recientes en el navegador, recarga con `Ctrl+F5`.
- Los logs locales `server.out.log` y `server.err.log` estan ignorados por git.
