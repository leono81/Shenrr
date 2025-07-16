# 📅 Gestión de Citas - Seguimiento de Historias de Usuario

## 📋 Información del Proyecto

**Proyecto:** MedApp - Sistema de Gestión de Órdenes para Profesionales de la Salud  
**Feature:** Módulo de Gestión de Citas  
**Versión:** POC v1.1  
**Fecha inicio:** Julio 2025  

### 🎯 Objetivo
Agregar funcionalidad completa de gestión de citas al POC existente, integrándose seamlessly con el flujo actual de órdenes y sesiones.

### 📊 Estado General del Progreso

```
Total de Historias: 5
├── ✅ Completadas: 3 (HU-1.1, HU-1.2, HU-1.3)
├── 🔄 En Progreso: 0  
└── ⏳ Pendientes: 2 (HU-2.1, HU-2.2)

Total de Tareas: 23
├── ✅ Completadas: 13 (Sprint 1 completo)
├── 🔄 En Progreso: 0
└── ⏳ Pendientes: 10 (Sprint 2 y 3)
```

---

## 🗓️ ROADMAP DE SPRINTS

### **Sprint 1: Fundación (Semana 1-2)** ✅ **COMPLETADO**
- 🎯 **Objetivo**: Implementar creación de órdenes con programación automática
- 📦 **Historias**: HU-1.1, HU-1.2, HU-1.3 
- ⏱️ **Estimación**: 40-50 horas
- ✅ **Estado**: Todas las historias implementadas y funcionales

### **Sprint 2: Dashboard y Notificaciones (Semana 3)**  
- 🎯 **Objetivo**: Renovar dashboard y sistema de alertas
- 📦 **Historias**: HU-2.1 (HU-1.2 movido a Sprint 1)
- ⏱️ **Estimación**: 15-20 horas

### **Sprint 3: Check-in Inteligente (Semana 4)**
- 🎯 **Objetivo**: Integrar validación de horarios en check-in
- 📦 **Historias**: HU-2.2
- ⏱️ **Estimación**: 15-20 horas

---

## 📋 HISTORIAS DE USUARIO

### 🔹 HU-1.1: Definir Horarios al Crear Orden

**Como** profesional de la salud  
**Quiero** definir días y horarios de las sesiones al momento de crear una orden  
**Para** que todas las sesiones queden automáticamente agendadas desde el inicio

#### 📊 Progreso: 6/6 tareas completadas ✅ **COMPLETADA**

#### 🛠️ Tareas Técnicas

##### ✅ **T-1.1.1: Extender Modelo de Datos** ⏱️ 4h ✅ **COMPLETADA**
- [x] **Subtarea 1.1.1.A**: Modificar entidad `orden` en `js/data.js`
  ```javascript
  // Agregar campos:
  programacion_tipo: 'habiles|lmv|mtj|personalizada',
  hora_sesiones: '09:00',
  fecha_primera_sesion: '2025-07-20'
  ```
- [x] **Subtarea 1.1.1.B**: Extender entidad `sesion` en `js/data.js`
  ```javascript
  // Agregar campos:
  fecha_programada: Date,
  hora_programada: Time,
  fecha_real: Date,
  hora_real: Time,
  tipo_atencion: 'programada|urgencia|reprogramada'
  ```
- [x] **Subtarea 1.1.1.C**: Actualizar métodos en `js/storage.js`
  - Extender `ordenes.save()` para manejar nuevos campos
  - Extender `sesiones.save()` para manejar campos de tiempo

##### ✅ **T-1.1.2: Modificar Formulario de Nueva Orden** ⏱️ 8h ✅ **COMPLETADA**
- [x] **Subtarea 1.1.2.A**: Modificar `pages/ordenes.html`
  - Agregar sección "📅 Programación de Sesiones" después del campo cantidad
  - Radio buttons para frecuencia (habiles/lmv/mtj/personalizada)
  - Time picker para hora de inicio
  - Date picker para fecha de primera sesión
