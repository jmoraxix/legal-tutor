# Legal Tutor

## 📚 Acerca del Proyecto
Legal Tutor es una aplicación web interactiva diseñada para facilitar el acceso y comprensión de documentos legales en Costa Rica. A través de una interfaz de chat intuitiva, los usuarios pueden realizar consultas sobre temas legales y recibir respuestas precisas basadas en la legislación costarricense.

La aplicación ofrece dos modalidades principales:
- **Chat General**: Para consultas abiertas sobre temas legales
- **Chat Quiz**: Para aprendizaje interactivo mediante preguntas y respuestas

## 🚀 Características Principales
- Interfaz de chat intuitiva y amigable
- Respuestas basadas en documentos legales costarricenses
- Modalidad quiz para estudiantes y personas interesadas en aprender
- Almacenamiento de historial de conversaciones
- Sistema completo de autenticación (registro, inicio y cierre de sesión)
- Perfiles de usuario personalizables
- Tema claro/oscuro con cambio automático
- Diseño responsive para uso en diferentes dispositivos
- Desplegado en Netlify para alta disponibilidad
- Sistema de feedback para que los usuarios envíen comentarios y sugerencias desde cualquier página
- Botón de feedback flotante siempre visible

## 🛠️ Tecnologías Utilizadas
- **Frontend**: React
- **Backend**: Supabase (autenticación, base de datos)
- **Automatizaciones**: n8n (para procesamiento de IA y webhooks)
- **UI Components**: ShadCN
- **Hosting/CI/CD**: Netlify

## ⚙️ Requisitos Previos
- Node.js (v18 o superior)
- npm o yarn
- Cuenta en Supabase
- Instancia de n8n configurada para webhooks
- Cuenta en Netlify (para despliegue)

## 🔧 Instalación y Configuración

### Clonar el Repositorio
```bash
git clone https://github.com/yourusername/legal-tutor.git
cd legal-tutor
```

### Instalar Dependencias
```bash
npm install
# o
yarn install
```

### Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto basándote en `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL=tu_url_de_webhook_n8n
```

### Iniciar el Servidor de Desarrollo
```bash
npm run dev
# o
yarn dev
```

### Despliegue en Netlify

#### Opción 1: Despliegue con Interfaz Gráfica
1. Registrarse o iniciar sesión en [Netlify](https://www.netlify.com/)
2. Haz clic en "New site from Git"
3. Conecta tu repositorio (GitHub, GitLab, Bitbucket)
4. Selecciona el repositorio `legal-tutor`
5. Configura los ajustes de build:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Configura las variables de entorno en la sección "Advanced build settings"
7. Haz clic en "Deploy site"

#### Opción 2: Despliegue con Netlify CLI
```bash
# Instala Netlify CLI globalmente
npm install -g netlify-cli

# Inicia sesión en Netlify
netlify login

# Inicializa el proyecto con Netlify
netlify init

# Despliega el sitio en producción
netlify deploy --prod
```

## 🗂️ Estructura del Proyecto
La estructura detallada del proyecto se encuentra en el archivo `PLANNING.md`.

## 🔄 Flujo de Datos
1. El usuario envía una consulta a través del chat
2. La aplicación envía la consulta a n8n mediante un webhook
3. n8n procesa la consulta utilizando IA y documentos legales
4. La respuesta se devuelve al frontend y se muestra al usuario
5. La conversación se almacena en Supabase

## 🧪 Testing
El proyecto incluye pruebas unitarias para asegurar la calidad y evitar regresiones:

```bash
# Ejecutar todas las pruebas
npm run test
# o
yarn test

# Ejecutar pruebas con modo watch
npm run test:watch
# o
yarn test:watch
```

Las pruebas están organizadas siguiendo la estructura del proyecto:
- `tests/components/`: Pruebas para componentes de UI
- `tests/lib/`: Pruebas para utilidades y servicios
- `tests/app/`: Pruebas para páginas y rutas

## 📝 Documentación Adicional
Para más información sobre la arquitectura y el plan de desarrollo, consulta el archivo `PLANNING.md`.

## 🔜 Próximas Funcionalidades
- Soporte para documentos legales de otros países
- Modos de aprendizaje avanzados
- Análisis de casos específicos
- Internacionalización (i18n)

## 🛠️ Actualizaciones Recientes
- (10/04/2025) Mejorado el sistema de feedback con un botón flotante siempre visible y efectos de animación
- (10/04/2025) Implementado sistema de feedback que permite a los usuarios enviar comentarios, sugerencias o reportar errores desde cualquier página de la aplicación
- (10/04/2025) Configurado el despliegue automático en Netlify
- (08/04/2025) Refactorizado el sistema de rutas: consolidadas las rutas de chat usando parámetros de consulta para mejor mantenibilidad
- (08/04/2025) Corregida configuración de ESLint: cambiado "next/core-web-api" a "next/core-web-vitals"
- (08/04/2025) Agregada la funcionalidad de barra lateral redimensionable, permitiendo a los usuarios ajustar el ancho según sus preferencias
- (07/04/2025) Corregido error de compatibilidad al agregar función generateStaticParams en la página dinámica de chat para exportación estática
- (07/04/2025) Implementada la integración con n8n a través de webhooks para el procesamiento de mensajes de chat con IA
- (07/04/2025) Corregido el error al seleccionar un chat de la barra lateral. Implementada una página dinámica para visualización de conversaciones por ID
- (07/04/2025) Añadido soporte para títulos de chat vacíos, mostrando "Cargando título..." cuando el título no está disponible

## 👥 Contribuir
Las contribuciones son bienvenidas. Por favor, lee las guías de contribución antes de enviar pull requests.

## 📄 Licencia
Este proyecto está licenciado bajo [LICENCIA A DEFINIR] - ver el archivo LICENSE.md para más detalles.

## 📞 Contacto
Para preguntas o sugerencias, por favor contacta a [TU INFORMACIÓN DE CONTACTO].
