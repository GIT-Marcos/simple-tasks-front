# TaskFlow - Gestor de Tareas de Próxima Generación

Este proyecto surge para entender y probar como se integra una api con el front-end. Al igual que mi api de tasks, no busca ser una solución real a un problema de negocio real, si no simplemente entender el proceso de desarrollo. El código inicial está generado enteramente por IA, y sólo hice pequeñas modificaciones para que tenga compatibilidad con la api. Generé un prompt estructurado en etapas pidiendo los archivos necesarios para la página. Para la creación del prompt investigué con otras herramientas de IA secundarias qué era lo más convenienta en este caso particular. El resultado utiliza las tecnologías más modernas de frontend para garantizar una experiencia de usuario fluida, reactiva y robusta.

## 🚀 Tecnologías Principales

- **Frontend:** React 18 (Vite)
- **Estilos:** TailwindCSS
- **Gestión de Estado y Datos:** TanStack Query (React Query)
- **Validación de Datos:** Zod
- **Iconografía:** Lucide React
- **Tratamiento de Fechas:** date-fns

## ✨ Características Destacadas

### 1. Gestión Completa de Tareas (CRUD)
- Creación de tareas con validación en tiempo real (Zod).
- Edición de descripciones con estados de carga y manejo de conflictos.
- Cambio de estado (completada/pendiente) con retroalimentación instantánea.
- Eliminación con confirmación visual mediante **Portals de React** para una jerarquía de capas impecable.

### 2. Paginación Inteligente por Cursor
Implementación de paginación estricta basada en cursor (`lastId` + `lastDate`), evitando los problemas comunes de duplicados en listas dinámicas causados por la paginación tradicional por offset.

### 3. Sistema de Filtrado Avanzado
- Búsqueda por descripción con **Debouncing** de 400ms.
- Filtrado por estado (completado/pendiente).
- **Normalización de Fechas:** Tratamiento automático de husos horarios (UTC) y rangos de fin de día para garantizar búsquedas precisas entre fechas.

### 4. Resiliencia y Manejo de Errores
- **Manejo de Cold Start:** Detección automática de arranques en frío del servidor (especialmente útil para despliegues en Render), mostrando un overlay informativo si la API tarda más de 10 segundos.
- **Notificaciones Descriptivas:** Manejo específico de errores HTTP:
  - `409 Conflict`: Notificación de tareas duplicadas.
  - `429 Too Many Requests`: Protección de Rate Limit.
  - `Validation Errors`: Propagación de mensajes de error personalizados desde el servidor.

## 🛠️ Arquitectura del Proyecto

El proyecto sigue una estructura por capas para facilitar el mantenimiento y la escalabilidad:
- `/api`: Clientes de API y Hooks personalizados de React Query (Mutaciones y Consultas).
- `/components`: Componentes atómicos y moleculares reutilizables.
- `/types`: Definiciones de esquemas Zod e interfaces de TypeScript.
- `/utils`: Funciones de utilidad para normalización de datos y manipulación de fechas.
- `/pages`: Orquestadores de vistas principales.

## 🏁 Instalación y Ejecución


### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar entorno
La URL base por defecto es http://localhost:8080 si no se encuentra la variable de entorno.
Se debe tener corriendo la API de tareas (https://github.com/GIT-Marcos/task-api-springboot) para que esta página pueda conectare.

### 3. Iniciar en modo desarrollo
```bash
npm run dev
```

### 4. Construir para producción
```bash
npm run build
```

## 🌐 API Reference

La aplicación se comunica con una API REST que soporta los siguientes endpoints:
- `GET /api/tasks`: Listado filtrable con soporte para paginación por cursor.
- `POST /api/tasks`: Creación de nuevas tareas.
- `PATCH /api/tasks/{id}`: Actualización parcial de tareas.
- `DELETE /api/tasks/{id}`: Eliminación física de tareas.

## 📓 Reglas de negocio
- Descripción: mínimo 1, máximo 140 caracteres.
- Confirmación al borrar tarea.
- Manejo de errores:
   - 409 → “Ya existe una tarea con esa descripción”.
   - 429 → “Demasiadas solicitudes, intente más tarde”.
   - Validaciones → mensaje descriptivo.
   - Genéricos → “Error inesperado”.
- Normalización de fechas:
   - minDate → inicio del día UTC.
   - maxDate → inicio del día siguiente UTC.