- [x] **Subtarea 1.1.2.B**: Extender validaciones en `js/app.js`
  - Actualizar `validateOrdenData()` para incluir validaciones de programación
  - Validar que hora_sesiones esté en formato HH:MM
  - Validar que fecha_primera_sesion no sea en el pasado
- [x] **Subtarea 1.1.2.C**: Crear estilos específicos en `css/style.css`
  - Estilos para la sección de programación
  - Responsive design para los date/time pickers

##### ✅ **T-1.1.3: Implementar Algoritmo de Generación Automática** ⏱️ 12h ✅ **COMPLETADA**
- [x] **Subtarea 1.1.3.A**: Crear función `generateAutomaticSchedule()` en `js/app.js`
  ```javascript
  // Función que:
  // 1. Recibe orden con configuración de programación
  // 2. Calcula todas las fechas según frecuencia
  // 3. Genera array de sesiones con fecha/hora
  // 4. Valida conflictos básicos
  ```
- [x] **Subtarea 1.1.3.B**: Crear helper functions en `js/utils.js`
  - `calculateBusinessDays(startDate, sessions)` 
  - `calculateMWFSchedule(startDate, sessions)`
  - `calculateTTSchedule(startDate, sessions)`
  - `validateTimeConflicts(newSessions, existingSessions)`
- [x] **Subtarea 1.1.3.C**: Integrar generación en `handleOrdenSubmit()`
  - Llamar a generación automática después de crear orden
  - Crear todas las sesiones con estados "Programada"
  - Manejar errores de conflictos

##### ✅ **T-1.1.4: Implementar Validación de Conflictos** ⏱️ 6h ✅ **COMPLETADA**
- [x] **Subtarea 1.1.4.A**: Crear función de detección de conflictos
  ```javascript
  // En js/app.js
  checkScheduleConflicts(newSessions) {
    // Retorna array de conflictos encontrados
    // Formato: {sesion_id, fecha, hora, conflictos: []}
  }
  ```
- [x] **Subtarea 1.1.4.B**: Modal de resolución de conflictos
  - Crear modal en HTML para mostrar conflictos
  - Opciones: "Continuar de todas formas" / "Revisar manualmente"
  - Marcar sesiones con flag `conflicto: true`
- [x] **Subtarea 1.1.4.C**: Integrar en flujo de creación
  - Mostrar modal solo si hay conflictos
  - Permitir continuar con warning
  - Guardar log de conflictos para revisión posterior

##### ✅ **T-1.1.5: Modal de Fechas Personalizadas** ⏱️ 8h ✅ **COMPLETADA**
- [x] **Subtarea 1.1.5.A**: Crear modal para selección manual
  - HTML del modal con calendario múltiple
  - Permitir seleccionar fechas específicas para cada sesión
  - Validación de que no falten sesiones
- [x] **Subtarea 1.1.5.B**: Lógica de fechas personalizadas
  - Función para manejar selección manual
  - Integrar con algoritmo de generación automática
  - Persistir configuración personalizada
- [x] **Subtarea 1.1.5.C**: UX para fechas personalizadas
  - Drag & drop para reordenar sesiones
  - Preview del calendario resultante
  - Validaciones de fechas duplicadas

##### ✅ **T-1.1.6: Testing y Validación** ⏱️ 4h ✅ **COMPLETADA**
- [x] **Subtarea 1.1.6.A**: Casos de prueba básicos
  - Crear orden con programación "habiles"
  - Crear orden con programación "lmv"  
  - Crear orden con programación "mtj"
  - Verificar que todas las sesiones se crean correctamente
- [x] **Subtarea 1.1.6.B**: Casos de prueba de conflictos
  - Crear órdenes con horarios solapados
  - Verificar que se detectan los conflictos
  - Probar resolución de conflictos
- [x] **Subtarea 1.1.6.C**: Casos edge
  - Órdenes de 1 sesión
  - Fechas festivas/fines de semana
  - Meses con diferente cantidad de días

