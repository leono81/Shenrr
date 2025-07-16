# 🏥 Gestor de Órdenes - Sistema de Gestión para Profesionales de la Salud

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![POC](https://img.shields.io/badge/Status-POC-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Problema que Resuelve](#problema-que-resuelve)
- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación y Uso](#instalación-y-uso)
- [Guía de Usuario](#guía-de-usuario)
- [Arquitectura Técnica](#arquitectura-técnica)
- [Algoritmo de Facturación](#algoritmo-de-facturación)
- [Testing y Debugging](#testing-y-debugging)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Documentación Técnica](#documentación-técnica)
- [Licencia](#licencia)

## 📖 Descripción del Proyecto

**Gestor de Órdenes** es un **Proof of Concept (POC)** de un sistema SaaS multi-tenant diseñado específicamente para **profesionales de la salud en Argentina**. El sistema optimiza la gestión administrativa de órdenes de consulta post-autorizadas, permitiendo el seguimiento completo desde la recepción de la orden hasta la generación de reportes de facturación.

### 🎯 Objetivo Principal

Centralizar y organizar todas las órdenes médicas para, al final de cada período, consolidar la información y generar los reportes de presentación requeridos por cada **Obra Social** para la gestión del cobro.

## 🚨 Problema que Resuelve

Los profesionales de la salud en Argentina enfrentan una **significativa carga administrativa** al manejar:

- ✅ Órdenes de múltiples obras sociales con diferentes formatos
- ✅ Seguimiento manual de sesiones realizadas vs. autorizadas
- ✅ Cálculo complejo de aranceles con fechas de vigencia
- ✅ Aplicación de límites mensuales por paciente/obra social
- ✅ Generación de reportes mensuales para facturación
- ✅ Consolidación de datos para múltiples obras sociales

## 🚀 Características Principales

### ✨ Funcionalidades Implementadas

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **🏠 Dashboard Diario** | Dashboard con foco en citas de hoy y estadísticas diarias | ✅ Completo (HU-2.1) |
| **📋 Gestión de Órdenes** | Crear, listar, filtrar y gestionar órdenes | ✅ Completo (HU-1.1) |
| **✅ Check-in Inteligente** | Check-in con validación de horarios y confirmaciones | ✅ Completo (HU-2.2) |
| **📅 Agenda Médica** | Vista de agenda con gestión de capacidad y conflictos | ✅ Completo (HU-1.2) |
| **💰 Presentaciones** | Generación automática de reportes de facturación | ✅ Completo |
| **📊 Exportación Excel** | Export real con librerías JavaScript | ✅ Completo |

### 🎮 Flujo de Trabajo Validado

```mermaid
graph LR
    A[Crear Orden] --> B[Ver Agenda]
    B --> C[Check-in Inteligente]
    C --> D[Dashboard Diario]
    D --> E[Generar Presentación]
    E --> F[Exportar Excel]
```

1. **Carga de Órdenes**: Crear pacientes y órdenes con validaciones (HU-1.1)
2. **Agenda Médica**: Visualización de citas con gestión de capacidad (HU-1.2)
3. **Check-in Inteligente**: Validación de horarios con tolerancia ±30min (HU-2.2)
4. **Dashboard Diario**: Foco en citas de hoy y estadísticas del día (HU-2.1)
5. **Generación de Presentaciones**: Algoritmo complejo con límites y aranceles
6. **Exportación**: Excel real para envío a obras sociales

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5** - Estructura semántica
- **JavaScript Vanilla** - Lógica de negocio sin frameworks
- **Bootstrap 5** - UI framework responsive
- **Bootstrap Icons** - Iconografía consistente

### Persistencia
- **LocalStorage** - Almacenamiento local para el POC
- **JSON** - Formato de datos estructurado

### Librerías
- **SheetJS (xlsx.js)** - Exportación real a Excel
- **No dependencias de Node.js** - 100% frontend

### Arquitectura
- **Patrón de módulos** - Namespace organizado
- **Separación de responsabilidades** - Storage, Data, Utils, App, UI
- **Event-driven** - Manejo de eventos centralizado

## 🚀 Instalación y Uso

### Requisitos Mínimos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- No requiere servidor web (funciona con `file://`)

### 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/gestor-ordenes.git
cd gestor-ordenes

# No requiere instalación adicional - es 100% frontend
```

### ▶️ Ejecución

#### Opción 1: Doble click
```bash
# Simplemente abrir index.html en el navegador
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

#### Opción 2: Servidor local (recomendado)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (si tienes npx)
npx serve .

# Luego abrir: http://localhost:8000
```

### 🧪 Datos de Prueba

El sistema viene **precargado** con datos de prueba:

| Tipo | Cantidad | Ejemplos |
|------|----------|----------|
| **Pacientes** | 15 | María José Rodríguez (DNI: 12345678) |
| **Obras Sociales** | 5 | Swiss Medical, Galeno, Medife, Sancor, Particular |
| **Prácticas** | 6 | Kinesiología, Osteopatía, Rehabilitación, Fisioterapia |
| **Órdenes** | 14 | Múltiples estados y fechas para testing completo |
| **Sesiones** | 53 | Con conflictos de horarios para agenda |

#### 🔍 DNIs para Testing

**Casos de Uso Principales:**
- `12345678` - María José Rodríguez (Swiss Medical) - Citas de hoy para dashboard
- `23456789` - Carlos Alberto Fernández (Galeno) - Check-in inteligente temprano
- `34567890` - Ana Sofía Martínez (Medife) - Agenda con conflictos de horario
- `45678901` - Lucía Beatriz González (Swiss Medical) - Múltiples órdenes activas
- `56789012` - Roberto Carlos Silva (Galeno) - Sesiones diferidas anteriores

**Casos de Testing Específicos:**
- `67890123` - Patricia Elena Morales (Medife) - Orden cerrada manual
- `78901234` - Miguel Andrés López (Sancor) - Sin límites mensuales
- `89012345` - Carmen Rosa Jiménez (Particular) - No incluir en presentaciones
- `90123456` - Fernando José Ramírez (Swiss Medical) - Citas futuras programadas
- `01234567` - Isabella Sofia Torres (Galeno) - Conflictos de agenda extremos

**Escenarios de Conflicto:**
- **Hoy 11:00**: 3 pacientes simultáneos (María José, Carlos, Ana)
- **Hoy 15:00**: 3 pacientes simultáneos (Patricia, Miguel, Carmen)
- **Mañana 09:00**: 5 pacientes simultáneos para testing de capacidad

## 📱 Guía de Usuario

### 🏠 Dashboard Diario (`index.html`) - HU-2.1

Dashboard enfocado en la gestión diaria con layout de 3 filas:

**Primera Fila - Acciones Rápidas**:
- **🔍 Check-in Inteligente**: Búsqueda por DNI con validación de horarios
- **➕ Nueva Orden**: Acceso directo a crear órdenes

**Segunda Fila - Citas de Hoy**:
- **📅 Citas Programadas**: Lista de todas las citas del día actual
- **🔄 Estados dinámicos**: Programada → En Curso → Realizada/Ausente
- **⏰ Indicadores de tiempo**: Visual de citas próximas, en curso y pasadas

**Tercera Fila - Estadísticas Diarias**:
- **📊 Citas del Día**: Contador en tiempo real
- **✅ Sesiones Realizadas**: Progreso del día
- **💰 Ingresos Estimados**: Cálculo automático

**Ejemplo de uso**:
1. Ver citas programadas para hoy automáticamente
2. Buscar paciente por DNI `12345678`
3. Check-in inteligente valida si llega a tiempo (±30min)
4. Confirmación modal para llegadas tempranas/tardías

### 📋 Gestión de Órdenes (`pages/ordenes.html`)

Centro de control para el manejo completo de órdenes:

#### Crear Nueva Orden
1. Click en "Nueva Orden"
2. Seleccionar paciente existente o crear uno nuevo
3. Elegir obra social, médico derivante y práctica
4. Definir fecha de emisión y cantidad de sesiones
5. El sistema **automáticamente** genera todas las sesiones pendientes

#### Filtros Avanzados
- **Estado**: Abierta, Cerrada Normal, Cerrada Manual
- **Paciente**: Búsqueda por nombre
- **Obra Social / Práctica**: Filtros por categoría
- **Rango de fechas**: Período específico

#### Acciones Disponibles
- **👁️ Ver detalle**: Modal completo con información de sesiones
- **❌ Cerrar orden**: Marcar manualmente como completada

### ✅ Check-in Inteligente (`pages/checkin.html`) - HU-2.2

Check-in avanzado con validación inteligente de horarios:

#### Flujo de Check-in Inteligente
1. **Búsqueda por DNI**: Input grande y accesible
2. **Validación automática**: Sistema verifica horario de la cita
3. **Tolerancia ±30min**: Ventana de tiempo aceptable
4. **Confirmación inteligente**: Modales específicos para cada caso

#### Casos de Validación
- **✅ A tiempo**: Check-in directo sin confirmación adicional
- **⏰ Temprano**: Modal de confirmación "¿Desea registrar antes de tiempo?"
- **⏰ Tardío**: Modal de confirmación "¿Desea registrar llegada tardía?"
- **❌ Muy fuera de horario**: Notificación de reprogramación sugerida

#### Metadatos de Sesión
- **fecha_real / hora_real**: Timestamp exacto del check-in
- **tipo_atencion**: programada, temprana, tardia
- **cambio_horario**: boolean si hubo modificación
- **motivo_cambio**: razón del cambio si aplica

#### Funcionalidades Extra
- **Marcar ausente**: Registro de inasistencias
- **Historial del día**: Sesiones con metadatos de timing
- **Dashboard actualizado**: Integración automática post check-in

### 📅 Agenda Médica (`pages/agenda.html`) - HU-1.2

Vista de agenda con gestión avanzada de capacidad:

#### Funcionalidades de Agenda
- **🗺️ Vista por días**: Navegación fácil entre fechas
- **📅 Calendario integrado**: Selección visual de fechas
- **⏰ Slots de tiempo**: Visualización de horarios ocupados

#### Gestión de Capacidad
- **🔴 Conflictos visuales**: Identificación automática de solapamientos
- **🟡 Indicadores de color**: Verde (libre), Amarillo (ocupado), Rojo (conflicto)
- **📊 Contador de pacientes**: Número de citas por slot
- **⚠️ Alertas de capacidad**: Notificaciones de sobrecarga

#### Tooltips Informativos
- **📌 Detalles completos**: Paciente, práctica, obra social
- **🔍 Estados**: Programada, En Curso, Realizada, Ausente
- **⏱️ Timing**: Hora programada vs hora real

### 💰 Presentaciones (`pages/presentaciones.html`)

Módulo más complejo del sistema para facturación:

#### Generar Presentación
1. **Seleccionar período**: Mes y año deseado
2. **Vista previa**: Ver qué se incluirá sin guardar
3. **Generar definitiva**: Crear registro y marcar sesiones como presentadas
4. **Exportar Excel**: Descarga automática del archivo

#### Algoritmo Inteligente
- **Recolección automática**: Sesiones realizadas en el período
- **Aplicación de límites**: Respeta límites mensuales por obra social
- **Cálculo de aranceles**: Usa tarifas vigentes en fecha de prestación
- **Agrupación por OS**: Reportes organizados por obra social

## 🏗️ Arquitectura Técnica

### 📁 Estructura de Archivos

```
MedApp/
├── index.html              # 🏠 Dashboard principal
├── pages/
│   ├── ordenes.html       # 📋 Gestión de órdenes (HU-1.1)
│   ├── agenda.html        # 📅 Agenda médica con capacidad (HU-1.2)
│   ├── checkin.html       # ✅ Check-in inteligente (HU-2.2)
│   └── presentaciones.html # 💰 Generación de reportes
├── js/
│   ├── app.js             # 🧠 Lógica principal y UI
│   ├── agenda.js          # 📅 Lógica específica de agenda
│   ├── storage.js         # 💾 LocalStorage management
│   ├── data.js            # 📊 Datos de prueba expandidos
│   └── utils.js           # 🔧 Utilidades y helpers
├── css/
│   ├── style.css          # 🎨 Estilos personalizados
│   └── agenda.css         # 🎨 Estilos específicos de agenda
├── test.html              # 🧪 Página de testing y debugging
├── README_POC.md          # 📖 Documentación técnica detallada
└── README.md              # 📋 Este archivo
```

### 🧩 Patrón de Módulos

```javascript
// Namespace organizado
const GestorOrdenes = {
    storage: { /* Operaciones LocalStorage */ },
    data: { /* Datos de prueba e inicialización */ },
    utils: { /* Funciones auxiliares */ },
    app: { /* Lógica de negocio */ },
    ui: { /* Manipulación del DOM */ },
    debug: { /* Herramientas de debugging */ }
};
```

### 💾 Schema de LocalStorage

| Clave | Descripción | Ejemplo |
|-------|-------------|---------|
| `gestorOrdenes_ordenes` | Array de órdenes del profesional | `[{id: 1, paciente_id: 1, ...}]` |
| `gestorOrdenes_sesiones` | Array de todas las sesiones | `[{id: 1, orden_id: 1, estado: 'Realizada'}]` |
| `gestorOrdenes_pacientes` | Catálogo compartido de pacientes | `[{id: 1, nombreCompleto: 'Juan Pérez'}]` |
| `gestorOrdenes_obras_sociales` | Catálogo de obras sociales | `[{id: 1, nombre: 'Swiss Medical'}]` |
| `gestorOrdenes_initialized` | Flag de inicialización | `'true'` |

## ⚙️ Algoritmo de Facturación

El **núcleo más complejo** del sistema que implementa las reglas de negocio específicas:

### 🔄 Flujo de 5 Pasos

#### 1️⃣ **Recolección de Sesiones Candidatas**
```javascript
// Criterios de inclusión:
- pertenecen al profesional_id actual
- estado !== 'Presentada' 
- obra social con incluir_en_presentacion = true
- ALGUNA de estas condiciones:
  * estado = 'Realizada' Y fechaPrestacion en período
  * orden 'Cerrada Manual' Y fechaCierre en período  
  * estado = 'Realizada' Y fechaPrestacion anterior (diferidas)
```

#### 2️⃣ **Aplicación de Límites Mensuales**
```javascript
// Por cada grupo (obra_social + paciente):
if (limite_sesiones_mensual_paciente > 0) {
    // Ordenar por fechaPrestacion (más antigua primero)
    // Tomar solo las primeras N sesiones
    sesiones = sesiones.slice(0, limite);
}
```

#### 3️⃣ **Cálculo de Importes**
```javascript
// Para cada sesión:
const arancel = buscarArancelVigente(
    practica_id, 
    obraSocial_id, 
    fechaPrestacion
);
// Usa la tarifa más reciente pero anterior a la fecha de prestación
```

#### 4️⃣ **Consolidación por Obra Social**
- Agrupación automática por OS
- Subtotales por grupo
- Total general
- Formato de reporte estructurado

#### 5️⃣ **Persistencia y Actualización**
- Crear registro en tabla `Presentaciones`
- Marcar sesiones como `'Presentada'`
- Generar logs de auditoría

### 📊 Reglas de Negocio Implementadas

| Regla | Descripción | Implementación |
|-------|-------------|----------------|
| **Límites mensuales** | Max sesiones por paciente/OS | Slice de array ordenado |
| **Aranceles históricos** | Precio vigente en fecha prestación | Lookup con filtro de fecha |
| **Sesiones diferidas** | Incluir pendientes de meses anteriores | Filtro de fecha flexible |
| **Estados exclusivos** | Una sesión no puede presentarse 2 veces | Estado 'Presentada' |

## 🧪 Testing y Debugging

### 🔬 Página de Testing (`test.html`)

Suite de pruebas actualizada para todas las historias de usuario:

```javascript
// Funciones disponibles:
- runAllTests()           // Suite completa de pruebas para HU-1.1 a HU-2.2
- testSearch()           // Buscar paciente específico
- testCreateOrder()      // Crear orden de prueba (HU-1.1)
- testAgenda()           // Testing de agenda y capacidad (HU-1.2)
- testDashboard()        // Dashboard diario y estadísticas (HU-2.1)
- testSmartCheckin()     // Check-in inteligente con timing (HU-2.2)
- testRegisterSession()  // Registrar sesión con metadatos
- testGenerateBilling()  // Generar presentación
- forceUpdateData()      // Fix cache de LocalStorage
```

**Nuevas Funciones de Testing:**
- **testCapacityManagement()**: Verificar gestión de conflictos de horarios
- **testTimingValidation()**: Validar check-in inteligente con diferentes casos
- **testDashboardStats()**: Estadísticas en tiempo real del dashboard
- **testNotificationSystem()**: Sistema de notificaciones integrado

### 🔧 Herramientas de Consola

```javascript
// Debugging desde DevTools:
GestorOrdenes.debug.checkOrder3()      // Diagnosticar orden específica
GestorOrdenes.debug.forceUpdateData()  // Actualizar datos forzosamente
GestorOrdenes.data.reset()             // Reset completo
```

### 🐛 Solución de Problemas Comunes

#### ❌ "Los datos no se actualizan"
```javascript
// Problema: Cache de LocalStorage
// Solución:
GestorOrdenes.debug.forceUpdateData();
// O refrescar navegador con Ctrl+F5
```

#### ❌ "No aparecen las sesiones de Ana Sofía"
```javascript
// El sistema auto-detecta y corrige en data.js:init()
// Si persiste, ejecutar manualmente:
GestorOrdenes.data.forceUpdate();
```

#### ❌ "Error en generación de presentación"
```javascript
// Verificar que hay sesiones realizadas:
const sesiones = GestorOrdenes.storage.sesiones.getRealizadas();
console.log('Sesiones realizadas:', sesiones.length);
```

## 🚀 Roadmap

### 📋 Próximos Pasos para MVP

#### **Fase 1: Backend Integration**
- [ ] API REST con Node.js/Express o Python/Django  
- [ ] Base de datos PostgreSQL/MySQL
- [ ] Autenticación JWT real
- [ ] Multi-tenancy con aislamiento por profesional

#### **Fase 2: Seguridad y Escalabilidad**
- [ ] Encriptación de datos sensibles
- [ ] Auditoría completa de acciones
- [ ] Rate limiting y protección CSRF
- [ ] Backup automático de datos

#### **Fase 3: Funcionalidades Avanzadas**
- [ ] OCR para digitización automática de órdenes
- [ ] QR codes para check-in de pacientes
- [ ] Reportes avanzados y analytics
- [ ] Integración con APIs de obras sociales
- [ ] App móvil React Native

#### **Fase 4: Integraciones**
- [ ] Facturación electrónica AFIP
- [ ] Sincronización con sistemas de gestión hospitalaria
- [ ] API pública para desarrolladores
- [ ] Webhooks para notificaciones

### 🎯 Funcionalidades v2.0

| Funcionalidad | Descripción | Prioridad |
|---------------|-------------|-----------|
| **📱 App Móvil** | React Native para check-in móvil | 🔥 Alta |
| **🤖 OCR Órdenes** | Digitalización automática | 🔥 Alta |
| **📊 Analytics** | Dashboard con métricas avanzadas | 🟡 Media |
| **🔗 Integraciones** | APIs de obras sociales | 🟡 Media |
| **💬 Notificaciones** | WhatsApp/SMS automático | 🔵 Baja |

## 🤝 Contribuciones

### 📋 Cómo Contribuir

1. **Fork** del repositorio
2. **Clone** tu fork localmente
3. Crear **branch** para tu feature: `git checkout -b feature/nueva-funcionalidad`
4. **Commit** con mensajes descriptivos: `git commit -m "Add: nueva funcionalidad X"`
5. **Push** a tu branch: `git push origin feature/nueva-funcionalidad`
6. Crear **Pull Request** con descripción detallada

### ✅ Guidelines de Desarrollo

- **Código limpio**: Seguir patrones existentes
- **Comentarios**: Documentar lógica compleja
- **Testing**: Probar en múltiples navegadores
- **Responsive**: Verificar en móvil y desktop
- **Performance**: Optimizar para LocalStorage grande

### 🏷️ Estructura de Commits

```
tipo: descripción breve

Descripción más detallada si es necesario

- Cambio específico 1
- Cambio específico 2

Resolves #123
```

**Tipos de commits**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug  
- `docs`: Documentación
- `style`: Formato de código
- `refactor`: Reestructuración
- `test`: Pruebas
- `chore`: Tareas de mantenimiento

## 📚 Documentación Técnica

### Documentos Adicionales

- **[📖 POC Detallado](docs/POC.md)** - Documentación técnica completa del POC
- **[⚙️ Configuración Claude](/.claude/Claude.md)** - Guía para Claude Code IDE  
- **[🧪 Testing](test.html)** - Suite de pruebas para HU-1.1 a HU-2.2

### Arquitectura de Carpetas

```
📁 docs/           # Documentación adicional
📁 .claude/        # Configuración Claude Code
├── examples/      # Ejemplos de UI/UX
└── Claude.md      # Guía técnica
```

## 📄 Licencia

Este proyecto está licenciado bajo la **MIT License** - ver el archivo [LICENSE](LICENSE) para detalles.

### 🙏 Reconocimientos

- **Bootstrap** - Framework UI
- **Bootstrap Icons** - Iconografía
- **SheetJS** - Exportación Excel
- **GitHub** - Hosting del repositorio
- **Anthropic Claude** - Asistencia en desarrollo

---

## 📞 Soporte y Contacto

- **🐛 Issues**: [GitHub Issues](https://github.com/tu-usuario/gestor-ordenes/issues)
- **💬 Discusiones**: [GitHub Discussions](https://github.com/tu-usuario/gestor-ordenes/discussions)
- **📧 Email**: tu-email@dominio.com

---

<div align="center">

**⭐ Si este proyecto te resulta útil, no olvides darle una estrella ⭐**

*Desarrollado con ❤️ para optimizar la gestión administrativa de profesionales de la salud*

</div>