# Linktree Clone - Next.js + Prisma + Clerk

Un clon funcional de **Linktree** donde los usuarios pueden crear perfiles públicos personalizados para compartir multiples links en un único lugar.

**Stack:** Next.js 16 | Prisma ORM | PostgreSQL | Clerk Auth | Tailwind CSS | Lucide React

---

## Resumen de Implementación

Este proyecto fue construido siguiendo los pasos del **[tutorial oficial de Prisma](https://www.prisma.io/docs/ai/tutorials/linktree-clone)** sobre Vibe Coding con IA.

### **Paso 1: Configuración Inicial (Next.js + Prisma)**
- Crear proyecto Next.js 16 con App Router
- Instalar Prisma v7 con `@prisma/adapter-pg` para PostgreSQL
- Configurar `prisma/schema.prisma` con modelos User y Link
- Ejecutar `npx prisma db push` y `npx prisma generate`
- Crear archivo `.env.example` con variables necesarias

**Archivos:** `prisma/schema.prisma`, `lib/prisma.ts`, `prisma/prisma.config.ts`, `prisma.config.cjs`

---

### **Paso 2: Autenticación con Clerk**
- Instalar `@clerk/nextjs` y configurar keys de entorno
- Crear middleware en `proxy.ts` con `clerkMiddleware()`
- Agregar `<ClerkProvider>` en `app/layout.tsx`
- Usar `currentUser()` para obtener usuario autenticado en Server Components

**Archivos:** `proxy.ts`, `app/layout.tsx`

---

### **Paso 3: Flujo "Claim Username"**
- Implementar Server Action `claimUsername()` en `app/actions.ts`
- Crear tres estados en `app/page.tsx`:
  - No autenticado → Landing page
  - Autenticado sin perfil → Formulario de reclamo
  - Con perfil → Dashboard
- Usar `api/users/route.ts` para POST con clerkId, email, username, name

**Archivos:** `app/actions.ts`, `app/page.tsx`, `app/api/users/route.ts`

---

### **Paso 4: Gestión de Links (CRUD)**
- Crear Server Action `addLink()` para agregar links
- Crear Server Action `deleteLink()` para eliminar links
- Usar `revalidatePath("/")` para refrescar datos automáticamente
- Dashboard con formulario y lista de links

**Archivos:** `app/actions.ts` (extendido), `app/page.tsx` (dashboard section)

---

### **Paso 5: Perfil Público Dinámico**
- Crear ruta `app/[username]/page.tsx` como Server Component
- Obtener usuario por username: `findUnique({ where: { username } })`
- Retornar 404 con `notFound()` si no existe
- Mostrar: avatar, nombre, username, y lista de links
- Links abren en nueva pestaña con `target="_blank"`

**Archivos:** `app/[username]/page.tsx`, `app/[username]/not-found.tsx`

---

### **Paso 6: Botón Copiar Perfil**
- Crear componente cliente `app/components/copy-button.tsx` con `'use client'`
- Usar `navigator.clipboard.writeText(url)` para copiar
- Mostrar feedback "Copiado!" por 2 segundos con `useState`
- Reset automático con `setTimeout`

**Archivos:** `app/components/copy-button.tsx`, `app/page.tsx` (integración)

---

### **Paso 7: Páginas 404 Personalizadas**
- `app/not-found.tsx` para errores globales
- `app/[username]/not-found.tsx` para usuarios no encontrados
- Diseño consistente con botón "Volver al inicio"

**Archivos:** `app/not-found.tsx`, `app/[username]/not-found.tsx`

---

### **Paso 8: Estilos Avanzados (Glassmorphism)**
- Fondo SVG en `app/globals.css` con `background-image` fija
- Clase `.card` con glassmorphism: `rgba(255,255,255,0.9)` + `backdrop-filter: blur(10px)`
- Efecto `.hero-glow` con pseudo-elemento `::before` - circulo blanco difuminado
- Aplicar `.card` a landing, dashboard, perfiles, 404

**Archivos:** `app/globals.css`, `public/background.svg`

---

### **Paso 9: Landing Page Mejorada**
- Rediseñar página inicial con glassmorphism
- Hero card con emoji y descripción
- Grid de 3 features: Rápido | Simple | Efectivo
- CTA card con botón "Comenzar" de sign-in
- Footer con link "Crear la tuya"

**Archivos:** `app/page.tsx` (landing section)

---

### **Paso 10: Imágenes de Perfil de Clerk**
- Importar `clerkClient()` para obtener datos del usuario
- Usar `clerkUser.imageUrl` para mostrar foto de Google/GitHub
- Fallback a avatar amarillo con iniciales si no hay imagen
- Aplicar en `app/[username]/page.tsx`

**Archivos:** `app/[username]/page.tsx`

---

### **Paso 11: Iconos con Lucide React**
- `npm install lucide-react`
- `Trash2` (18px) en botones delete → reemplaza texto
- `ExternalLink` (16px) en links del perfil
- `Link` (32px) en estados vacíos (sin links)
- Importar: `import { Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react'`

**Archivos:** `app/page.tsx`, `app/[username]/page.tsx`

---

## Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Editar .env con:
# DATABASE_URL=postgres://user:pass@localhost:5432/linktree
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
# CLERK_SECRET_KEY=sk_...
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# 3. Inicializar base de datos
npx prisma db push
npx prisma generate

# 4. Dev server
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Modelos de Base de Datos

### **User**
```prisma
id          Int       (autoincrement)
email       String    (unique)
username    String    (unique) - Para URL pública
clerkId     String    (unique) - De Clerk Auth
name        String?
links       Link[]    (relación 1 a muchos)
createdAt   DateTime
updatedAt   DateTime
```

### **Link**
```prisma
id        Int       (autoincrement)
title     String?
url       String    (required)
userId    Int       (foreign key a User)
user      User      (relación)
createdAt DateTime
```

---

## Características de Diseño

| Aspecto | Detalles |
|--------|---------|
| **Tema** | Light mode (sin dark mode) |
| **Colores** | Blanco #FFF, Negro #000, Amarillo CTA #FFDD00, Gris #F7F7F7 |
| **Efectos** | Glassmorphism (blur 10px), Glow radial, Hover con scale |
| **Tipografía** | Headlines bold (text-5xl+), Spacing generoso (py-4 px-8) |
| **Botones** | Amarillo primario, Borde secundario, Rounded-full |
| **Tarjetas** | `.card` con rgba(255,255,255,0.9) + backdrop-filter blur |

---

## Seguridad & Validación

- Server Components por defecto (sin `'use client'` innecesario)
- Validación de propiedad en `deleteLink()` - verifica que userId coincida
- Middleware de Clerk protege rutas automáticamente
- Variables de entorno en `.env` (no commitear)
- `notFound()` para rutas privadas

---

## Estructura de Archivos

```
app/
├── [username]/
│   ├── page.tsx           # Perfil público (Server Component)
│   └── not-found.tsx      # 404 para usuarios
├── components/
│   └── copy-button.tsx    # Client component: clipboard
├── api/
│   └── users/
│       └── route.ts       # POST/GET users
├── actions.ts             # Server Actions: claim, add, delete
├── page.tsx               # Landing + Dashboard (3 states)
├── layout.tsx             # ClerkProvider wrapper
├── globals.css            # .card, .hero-glow, background
└── not-found.tsx          # 404 global

lib/
└── prisma.ts              # PrismaClient singleton

prisma/
├── schema.prisma          # DB schema
└── prisma.config.ts       # Prisma config

public/
└── background.svg         # Patrón de fondo

scripts/
└── test-database.ts       # Script de prueba (opcional)
```

---

## Flujo de Usuario

1. **Usuario no autenticado**
   - Ve landing page con hero, features, CTA
   - Botón "Comenzar" → Sign-in con Clerk

2. **Usuario autenticado (primer acceso)**
   - Reclama username (ej: `johndoe`)
   - Crea perfil en BD

3. **Con perfil activo**
   - Dashboard: agrega/elimina links
   - Acceso a URL pública: `yourapp.com/johndoe`
   - Botón "Copiar enlace" para compartir

4. **Visitante en perfil público**
   - Ve nombre, foto, lista de links
   - Clicks abren links en nueva pestaña
   - Puede copiar URL del perfil

---

## Variables de Entorno

```env
# Base de datos PostgreSQL
DATABASE_URL=postgres://user:password@localhost:5432/linktree

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# App URL (para copy button)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Comandos Útiles

```bash
# Prisma Studio (visualizar BD)
npm run db:studio

# Generar Prisma Client
npx prisma generate

# Reset BD (borra todo)
npx prisma db push --force-reset

# Deploy a Vercel
npm run build
```

---

## Deploy a Vercel

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "Ready to deploy"
   git push origin main
   ```

2. **Conectar en Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Import repository
   - Agregar variables de entorno:
     - `DATABASE_URL` (tu BD PostgreSQL)
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
     - `NEXT_PUBLIC_APP_URL` (tu URL de Vercel)

3. **Deploy automático**
   - Vercel ejecuta `npm run build`
   - Script `postinstall` genera Prisma Client
   - App en vivo

---

## Próximas Mejoras (Opcionales)

- [ ] Editar información de perfil
- [ ] Reordenar links con drag-drop
- [ ] Temas/colores personalizados por usuario
- [ ] Analytics de clicks en links
- [ ] Dark mode
- [ ] Vista previa en vivo del perfil
- [ ] Compartir en redes sociales

---

## Referencias

- **[Tutorial Prisma Linktree](https://www.prisma.io/docs/ai/tutorials/linktree-clone)** - Guía oficial paso a paso
- **[Prisma Docs](https://www.prisma.io/docs)** - ORM documentation
- **[Next.js Docs](https://nextjs.org/docs)** - App Router & Server Components
- **[Clerk Docs](https://clerk.com/docs)** - Authentication
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first styling

---