#### 📁 Archivos a Modificar
- `pages/ordenes.html` - Formulario extendido
- `js/app.js` - Lógica de creación y algoritmos
- `js/data.js` - Modelo de datos
- `js/storage.js` - Persistencia
- `js/utils.js` - Funciones auxiliares
- `css/style.css` - Estilos

#### 🔗 Dependencias
- Ninguna (historia base)

---

### 🔹 HU-1.2: Sistema de Notificaciones y Alertas

**Como** profesional de la salud  
**Quiero** recibir notificaciones sobre órdenes sin programar y conflictos  
**Para** mantener mi agenda organizada y no perder sesiones

#### 📊 Progreso: 4/4 tareas completadas ✅ **COMPLETADA**

#### 🛠️ Tareas Técnicas

##### ✅ **T-1.2.1: Crear Modelo de Notificaciones** ⏱️ 3h ✅ **COMPLETADA**
- [x] **Subtarea 1.2.1.A**: Definir entidad `notificacion` en `js/data.js`
  ```javascript
  notificacion: {
    id: Number,
    tipo: 'orden_sin_programar|conflicto_horario|cita_proxima',
    mensaje: String,
    orden_id: Number,
    fecha_creacion: DateTime,
    leida: Boolean,
    accion_url: String
  }
  ```
- [x] **Subtarea 1.2.1.B**: Agregar storage para notificaciones
  - Nuevo key en `js/storage.js`: `NOTIFICACIONES`
  - Métodos CRUD básicos para notificaciones
  - Método para marcar como leída

##### ✅ **T-1.2.2: Sistema de Detección Automática** ⏱️ 6h ✅ **COMPLETADA**
- [x] **Subtarea 1.2.2.A**: Detector de órdenes sin programar
  ```javascript
  // En js/app.js
  detectUnscheduledOrders() {
    // Busca órdenes con sesiones en estado "Pendiente" sin fecha
    // Crea notificaciones automáticamente
  }
  ```
- [x] **Subtarea 1.2.2.B**: Detector de conflictos de horario
  ```javascript
  detectScheduleConflicts() {
    // Analiza todas las sesiones programadas
    // Identifica solapamientos de horario
    // Genera notificaciones de conflicto
  }
  ```
- [x] **Subtarea 1.2.2.C**: Scheduler automático
  - Ejecutar detectores al cargar la aplicación
  - Ejecutar después de crear/modificar órdenes
  - Limpieza automática de notificaciones obsoletas

##### ✅ **T-1.2.3: Widget de Notificaciones en Dashboard** ⏱️ 5h ✅ **COMPLETADA**
- [x] **Subtarea 1.2.3.A**: Modificar `index.html`
  - Agregar sección "🔔 Notificaciones" en dashboard
  - Layout responsive para diferentes tipos de alerta
  - Botones de acción por notificación
- [x] **Subtarea 1.2.3.B**: Lógica de renderizado en `js/app.js`
  ```javascript
  renderNotifications() {
    // Obtiene notificaciones no leídas
    // Renderiza con colores según tipo
    // Agrega eventos de click para acciones
  }
  ```
- [x] **Subtarea 1.2.3.C**: Estilos en `css/style.css`
  - Colores por tipo: rojo (crítico), amarillo (warning), azul (info)
  - Animaciones sutiles para nuevas notificaciones
  - Responsive design

##### ✅ **T-1.2.4: Marcado Visual en Lista de Órdenes** ⏱️ 4h ✅ **COMPLETADA**
- [x] **Subtarea 1.2.4.A**: Modificar `pages/ordenes.html`
  - Agregar columna de "Estado" en tabla de órdenes
  - Iconos visuales: 🔴 sin programar, ⚠️ conflictos, ✅ ok
- [x] **Subtarea 1.2.4.B**: Botón "Programar Ahora"
  - Botón de acción rápida para órdenes sin programar
  - Modal simplificado de programación rápida
  - Integración con algoritmo de generación automática
