# 🎫 Mi Boleta (Managet_api)

Plataforma de gestión y seguimiento de boletas de juegos de azar, loterías y sorteos. Permite a los usuarios registrar sus jugadas, controlar resultados y a los administradores supervisar la actividad global.

---

## 🚀 Tecnologías y Herramientas

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| **Core** | [React 19](https://react.dev/) | Librería de UI |
| **Build Tool** | [Vite](https://vitejs.dev/) | Entorno de desarrollo rápido |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | Tipado estático para mayor robustez |
| **Validación** | [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) | Esquemas de validación y gestión de formularios |
| **Estilos** | CSS Moderno (Glassmorphism) | Interfaz visual atractiva y moderna |
| **Iconos** | [Lucide React](https://lucide.dev/) | Set de iconos vectoriales |
| **Notificaciones** | [Sonner](https://sonner.stevenly.me/) | Toasts de alta calidad |
| **Auth** | JWT Decode | Manejo de tokens de sesión |

---

## 📂 Estructura del Proyecto

El código sigue una arquitectura modular y escalable dentro de `src/`:

```text
src/
├── assets/         # Recursos estáticos (imágenes, logos)
├── components/     # Componentes reutilizables (Botones, Inputs, Modales)
├── context/        # Estados globales (Autenticación)
├── pages/          # Vistas principales (Dashboard, Admin, Tickets)
├── services/       # Lógica de comunicación con la API
├── styles/         # Definiciones globales de CSS
├── types/          # Interfaces y tipos de TypeScript (Centralizados)
├── App.tsx         # Enrutamiento y configuración de proveedores
└── main.tsx        # Punto de entrada de la aplicación
```

---

## 🛠️ Funcionalidades Implementadas

### Para Usuarios
*   **Autenticación:** Registro e inicio de sesión seguro con JWT.
*   **Dashboard:** Resumen estadístico (Ganados, Perdidos, Pendientes) y próximos sorteos.
*   **Gestión de Boletas:** CRUD completo (Crear, Leer, Actualizar, Eliminar) de registros.
*   **Búsqueda y Filtros:** Filtrado por estado, tipo de juego y búsqueda de texto.
*   **Paginación:** Manejo eficiente de grandes volúmenes de datos.
*   **Validación Proactiva:** Errores en tiempo real antes de enviar datos a la API.

### Para Administradores
*   **Panel Global:** Acceso a todos los registros de todos los usuarios.
*   **Búsqueda Avanzada:** Filtrado por propietario de la boleta (email/nombre).
*   **Control Total:** Supervisión de la actividad en la plataforma.

---

## 🔧 Configuración y Desarrollo

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (Versión 18 o superior)
*   [npm](https://www.npmjs.com/)

### Instalación
1. Clonar el repositorio.
2. Ejecutar `npm install`.

### Scripts Disponibles
*   `npm run dev`: Inicia el servidor de desarrollo.
*   `npm run build`: Genera la versión de producción.
*   `npm run lint`: Ejecuta el linter para asegurar calidad de código.
*   `npm run preview`: Previsualiza la construcción de producción localmente.

### Conexión con la API
La URL base de la API está configurada en `src/services/api.ts`:
`https://mi-boleta-api-y9dv.onrender.com/api/v1`

---

## 👥 Usuarios de Prueba
Puedes usar las siguientes credenciales para probar la plataforma:

| Rol | Email | Password |
|-----|-------|----------|
| **Administrador** | `admin@admin.com` | `admin123` |
| **Usuario** | `user@user.com` | `user123` |

---

## 🎨 Diseño Visual
La aplicación utiliza un estilo **Glassmorphism** (efecto cristal) que incluye:
*   Paneles translúcidos con desenfoque de fondo.
*   Gradientes suaves y sombras difusas.
*   Animaciones de entrada (fade-in) para una mejor experiencia de usuario.
*   Esquema de colores vibrantes para diferenciar estados (Éxito, Peligro, Advertencia).
