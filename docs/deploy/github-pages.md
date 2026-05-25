# GitHub Pages Deploy

## Resumen

Este proyecto se puede desplegar como sitio estatico en GitHub Pages. No necesita `npm install`, build con Vite, backend ni servidor Node en produccion.

El archivo de deploy esta en:

```text
.github/workflows/deploy-pages.yml
```

El deploy automatico corre cuando se hace `push` a la rama:

```text
main
```

Tambien se puede ejecutar manualmente desde la pestana `Actions` con `workflow_dispatch`.

## Sobre la rama main

No es que GitHub Pages solo pueda usar `main` en todos los casos. GitHub Pages puede configurarse de varias formas segun el repositorio.

Para este proyecto se eligio `main` porque es el flujo mas simple y seguro:

- `main` representa la version estable.
- cada merge a `main` publica automaticamente.
- evita deploys desde ramas de trabajo o PRs incompletos.

Si en el futuro se quiere usar otra rama, hay que cambiar esta seccion del workflow:

```yaml
on:
  push:
    branches:
      - main
```

## Que publica el workflow

El workflow crea una carpeta temporal `dist` y copia solo los archivos necesarios para el juego:

```text
index.html
styles.css
src/
assets/
.nojekyll
```

No publica `docs/`, logs locales ni archivos de configuracion que no hacen falta en el sitio.

## Configuracion en GitHub

### 1. Subir el workflow

Hacer commit y push de estos archivos:

```text
.github/workflows/deploy-pages.yml
docs/deploy/github-pages.md
```

El workflow no aparece en GitHub Actions hasta que exista en la rama remota.

### 2. Habilitar GitHub Pages

En GitHub, abrir el repositorio y entrar a:

```text
Settings -> Pages
```

En `Build and deployment`, configurar:

```text
Source: GitHub Actions
```

Guardar si GitHub muestra un boton de guardado.

### 3. Verificar permisos de Actions

En el repositorio:

```text
Settings -> Actions -> General
```

Revisar:

```text
Actions permissions
```

Debe permitir ejecutar workflows. Normalmente sirve:

```text
Allow all actions and reusable workflows
```

O una configuracion equivalente que permita estas acciones oficiales:

```text
actions/checkout
actions/configure-pages
actions/upload-pages-artifact
actions/deploy-pages
```

### 4. Hacer deploy automatico

Cada vez que se suban cambios a `main`, GitHub ejecutara:

```text
Deploy GitHub Pages
```

Ejemplo:

```bash
git add .github/workflows/deploy-pages.yml docs/deploy/github-pages.md
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

### 5. Revisar el resultado

Entrar a:

```text
Actions -> Deploy GitHub Pages
```

Abrir el run mas reciente y revisar que el job termine en verde.

Cuando termine, GitHub mostrara la URL publicada en el ambiente `github-pages`.

Tambien se puede revisar en:

```text
Settings -> Pages
```

## Configuracion recomendada para PRs

Para evitar publicar cambios sin revisar:

1. Proteger la rama `main`.
2. Requerir PR antes de hacer merge.
3. Requerir al menos una aprobacion.
4. Hacer merge solo cuando el PR este aprobado.

Ruta:

```text
Settings -> Branches -> Branch protection rules
```

Crear una regla para:

```text
main
```

Activar:

```text
Require a pull request before merging
Require approvals
```

Con este flujo, el deploy automatico ocurre despues del merge aprobado a `main`.

## Troubleshooting

### No aparece el workflow

Verificar que `.github/workflows/deploy-pages.yml` ya este subido a GitHub en `main`.

### El deploy no corre

Verificar:

- que el push fue a `main`.
- que Actions esta habilitado en el repo.
- que el archivo YAML esta dentro de `.github/workflows/`.

### GitHub Pages no muestra el juego

Verificar en `Settings -> Pages` que el source sea:

```text
GitHub Actions
```

### El juego carga pero faltan imagenes

Revisar que `assets/` exista en el artifact. El workflow copia:

```bash
cp -R src assets dist/
```

Los paths del juego son relativos, por ejemplo:

```text
assets/sprites/hero-walk.png
```

Eso es correcto para GitHub Pages bajo una URL tipo:

```text
https://usuario.github.io/repositorio/
```