- [x] **Subtarea 1.2.4.C**: Filtros por estado
  - Filtro "Solo órdenes sin programar"
  - Filtro "Solo órdenes con conflictos"
  - Contador de órdenes por estado

#### 📁 Archivos a Modificar
- `index.html` - Widget de notificaciones
- `pages/ordenes.html` - Marcado visual
- `js/app.js` - Detectores y lógica
- `js/data.js` - Modelo de datos
- `js/storage.js` - Persistencia
- `css/style.css` - Estilos

#### 🔗 Dependencias
- HU-1.1 (necesita modelo extendido de órdenes)

---

### 🔹 HU-1.3: Gestión de Capacidad Concurrente

**Como** profesional de la salud  
**Quiero** ver cuántos pacientes tengo programados por horario  
**Para** gestionar la capacidad de atención simultánea

#### 📊 Progreso: 3/3 tareas completadas ✅ **COMPLETADA**

#### 🛠️ Tareas Técnicas

##### ✅ **T-1.3.1: Crear Vista de Calendario** ⏱️ 10h ✅ **COMPLETADA**
- [x] **Subtarea 1.3.1.A**: Crear nueva página `pages/agenda.html`
  - Layout de calendario semanal/diario
  - Navigation entre semanas/días
  - Grid de horarios (08:00 - 20:00 en intervalos de 1h)
- [x] **Subtarea 1.3.1.B**: Lógica de calendario en `js/agenda.js` (nuevo archivo)
  ```javascript
  GestorOrdenes.agenda = {
    loadCalendarView(date, view) {},
    renderTimeSlots() {},
    calculateCapacity() {},
    showCapacityIndicators() {}
  }
  ```
- [x] **Subtarea 1.3.1.C**: Estilos de calendario en `css/agenda.css` (nuevo archivo)
  - Grid layout responsivo
  - Color coding para capacidad
  - Hover effects y tooltips

##### ✅ **T-1.3.2: Indicadores de Capacidad** ⏱️ 6h ✅ **COMPLETADA**
- [x] **Subtarea 1.3.2.A**: Lógica de conteo de pacientes
  ```javascript
  // En js/agenda.js
  getCapacityByTimeSlot(date, hour) {
    // Retorna: {count: 3, patients: [...], color: 'yellow'}
  }
  ```
- [x] **Subtarea 1.3.2.B**: Color coding visual
  - Verde: 1-2 pacientes
  - Amarillo: 3-4 pacientes
  - Rojo: 5+ pacientes
  - Gris: Sin citas programadas
- [x] **Subtarea 1.3.2.C**: Tooltips informativos
  - Hover sobre slot muestra lista de pacientes
  - Información: nombre, práctica, estado
  - Acciones rápidas desde tooltip

##### ✅ **T-1.3.3: Warning al Programar** ⏱️ 4h ✅ **COMPLETADA**
- [x] **Subtarea 1.3.3.A**: Validación en tiempo real
  - Al seleccionar horario en formularios, mostrar capacidad actual
  - Warning visual si hay 3+ pacientes programados
- [x] **Subtarea 1.3.3.B**: Modal de confirmación
  - "⚠️ Ya tienes X pacientes programados en este horario"
  - Opciones: "Continuar de todas formas" / "Elegir otro horario"
- [x] **Subtarea 1.3.3.C**: Sugerencias automáticas
  - Mostrar horarios alternativos cercanos con menor carga
  - Quick-select para horarios sugeridos

#### 📁 Archivos a Crear
- `pages/agenda.html` - Nueva página de calendario
- `js/agenda.js` - Lógica específica de calendario
- `css/agenda.css` - Estilos de calendario

#### 📁 Archivos a Modificar
- `index.html` - Link en navegación
- `js/app.js` - Integración con validaciones

#### 🔗 Dependencias
- HU-1.1 (necesita sesiones programadas)

---

### 🔹 HU-2.1: Dashboard Diario Simplificado

