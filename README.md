#  HelpDeskPro

Sistema de gestión de tickets de soporte técnico que permite registrar, administrar y dar seguimiento a incidencias de usuarios de forma organizada.

---

##  Descripción

HelpDeskPro es una aplicación web diseñada para simular un entorno real de soporte TI, donde los usuarios pueden crear tickets y gestionarlos según su estado (abierto, en proceso, cerrado).

Este proyecto fue desarrollado con el objetivo de fortalecer habilidades en desarrollo web moderno, manejo de bases de datos y construcción de aplicaciones tipo CRUD.

---

## 🧩 Funcionalidades

-  Creación de tickets de soporte
-  Visualización de tickets
-  Actualización de estado (abierto, en proceso, cerrado)
-  Eliminación de tickets
-  Gestión de usuarios *(si aplica)*
-  Filtrado o búsqueda *(si aplica)*

---

##  Tecnologías utilizadas

- **Frontend:** React / Next.js
- **Lenguaje:** JavaScript / TypeScript
- **Estilos:** CSS / Tailwind *(si usaste)*
- **Backend:** [API Routes / Node.js / etc]
- **Base de datos:** [MongoDB / MySQL / PostgreSQL / etc]

---

## Capturas de pantalla


![Home](./screenshots/home.png)
![Tickets](./screenshots/tickets.png)

---

## Instalación y ejecución

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

```bash
# Clonar el repositorio
git clone https://github.com/Eroxy12/HelpDeskPro.git

# Entrar a la carpeta
cd HelpDeskPro

# Instalar dependencias
npm install

#Agregar variables de entorno
create .env.local
MONGODB_URI=mongodb+srv://Jhonican:<password>@cluster0.8pr4nmz.mongodb.net/helpdeskpro
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=helpdeskpro-secret-key-change-in-production

# Ejecutar el proyecto
npm run dev


