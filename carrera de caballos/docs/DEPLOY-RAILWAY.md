# Desplegar en Railway

El proyecto incluye un **Dockerfile** para desplegar solo la **versión web** (HTML/CSS/JS) en Railway. La app Java (JavaFX) es de escritorio y no se despliega en la nube.

## Qué estaba fallando

- **Error:** "Error al crear un plan de compilación con Railpack".
- **Causa:** En el repo, el código está dentro de la carpeta `carrera de caballos/`. Railway ejecuta el build en la **raíz del repo**, donde no hay `pom.xml` ni `package.json`, y Railpack no sabe cómo construir.
- **Solución:** Usar el **Dockerfile** (que sí sabe cómo servir la web) y decirle a Railway que use la carpeta del proyecto como raíz de build.

## Pasos en Railway

1. **Root Directory**  
   En el proyecto de Railway: **Settings** → **Source** → **Root Directory** → pon:  
   `carrera de caballos`  
   (o el nombre exacto de la carpeta en tu repo si es distinto).  
   Así el build se ejecuta dentro de esa carpeta y encontrará el `Dockerfile`.

2. **Builder**  
   Con el Root Directory bien configurado, Railway debería detectar el `Dockerfile` y usarlo. No hace falta elegir “Nixpacks” ni “Railpack”; al ver el Dockerfile, usará Docker.

3. **Puerto**  
   El contenedor expone el puerto **8080**. Railway suele leer la variable `PORT`; si te pide un puerto concreto, en el Dockerfile ya está `-l 8080`. Si Railway inyecta `PORT`, habría que cambiar el `CMD` para usar esa variable (solo si Railway lo requiere).

4. **Dominio**  
   Después del deploy, en **Settings** → **Networking** → **Generate Domain** para obtener la URL pública.

## Qué hace el Dockerfile

- Imagen base: `node:20-alpine`
- Instala `serve` (servidor estático)
- Copia solo la carpeta `web/` (por `.dockerignore` no se copia `src/`, `target/`, etc.)
- Ejecuta: `serve web -s -l 8080`  
  (`-s` = SPA fallback a `index.html`, `-l 8080` = puerto)

## Resumen

| Dónde           | Valor / Acción                          |
|-----------------|-----------------------------------------|
| Root Directory  | `carrera de caballos`                   |
| Build           | Automático vía Dockerfile               |
| App desplegada  | Versión web (abrir `index.html` en navegador) |

Después de cambiar el Root Directory, haz **Redeploy** para que use el Dockerfile y vuelva a construir.