**Como** profesional de la salud  
**Quiero** ver solo la información relevante del día actual en mi dashboard  
**Para** enfocarme en mi agenda diaria sin distracciones

#### 📊 Progreso: 0/4 tareas completadas

#### 🛠️ Tareas Técnicas

##### ✅ **T-2.1.1: Reestructurar Layout del Dashboard** ⏱️ 6h
- [ ] **Subtarea 2.1.1.A**: Modificar `index.html` completamente
  - **Eliminar**: Estadísticas generales, tabla de órdenes recientes
  - **Eliminar**: Botón "Generar Presentación" 
  - **Mantener**: Check-in rápido (col-8)
  - **Agregar**: Botón "Nueva Orden" (col-4)
- [ ] **Subtarea 2.1.1.B**: Nuevo layout responsive
  - Fila 1: Check-in + Nueva Orden
  - Fila 2: Citas de Hoy (ancho completo)
  - Fila 3: Estadísticas del día (3 widgets pequeños)
- [ ] **Subtarea 2.1.1.C**: Actualizar navegación
  - Remover enlaces a estadísticas generales
  - Agregar enlace a nueva página "Agenda"

##### ✅ **T-2.1.2: Widget "Citas de Hoy"** ⏱️ 8h
- [ ] **Subtarea 2.1.2.A**: HTML del widget en `index.html`
  ```html
  <div class="card">
    <div class="card-header">
      <h5>📅 Agenda de Hoy - [Fecha actual]</h5>
    </div>
    <div class="card-body" id="citasHoy">
      <!-- Lista dinámica -->
    </div>
  </div>
  ```
- [ ] **Subtarea 2.1.2.B**: Lógica de renderizado en `js/app.js`
  ```javascript
  GestorOrdenes.ui.loadTodayAppointments() {
    // Obtiene citas programadas para hoy
    // Ordena cronológicamente
    // Renderiza con estados visuales
    // Agrega botones de acción
  }
  ```
- [ ] **Subtarea 2.1.2.C**: Estados dinámicos y acciones
  - Cálculo de estado "EN CURSO" basado en hora actual (±15 min)
  - Botones contextuales por estado
  - Actualización automática cada 5 minutos

##### ✅ **T-2.1.3: Estadísticas del Día** ⏱️ 4h
- [ ] **Subtarea 2.1.3.A**: Tres widgets de estadísticas
  - **Widget 1**: "Citas Programadas Hoy" - Total del día
  - **Widget 2**: "Citas Completadas" - Realizadas/Total con %
  - **Widget 3**: "Próxima Cita" - Hora de la siguiente pendiente
- [ ] **Subtarea 2.1.3.B**: Lógica de cálculo en `js/utils.js`
  ```javascript
  getTodayStats() {
    return {
      programadas: Number,
      completadas: Number,
      proximaCita: Time | null
    }
  }
  ```
- [ ] **Subtarea 2.1.3.C**: Actualización en tiempo real
  - Recalcular después de cada acción de check-in
  - Refresh automático de "Próxima Cita"

##### ✅ **T-2.1.4: Integración con Check-in Existente** ⏱️ 5h
- [ ] **Subtarea 2.1.4.A**: Modificar `performQuickSearch()` en `js/app.js`
  - Al buscar paciente por DNI, verificar si tiene cita hoy
  - Mostrar destacado: "✅ Tiene cita programada para las 14:00"
  - Integrar información de la cita en resultado de búsqueda
- [ ] **Subtarea 2.1.4.B**: Actualización automática de widgets
  - Después de confirmar check-in, actualizar lista de citas
  - Actualizar estadísticas del día
  - Smooth animations para cambios de estado
- [ ] **Subtarea 2.1.4.C**: Caso sin citas programadas
  - Template especial cuando no hay citas para hoy
  - Botones de acceso rápido: "Ver Órdenes Pendientes" / "Crear Nueva Orden"

#### 📁 Archivos a Modificar
- `index.html` - Reestructuración completa
- `js/app.js` - Nueva lógica de dashboard y integración
- `js/utils.js` - Funciones de estadísticas
- `css/style.css` - Estilos actualizados

