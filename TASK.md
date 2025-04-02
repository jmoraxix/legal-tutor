# Tareas del Proyecto Legal Tutor

## 📋 Tareas Pendientes

### Configuración Inicial
- [x] Inicializar proyecto React con NextJS 14 (App Router) (01/04/2025)
- [x] Configurar Supabase (01/04/2025)
- [x] Configurar ShadCN UI (01/04/2025)
- [x] Configurar ESLint y Prettier (01/04/2025)
- [x] Crear estructura básica de directorios (01/04/2025)

### Autenticación
- [x] Implementar registro de usuarios (01/04/2025)
- [x] Implementar inicio de sesión (01/04/2025)
- [x] Implementar cierre de sesión (01/04/2025)
- [x] Configurar redirecciones basadas en autenticación (01/04/2025)
- [x] Crear página de perfil de usuario (01/04/2025)

### Chat General
- [x] Diseñar interfaz de chat (01/04/2025)
- [x] Implementar envío de mensajes (básico) (01/04/2025)
- [ ] Configurar conexión con n8n (webhook)
- [x] Implementar visualización de respuestas (básico) (01/04/2025)
- [x] Guardar historial de conversaciones en Supabase (01/04/2025)
- [x] Implementar barra lateral con historial de chats (02/04/2025)
- [x] Crear página dinámica para visualizar conversaciones individuales (02/04/2025)

### Chat Quiz
- [x] Diseñar interfaz de quiz (01/04/2025)
- [x] Implementar sistema de preguntas y respuestas (básico) (01/04/2025)
- [x] Configurar sistema de puntuación (básico) (01/04/2025)
- [x] Implementar retroalimentación educativa (básico) (01/04/2025)
- [ ] Guardar progreso de usuario en Supabase

### n8n
- [ ] Configurar workflow para procesamiento de mensajes
- [ ] Implementar integración con IA (Claude o similar)
- [ ] Configurar acceso a documentos legales
- [ ] Implementar lógica de respuestas para el chat general
- [ ] Implementar lógica de respuestas para el chat quiz

### Base de Datos
- [x] Diseñar esquema de usuarios (01/04/2025)
- [x] Diseñar esquema de conversaciones (01/04/2025)
- [x] Diseñar esquema de quiz (01/04/2025)
- [x] Configurar políticas de seguridad en Supabase (01/04/2025)
- [ ] Implementar migraciones

### Pruebas
- [x] Implementar pruebas unitarias para componentes de autenticación (02/04/2025) 
- [ ] Implementar pruebas unitarias para otros componentes
- [ ] Implementar pruebas de integración
- [ ] Realizar pruebas de usabilidad
- [ ] Realizar pruebas de rendimiento

### Despliegue
- [ ] Configurar entorno de producción
- [ ] Implementar CI/CD
- [ ] Realizar despliegue inicial
- [ ] Configurar dominio y SSL

## ✅ Tareas Completadas

- [x] Crear PLANNING.md (01/04/2025)
- [x] Crear README.md (01/04/2025)
- [x] Crear TASK.md (01/04/2025)

## 🔎 Tareas Descubiertas Durante el Trabajo
- [x] Estandarizar las rutas a inglés (/historial -> /history, /perfil -> /profile) (02/04/2025)
- [x] Cambiar la redirección por defecto de /historial a /chat (02/04/2025)
- [x] Reordenar navegación: poner "Chat" primero y después "Mis Conversaciones" (02/04/2025)
- [x] Implementar mensaje de "Próximamente" en la página de Quiz (02/04/2025)
- [x] Actualizar el tono de los botones principales para que sean más claros (02/04/2025)
- [x] Aclarar aún más los botones en modo oscuro para mejor contraste y visibilidad (02/04/2025)
- [x] Modificar específicamente los botones "Nueva Conversación" y "Enviar" para usar tonos más claros (02/04/2025)
- [x] Actualizar los botones "Verificar Respuesta" y "Actualizar Perfil" para mantener el mismo estilo visual en toda la aplicación (02/04/2025)
- [x] Implementar componentes de autenticación (login/registro) (01/04/2025)
- [x] Mejorar la interfaz de usuario con componentes adicionales de ShadCN (01/04/2025)
- [x] Implementar tema oscuro/claro con toggle (01/04/2025)
- [x] Crear pantalla de historial de conversaciones (01/04/2025)
- [x] Crear componentes de layout compartidos para mantener coherencia en todas las páginas (02/04/2025)
- [x] Implementar redirección por defecto al dashboard (historial) cuando el usuario está autenticado (02/04/2025)
- [x] Corregir el bug de redirección donde "Mi perfil" redirigía al login (02/04/2025)
- [x] Agregar botón de "Cerrar Sesión" en el header cuando el usuario está autenticado (02/04/2025)
- [x] Mejorar navegación en header: quitar "Inicio", ocultar "Chat" y "Quiz" a usuarios no autenticados, asegurar que el cierre de sesión refresque correctamente la interfaz (02/04/2025)
- [x] Corregir problemas de persistencia de sesión entre páginas (02/04/2025)
- [x] Implementar solución temporal para formateo de fechas sin dependencias externas (02/04/2025)
- [x] Remover botón de "Cerrar Sesión" del header (02/04/2025)
- [x] Crear layout específico para la sección de Chat con barra lateral (02/04/2025)
- [x] Implementar componente ChatSidebar para mostrar conversaciones existentes (02/04/2025)
- [x] Crear ruta dinámica para visualizar y continuar conversaciones existentes (02/04/2025)
- [x] Renombrar tablas de conversations a chat_sessions y messages a chat_messages (02/04/2025)
- [ ] Instalar y configurar librería date-fns para formateo de fechas (pendiente)
- [ ] Implementar servicios de traducción para i18n
- [ ] Mejorar la navegación y diseño para móviles
