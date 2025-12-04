 
# Kümelen — API (Backend Hono)

Versión mejorada y organizada del README para el backend de Kümelen.

Esta API está construida con TypeScript y Hono, pensada para desplegarse en Railway y ser consumida por un frontend en Next.js que vive en otro repositorio.

Índice
- [Descripción](#descripción)
- [Características principales](#características-principales)
- [Stack tecnológico](#stack-tecnológico)
- [Librerías y dependencias](#librerías-y-dependencias)
- [Arquitectura y estructura](#arquitectura-y-estructura)
- [Requisitos](#requisitos)
- [Instalación y ejecución (desarrollo)](#instalación-y-ejecución-desarrollo)
- [Variables de entorno recomendadas](#variables-de-entorno-recomendadas)
- [Endpoints relevantes (resumen)](#endpoints-relevantes-resumen)
- [Integración y despliegue en Railway](#integración-y-despliegue-en-railway)
- [Roadmap / Próximos pasos](#roadmap--próximos-pasos)
- [Contribuir](#contribuir)
- [Licencia y contacto](#licencia-y-contacto)

## Descripción

Backend de Kümelen: API REST que centraliza lógica de negocio para el catálogo de productos/servicios, POS (punto de venta), CMS básico y gestión de usuarios/roles. Está diseñada para ser modular, segura y fácil de desplegar en Railway.

## Características principales

- Autenticación y autorización (roles: admin, content_manager, pos_user, etc.).
- CRUD de catálogo (productos, terapias/servicios, categorías).
- Funcionalidad básica de POS: sesiones de caja, registro de ventas y reportes simples.
- CMS simple: páginas, bloques y referencias a media externa (Cloudflare R2 u S3).
- Integración con PostgreSQL (Prisma) y almacenamiento de objetos (R2).

## Stack tecnológico

- Lenguaje: TypeScript
- Runtime: Node.js
- Framework HTTP: Hono
- ORM: Prisma (PostgreSQL)
- Validación: Zod
- Almacenamiento de media: Cloudflare R2 

## Requisitos

- Node.js (versión recomendada acorde al proyecto)
- npm (o npm/yarn)
- PostgreSQL local o en Railway

## Instalación y ejecución (desarrollo)

1) Clona el repo

```bash
git clone https://github.com/demodogo/kumelen-api.git
cd kumelen-api
```

2) Instala dependencias

```powershell
npm install
```

3) Crea un archivo `.env` (usa las variables listadas más abajo)

4) Genera Prisma Client y aplica migraciones locales (desarrollo)

```powershell
npm prisma generate
npm prisma migrate dev
```

5) Ejecuta en modo desarrollo

```powershell
npm dev
```

Por defecto, la API suele correr en http://localhost:3000 (o el puerto configurado).

### Scripts recomendados (package.json)

Ejemplo de scripts que deberías tener en `package.json`:

```json
{
  "scripts": {
    "dev": "tsx src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

## Variables de entorno recomendadas

Configura estas variables en un archivo `.env` o a través del panel de Railway:

```
PORT=8080
DATABASE_URL="postgresql://user:password@host:5432/kumelen_db"
JWT_SECRET="secretJwtSecure"
NODE_ENV=development

R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
```

## Estructura del proyecto (sugerida)

Una organización recomendada de carpetas:

```
src/
  app.ts              # punto de entrada Hono
  config/             # env, constantes
  db/                 # prisma client, helpers
  modules/
    auth/             # rutas y lógica de auth
    users/            # usuarios y roles
    catalog/          # products, services, categories
    pos/              # pos sessions, sales, reports
    cms/              # pages, blocks, media
  middleware/         # auth, logging, error handler
  utils/              # utilidades generales
```

## Endpoints relevantes (resumen)

- Auth
  - POST /auth/login
  - POST /auth/refresh

- Users
  - GET /users
  - POST /users

- Catalog
  - GET /catalog/products
  - POST /catalog/products
  - GET /catalog/services

- POS
  - POST /pos/sessions/open
  - POST /pos/sessions/close
  - POST /pos/sales
  - GET  /pos/sales?from=&to=

- CMS
  - GET  /cms/pages/:slug
  - POST /cms/pages
  - GET  /cms/pages/:slug/blocks
  - POST /cms/pages/:slug/blocks

## Integración y despliegue en Railway

Configuración típica en Railway:

- Servicio Node.js para la API
- Servicio PostgreSQL (opcionalmente administrado por Railway)
- Variables de entorno definidas en el dashboard

Build & Start (ejemplo):
```
Build: npm install && npm build
Start: npm start
```

## Roadmap / Próximos pasos

- Implementar módulo Auth y gestión de roles (prioridad alta).
- Modelo y endpoints CRUD para catálogo (productos y servicios).
- Módulo POS con sesiones y registro de ventas.
- Módulo CMS para páginas y bloques, con almacenamiento en R2.
- Integraciones futuras: pagos (Webpay), agenda, mejoras en observabilidad.