#### 🔗 Dependencias
- HU-1.1 (necesita sesiones programadas)

---

### 🔹 HU-2.2: Check-in Inteligente

**Como** profesional de la salud  
**Cuando** hago check-in de un paciente  
**Quiero** que el sistema valide horario esperado vs. real  
**Para** mantener control sobre mi agenda

#### 📊 Progreso: 0/4 tareas completadas

#### 🛠️ Tareas Técnicas

##### ✅ **T-2.2.1: Validación de Horario en Check-in** ⏱️ 6h
- [ ] **Subtarea 2.2.1.A**: Modificar `performQuickSearch()` en `js/app.js`
  - Al buscar paciente, verificar cita programada para hoy
  - Comparar hora actual vs. hora programada
  - Determinar si está "a tiempo" (±30 min)
- [ ] **Subtarea 2.2.1.B**: Lógica de validación temporal
  ```javascript
  validateAppointmentTiming(cita, horaActual) {
    // Retorna: {status: 'onTime|early|late|noAppointment', difference: minutes}
  }
  ```
- [ ] **Subtarea 2.2.1.C**: Mensajes contextuales
  - "✅ Cita programada para las [hora]" - Si está a tiempo
  - "⏰ Llegó temprano - Cita programada para las [hora]" - Si es temprano
  - "⏰ Llegó tarde - Cita programada para las [hora]" - Si es tarde
  - "📅 No tiene cita programada para hoy" - Sin cita

##### ✅ **T-2.2.2: Diálogos de Confirmación** ⏱️ 8h
- [ ] **Subtarea 2.2.2.A**: Modal para paciente temprano/tarde
  ```html
  <div class="modal" id="confirmTimingModal">
    <!-- Contenido dinámico según escenario -->
  </div>
  ```
- [ ] **Subtarea 2.2.2.B**: Escenarios y opciones
  - **Escenario 1**: Paciente temprano/tarde con cita hoy
    - Opciones: "Atender ahora" / "Mantener horario original"
  - **Escenario 2**: Paciente sin cita programada hoy
    - Opciones: "Atender como urgencia" / "Reagendar para otro día"
- [ ] **Subtarea 2.2.2.C**: Lógica de decisiones
  - Si elige "Atender ahora": actualizar cita con hora real
  - Si elige "Atender como urgencia": crear registro especial
  - Si elige mantener/reagendar: no procesar check-in

##### ✅ **T-2.2.3: Actualización de Registros** ⏱️ 4h
- [ ] **Subtarea 2.2.3.A**: Modificar función `registerTodaySession()`
  - Agregar parámetros de timing (hora programada vs. real)
  - Actualizar registro de sesión con horarios reales
  - Mantener referencia a cita original
- [ ] **Subtarea 2.2.3.B**: Historial de cambios
  ```javascript
  // Extender modelo de sesión
  sesion: {
    // ... campos existentes
    hora_programada_original: Time,
    cambio_horario: Boolean,
    motivo_cambio: 'urgencia|adelanto|atraso|reagendado'
  }
  ```
- [ ] **Subtarea 2.2.3.C**: Logs para estadísticas
  - Registrar patrones de puntualidad
  - Datos para futuras métricas de gestión

##### ✅ **T-2.2.4: Integración con Dashboard** ⏱️ 3h
- [ ] **Subtarea 2.2.4.A**: Actualización automática
  - Después de check-in inteligente, refresh de widgets
  - Actualizar estado de cita en lista del día
  - Recalcular estadísticas
- [ ] **Subtarea 2.2.4.B**: Indicadores visuales
  - Marcar citas atendidas fuera de horario con icono especial
  - Color coding: verde (a tiempo), amarillo (cambio menor), rojo (urgencia)
- [ ] **Subtarea 2.2.4.C**: Notas automáticas
  - Agregar nota automática en cita si hubo cambio de horario
  - Ejemplo: "Atendido a las 14:45 (programado 14:00)"

