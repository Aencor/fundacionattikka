# 🍼 Fundación Atikka — Plataforma de Donaciones

Sitio web de donaciones para **Fundación Atikka**, organización sin fines de lucro que alimenta bebés en situación de vulnerabilidad en México.

Integra **Stripe Checkout** de forma directa — sin login requerido, cualquier persona puede donar en segundos.

![Fundación Atikka](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=flat-square&logo=stripe)

---

## ✨ Características

- 🎨 **Diseño moderno** — Gradientes, animaciones suaves, responsive en todos los dispositivos
- 💳 **Stripe Checkout** — Proceso de pago seguro y hospeado por Stripe (sin datos de tarjeta en el servidor)
- 🪜 **Modal de 3 pasos** — Selección de monto → Datos del donador → Confirmación y pago
- 🧾 **Recibo fiscal (CFDI)** — Opción para ingresar RFC y solicitar comprobante fiscal
- 🎉 **Thank You Page** — Página de agradecimiento personalizada con el monto donado y botón de compartir
- 📊 **Contadores animados** — Estadísticas de impacto con animación al hacer scroll
- 📱 **Mobile-first** — Navegación y modal completamente adaptados a móvil
- 🚀 **Listo para Netlify** — Serverless function incluida para producción

---

## 🗂️ Estructura del Proyecto

```
fundacionattikka/
├── netlify/
│   └── functions/
│       └── create-donation-session.ts  # Serverless function para Stripe (producción)
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Navegación sticky con transparencia
│   │   ├── Hero.tsx            # Hero full-screen con CTA
│   │   ├── Stats.tsx           # Contadores animados
│   │   ├── Mission.tsx         # Misión y pilares de la fundación
│   │   ├── Impact.tsx          # Programas y uso de donaciones
│   │   ├── HowItWorks.tsx      # Flujo de donación en 4 pasos
│   │   ├── Testimonials.tsx    # Testimonios de donadores y beneficiados
│   │   ├── Footer.tsx          # Footer con CTA y datos de contacto
│   │   ├── DonationModal.tsx   # Modal de donación con integración Stripe
│   │   └── ThankYouPage.tsx    # Página de agradecimiento post-pago
│   ├── App.tsx                 # Rutas y lógica principal
│   ├── main.tsx
│   └── index.css
├── vite.config.ts              # Config de Vite + middleware Stripe (desarrollo)
├── netlify.toml                # Config de despliegue Netlify
├── .env                        # Variables de entorno (NO subir a Git)
└── package.json
```

---

## 🚀 Instalación y Desarrollo Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Aencor/fundacionattikka.git
cd fundacionattikka
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Stripe publishable key — expuesta al navegador (prefijo VITE_)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe secret key — SOLO en servidor, nunca en el navegador
STRIPE_SECRET_KEY=sk_live_...
```

> ⚠️ **Importante:** El archivo `.env` ya está en `.gitignore`. Nunca subas tus claves secretas a GitHub.

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

El servidor de desarrollo incluye un **middleware de Stripe** integrado en Vite que maneja la creación de sesiones de pago sin necesidad de un backend separado.

---

## 💳 Flujo de Donación

```
Usuario visita el sitio
        ↓
Clic en "Donar Ahora"
        ↓
┌─────────────────────────────────┐
│  Modal Paso 1: Seleccionar monto │
│  $100 / $250 / $500 / $1000 /   │
│  $2500 / monto personalizado    │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Modal Paso 2: Datos del donador │
│  Nombre, Email, RFC (opcional)  │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Modal Paso 3: Confirmar y pagar│
│  Resumen + botón "Pagar con     │
│  Stripe"                        │
└─────────────────────────────────┘
        ↓
  Stripe Checkout (hospeado)
        ↓
    ✅ Éxito → /?donacion=exitosa → ThankYouPage
    ❌ Canceló → /?donacion=cancelada → Modal reabierto
```

---

## 🌐 Despliegue en Netlify

### 1. Conectar repositorio en Netlify

Importa el repositorio desde [app.netlify.com](https://app.netlify.com).

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

El archivo `netlify.toml` ya incluye esta configuración.

### 2. Variables de entorno en Netlify

En **Site settings → Environment variables**, agrega:

| Variable | Valor |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |

> `STRIPE_SECRET_KEY` se usa en la Netlify Function (servidor).  
> `VITE_STRIPE_PUBLISHABLE_KEY` se embebe en el bundle del frontend.

### 3. Configurar Stripe Dashboard

En tu [Stripe Dashboard](https://dashboard.stripe.com/webhooks), asegúrate de que las URLs de éxito y cancelación coincidan con tu dominio:

- **Success URL:** `https://tu-dominio.com/?donacion=exitosa`
- **Cancel URL:** `https://tu-dominio.com/?donacion=cancelada`

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| [React 18](https://react.dev) | Framework de UI |
| [Vite 8](https://vite.dev) | Bundler y dev server |
| [TypeScript 5](https://typescriptlang.org) | Tipado estático |
| [Tailwind CSS 4](https://tailwindcss.com) | Estilos utilitarios |
| [Lucide React](https://lucide.dev) | Íconos |
| [Stripe JS](https://stripe.com/docs/js) | SDK de pagos (frontend) |
| [Stripe Node](https://stripe.com/docs/api) | SDK de pagos (backend) |

---

## 🔒 Seguridad

- La `STRIPE_SECRET_KEY` **nunca llega al navegador** — solo se usa en el servidor (Vite middleware en dev, Netlify Function en producción)
- La `VITE_STRIPE_PUBLISHABLE_KEY` es pública por diseño — Stripe la usa para inicializar el checkout en el cliente
- No se almacenan datos de tarjetas — todo el procesamiento ocurre en los servidores de Stripe
- El archivo `.env` está en `.gitignore` para prevenir commits accidentales

---

## 📜 Licencia

Uso exclusivo de **Fundación Atikka**. Todos los derechos reservados.

---

<div align="center">
  Hecho con ❤️ para alimentar el futuro de México
</div>