#### 📁 Archivos a Modificar
- `js/app.js` - Lógica de validación y check-in
- `index.html` - Modales de confirmación
- `js/data.js` - Modelo extendido de sesión
- `css/style.css` - Estilos para modales y estados

#### 🔗 Dependencias
- HU-1.1 (necesita sesiones programadas)
- HU-2.1 (integración con dashboard renovado)

---

## 🔧 INFORMACIÓN TÉCNICA GENERAL

### 📦 Nuevos Archivos a Crear
```
MedApp/
├── pages/
│   └── agenda.html          # Vista de calendario (HU-1.3)
├── js/
│   └── agenda.js           # Lógica de calendario (HU-1.3)
├── css/
│   └── agenda.css          # Estilos de calendario (HU-1.3)
└── HISTORIAS_CITAS.md      # Este archivo
```

### 📝 Archivos Existentes a Modificar
```
📁 Archivos HTML:
├── index.html              # Dashboard renovado (HU-2.1)
└── pages/ordenes.html      # Formulario extendido (HU-1.1) + notificaciones (HU-1.2)

📁 Archivos JavaScript:
├── js/app.js              # Lógica principal (TODAS las HU)
├── js/data.js             # Modelo de datos extendido (HU-1.1, HU-1.2)
├── js/storage.js          # Persistencia ampliada (HU-1.1, HU-1.2)
└── js/utils.js            # Funciones auxiliares (HU-1.1, HU-2.1)

📁 Archivos CSS:
└── css/style.css          # Estilos generales (TODAS las HU)
```

### 🗃️ Modelo de Datos Consolidado

#### Entidades Existentes Extendidas
```javascript
// ORDEN (extendida)
orden: {
  // ... campos existentes
  programacion_tipo: 'habiles|lmv|mtj|personalizada',
  hora_sesiones: '09:00',
  fecha_primera_sesion: '2025-07-20'
}

// SESIÓN (extendida)
sesion: {
  // ... campos existentes  
  fecha_programada: Date,
  hora_programada: Time,
  fecha_real: Date,
  hora_real: Time,
  tipo_atencion: 'programada|urgencia|reprogramada',
  hora_programada_original: Time,
  cambio_horario: Boolean,
  motivo_cambio: 'urgencia|adelanto|atraso|reagendado'
}
```

#### Entidades Nuevas
```javascript
// NOTIFICACIÓN (nueva)
notificacion: {
  id: Number,
  tipo: 'orden_sin_programar|conflicto_horario|cita_proxima',
  mensaje: String,
  orden_id: Number,
  fecha_creacion: DateTime,
  leida: Boolean,
  accion_url: String
}
```

### 🔄 Integración con Sistema Existente

#### Storage Keys Adicionales
```javascript
// En js/storage.js - agregar keys:
NOTIFICACIONES: 'gestorOrdenes_notificaciones'
```

#### Navegación Actualizada
```html
<!-- En index.html y páginas existentes -->
<nav class="navbar">
  <!-- ... enlaces existentes -->
  <a class="nav-link" href="pages/agenda.html">
    <i class="bi bi-calendar3"></i> Agenda
  </a>
</nav>
```

---

## 📋 CHECKLIST DE TESTING

### ✅ Casos de Prueba por Historia

#### HU-1.1: Definir Horarios al Crear Orden ✅ **COMPLETADA**
- [x] **Test 1**: Crear orden con programación "todos los días hábiles"
- [x] **Test 2**: Crear orden con programación "lunes-miércoles-viernes"  
- [x] **Test 3**: Crear orden con programación "martes-jueves"
- [x] **Test 4**: Crear orden con fechas personalizadas
- [x] **Test 5**: Verificar conflictos de horario
- [x] **Test 6**: Resolver conflictos con opciones del modal

#### HU-1.2: Sistema de Notificaciones ✅ **COMPLETADA**
- [x] **Test 7**: Crear orden sin programar - verificar notificación
- [x] **Test 8**: Crear órdenes con conflicto - verificar alerta
- [x] **Test 9**: Marcar notificación como leída
- [x] **Test 10**: Accionar "Programar Ahora" desde notificación

#### HU-1.3: Gestión de Capacidad ✅ **COMPLETADA**
- [x] **Test 11**: Vista de calendario con diferentes capacidades
- [x] **Test 12**: Warning al programar en horario saturado
- [x] **Test 13**: Tooltips con información de pacientes

#### HU-2.1: Dashboard Simplificado
- [ ] **Test 14**: Dashboard muestra solo citas del día
- [ ] **Test 15**: Estados dinámicos (pendiente, en curso, realizada)
- [ ] **Test 16**: Estadísticas del día se actualizan en tiempo real
- [ ] **Test 17**: Integración con check-in rápido

#### HU-2.2: Check-in Inteligente
- [ ] **Test 18**: Check-in paciente a tiempo
- [ ] **Test 19**: Check-in paciente temprano - modal de confirmación
- [ ] **Test 20**: Check-in paciente tarde - modal de confirmación
- [ ] **Test 21**: Check-in paciente sin cita - opciones de urgencia
- [ ] **Test 22**: Actualización de registros después de check-in

### 🔍 Testing de Integración
- [ ] **Test 23**: Flujo completo: Crear orden → Ver en dashboard → Check-in → Estadísticas
- [ ] **Test 24**: Compatibilidad con datos existentes del POC
- [ ] **Test 25**: Performance con múltiples citas programadas
- [ ] **Test 26**: Responsive design en móvil/tablet

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs Técnicos
- [ ] **Cobertura de testing**: >90% de los casos definidos
- [ ] **Performance**: Dashboard carga en <2 segundos
- [ ] **Usabilidad**: Crear cita en <5 clicks
- [ ] **Compatibilidad**: Funciona en Chrome, Firefox, Safari

### KPIs de Negocio
- [ ] **Adopción**: 100% de órdenes nuevas con programación automática
- [ ] **Eficiencia**: Reducción de 50% en check-in manual sin cita
- [ ] **Organización**: 0 órdenes sin programar después de 1 semana
- [ ] **Puntualidad**: Tracking de patrones de llegada de pacientes

---

## 📝 NOTAS PARA EL DESARROLLADOR

### 🎯 Prioridades de Implementación
1. **Máxima prioridad**: HU-1.1 (base de todo el sistema)
2. **Alta prioridad**: HU-2.1 (UX mejorada inmediata)
3. **Media prioridad**: HU-1.2, HU-2.2 (mejoras funcionales)
4. **Baja prioridad**: HU-1.3 (nice-to-have)

### ⚠️ Consideraciones Técnicas
- **LocalStorage**: Mantener compatibilidad con datos existentes
- **Performance**: Optimizar cálculos de horarios y conflictos
- **UX**: Mantener consistencia con diseño actual del POC
- **Testing**: Usar datos de prueba existentes cuando sea posible

### 🔄 Versionado y Deploy
- **v1.1.0**: Sprint 1 (HU-1.1 + HU-1.3)
- **v1.1.1**: Sprint 2 (HU-2.1 + HU-1.2)  
- **v1.1.2**: Sprint 3 (HU-2.2)
- **v1.2.0**: Historias adicionales (reprogramación, estadísticas avanzadas)

---

## 🏁 ESTADO DE FINALIZACIÓN

Una historia se considera **COMPLETADA** cuando:
- [ ] ✅ Todas las subtareas están implementadas
- [ ] ✅ Casos de testing pasan exitosamente  
- [ ] ✅ Integración con sistema existente funciona
- [ ] ✅ Documentación técnica actualizada
- [ ] ✅ UX validada por Product Owner

---

*📅 Última actualización: [Fecha actual]*  
*👨‍💻 Preparado para desarrollo por equipo técnico*  
*📋 Total estimado: 80-100 horas de desarrollo*