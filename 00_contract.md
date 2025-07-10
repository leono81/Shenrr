# Contrato Técnico: Gestor de Órdenes para Profesionales de la Salud

**Versión:** 1.8  
**Fecha:** 08 de Julio de 2025

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Objetivo y Alcance del Sistema](#objetivo-y-alcance-del-sistema)
3. [Actores del Sistema](#actores-del-sistema)
4. [Módulos Principales del Sistema](#módulos-principales-del-sistema)
5. [Modelo de Datos Detallado](#modelo-de-datos-detallado)
6. [Flujos de Trabajo Clave](#flujos-de-trabajo-clave)
7. [Requisitos No Funcionales y Futuros](#requisitos-no-funcionales-y-futuros)

---

## Resumen Ejecutivo

Este documento detalla las especificaciones técnicas y funcionales para el desarrollo de un sistema de software de gestión (**SaaS**) con una arquitectura **multi-usuario** (multi-tenant). Este sistema está concebido para abordar la significativa carga administrativa que enfrentan los profesionales de la salud en Argentina.

El objetivo principal es proveer una herramienta integral y segura que optimice el ciclo administrativo completo de las órdenes de consulta, garantizando que cada profesional acceda únicamente a su propia información de facturación, mientras comparte datos comunes como pacientes y aranceles de forma controlada.

---

## 1. Objetivo y Alcance del Sistema

El sistema será una herramienta de software dirigida a profesionales de la salud, diseñada para la gestión, seguimiento y archivo digital de las órdenes de consulta post-autorizadas. 

### Objetivo Principal
Centralizar y organizar todas las órdenes para, al final de un período, consolidar la información y generar los reportes de presentación requeridos por cada **Obra Social** para la gestión del cobro.

> **⚠️ Exclusión Explícita de Alcance**
> 
> El sistema **NO** se conectará, integrará ni gestionará los procesos de solicitud, validación o autorización de órdenes con las Obras Sociales. Es una herramienta interna de gestión para el profesional.

---

## 2. Actores del Sistema

El sistema define **dos roles de usuario** con distintos niveles de permiso:

### Usuario Profesional/Administrativo
- **Rol principal** del sistema (médicos, kinesiólogos, etc.)
- Puede gestionar toda su información privada (órdenes, sesiones, presentaciones)
- Puede crear nuevos pacientes en la base de datos compartida

### Administrador
- **Rol con privilegios elevados**
- Responsable de la gestión de los datos maestros compartidos que afectan a todos los usuarios
- Gestiona: Obras Sociales, Prácticas y el Historial de Aranceles

---

## 3. Módulos Principales del Sistema

El software se compondrá de los siguientes módulos interconectados:

1. **Módulo de Autenticación y Seguridad**
   - Gestiona el registro, inicio y cierre de sesión
   - Seguridad de las cuentas de usuario

2. **Módulo de Gestión de Entidades**
   - Administrar catálogos de Pacientes, Obras Sociales y Médicos Derivantes

3. **Módulo de Prácticas y Aranceles**
   - Definir los servicios prestados
   - Gestionar el historial de valores

4. **Módulo de Órdenes y Sesiones**
   - **Núcleo del sistema**
   - Registrar y dar seguimiento a las prestaciones

5. **Módulo de Presentaciones y Cobranzas**
   - Generar reportes mensuales
   - Realizar seguimiento del estado de pago

---

## 4. Modelo de Datos Detallado / Diccionario de Datos (Arquitectura Multi-Usuario)

> **📋 Nota Importante**
> 
> Todas las tablas principales incluirán columnas de auditoría (`created_at`, `updated_at`, `deleted_at`).

### 4.1. Datos de Usuario

#### Usuario (antes Profesional)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único numérico del usuario |
| `nombreCompleto` | Texto | Nombre y apellido del profesional |
| `matricula` | Texto | Matrícula profesional del usuario |
| `CUIT` | Texto | CUIT del profesional para fines de facturación |
| `email` | Texto | Correo electrónico único, utilizado para el inicio de sesión |
| `password_hash` | Texto | Contraseña almacenada de forma segura mediante un algoritmo de hash |
| `rol` | Enum | Define el nivel de permisos del usuario (`'profesional'` o `'administrador'`) |

---

### 4.2. Datos Compartidos
*Visibles para todos, gestionados por roles específicos*

#### Paciente

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único del paciente |
| `nombreCompleto` | Texto | Nombre y apellido del paciente |
| `dni` | Texto | Documento Nacional de Identidad del paciente |
| `obraSocial_id` | Referencia | Referencia a la obra social principal del paciente |
| `numeroAfiliado` | Texto | Número de afiliado del paciente en su obra social |

#### Obra Social

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único de la Obra Social |
| `nombre` | Texto | Nombre completo de la Obra Social |
| `cuit` | Texto | CUIT de la Obra Social |
| `incluir_en_presentacion` | Booleano | Determina si las sesiones de esta OS deben incluirse en los reportes de facturación |
| `limite_sesiones_mensual_paciente` | Numérico (nullable) | Define el número máximo de sesiones a presentar por paciente en un mes. Si es nulo, no hay límite |

#### Médico Derivante

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único del médico que deriva |
| `nombreCompleto` | Texto | Nombre y apellido del médico derivante |
| `matricula` | Texto | Matrícula profesional del médico derivante |

#### Práctica

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único de la práctica o servicio |
| `nombrePractica` | Texto | Nombre descriptivo del servicio (ej: "Sesión Kinesiología Motora") |
| `codigoInterno` | Texto | Código opcional de la práctica para uso interno |

#### Historial de Aranceles

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único del registro de arancel |
| `practica_id` | Referencia | Referencia a la Práctica |
| `obraSocial_id` | Referencia | Referencia a la Obra Social |
| `importe` | Monetario | Valor monetario de la práctica para esa OS |
| `fecha_vigencia` | Fecha | Fecha a partir de la cual este importe es válido |

---

### 4.3. Datos Privados
*Cada registro pertenece a un solo usuario*

#### Orden

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único de la orden |
| `profesional_id` | Referencia | Referencia al Usuario que gestiona la orden |
| `paciente_id` | Referencia | Referencia al Paciente |
| `obraSocial_id` | Referencia | Referencia a la Obra Social (congela la OS al momento de crear la orden) |
| `medicoDerivante_id` | Referencia (opcional) | Referencia opcional al Médico Derivante |
| `practica_id` | Referencia | Referencia a la Práctica realizada |
| `fechaEmision` | Fecha | Fecha en que la orden fue emitida por la OS |
| `cantidadSesionesTotal` | Numérico | Número total de sesiones autorizadas en la orden |
| `estado` | Enum | Estado actual de la orden (`'Abierta'`, `'Cerrada Normal'`, `'Cerrada Manual'`) |
| `fechaCierre` | Fecha (opcional) | Fecha opcional en que la orden se cierra |

#### Sesión

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único de la sesión |
| `orden_id` | Referencia | Referencia a la Orden a la que pertenece |
| `numeroSesion` | Numérico | Número ordinal de la sesión dentro de la orden (ej: 3 de 10) |
| `fechaPrestacion` | Fecha | Fecha en que se realizó efectivamente la sesión |
| `estado` | Enum | Estado de la sesión (`'Pendiente'`, `'Realizada'`, `'Ausente'`, `'Presentada'`) |

#### Presentación

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Numérico | Identificador único de la presentación mensual |
| `profesional_id` | Referencia | Referencia al Usuario que generó la presentación |
| `fechaGeneracion` | Fecha | Fecha en que se generó el reporte |
| `periodo` | Texto | Período de facturación que cubre el reporte (ej: "Mayo 2025") |
| `importeTotal` | Monetario | Suma total de los importes de las sesiones incluidas en la presentación |
| `estadoCobranza` | Enum | Estado del pago de la presentación (`'Presentada'`, `'Aprobada'`, `'Pagada'`, `'Rechazada'`) |

---

## 5. Flujos de Trabajo Clave (Revisada)

### 5.1. Autenticación y Seguridad de Acceso

- El acceso al sistema requiere autenticación mediante `email` y `password`
- El sistema implementará gestión de sesiones seguras y persistentes

> **🔐 Regla de Oro de Seguridad**
> 
> Toda consulta a las tablas de **Datos Privados** (`Orden`, `Sesión`, `Presentación`) debe ser filtrada obligatoriamente por el `profesional_id` del usuario autenticado.

### 5.2. Gestión de Datos Compartidos

#### Pacientes
- Cualquier **Usuario Profesional** autenticado puede buscar en la lista global de pacientes
- Si no existe, puede crear uno nuevo

#### Obras Sociales, Prácticas y Aranceles
- Solo los usuarios con rol de **Administrador** pueden:
  - Crear registros
  - Modificar registros
  - Eliminar registros

### 5.3. Registro de una Orden

1. Un **Usuario Profesional** autenticado inicia el proceso
2. Selecciona de las listas globales:
   - Un **Paciente** (o lo crea si es nuevo)
   - **Obra Social**
   - **Médico Derivante**
   - **Práctica**
3. El resto del flujo continúa como se describe en las cláusulas anteriores
4. La **Orden** creada se asocia automáticamente al `profesional_id` del usuario

### 5.4. Generación de la Presentación Mensual (Detallado)

Este proceso es el **núcleo de la funcionalidad de facturación** y se ejecuta siguiendo un algoritmo estricto para garantizar la precisión.

#### Inicio y Selección de Período
El **Usuario Profesional** autenticado inicia el proceso desde la interfaz, seleccionando el mes y año para el cual desea generar la presentación (ej: "Junio 2025").

#### Paso 1: Recolección de Sesiones Candidatas
El sistema realiza una consulta a la base de datos para obtener un conjunto inicial de sesiones que cumplan **todas** las siguientes condiciones:

- Pertenecen al `profesional_id` del usuario actual
- Su estado **NO** es `'Presentada'`
- La Obra Social asociada a su orden tiene el campo `incluir_en_presentacion` marcado como `Verdadero`
- Cumplen **al menos una** de las siguientes reglas de negocio:
  - Su estado es `'Realizada'` y su `fechaPrestacion` está dentro del período seleccionado
  - Pertenecen a una Orden cuyo estado es `'Cerrada Manual'` y cuya `fechaCierre` está dentro del período seleccionado
  - Su estado es `'Realizada'` y su `fechaPrestacion` es de un período anterior (sesiones diferidas por el límite mensual)

#### Paso 2: Aplicación de Límites Mensuales
El sistema procesa el conjunto de sesiones candidatas de la siguiente manera:

1. Agrupa las sesiones por `obraSocial_id` y luego por `paciente_id`
2. Para cada grupo (OS, Paciente), el sistema verifica el campo `limite_sesiones_mensual_paciente` en la tabla Obra Social:
   - **Si el límite es nulo o cero**: Todas las sesiones del grupo son seleccionadas para la presentación
   - **Si existe un límite**: El sistema cuenta las sesiones del grupo. Si el número excede el límite, ordena las sesiones por `fechaPrestacion` (de la más antigua a la más nueva) y selecciona solo la cantidad permitida por el límite
3. Las sesiones que no fueron seleccionadas debido al límite conservan su estado `'Realizada'` y serán candidatas para la presentación del mes siguiente

#### Paso 3: Cálculo de Importes
Para cada sesión finalmente seleccionada en el paso anterior:

1. El sistema identifica la `practica_id` y `obraSocial_id` de la sesión
2. Consulta la tabla **Historial de Aranceles** para encontrar el importe correcto
3. **Regla de selección**: se utiliza el arancel cuya `fecha_vigencia` sea la más reciente, pero anterior o igual a la `fechaPrestacion` de la sesión
   - Esto asegura que se facture con el precio que estaba vigente en el momento exacto del servicio

#### Paso 4: Consolidación y Formato del Reporte
El sistema agrupa los resultados por **Obra Social** para la visualización.

Genera una vista en pantalla que detalla, por cada **Orden** con sesiones a presentar, la siguiente información:

| Campo | Descripción |
|-------|-------------|
| **Paciente** | Nombre y Apellido |
| **Nº de Orden** | ID de la Orden |
| **Obra Social** | Nombre de la Obra Social |
| **Cantidad de Sesiones Presentadas** | El número de sesiones de esa orden incluidas en este reporte |
| **Valor Unitario** | El importe por sesión calculado en el paso 3 |
| **Valor Total** | (Cantidad de Sesiones Presentadas × Valor Unitario) |

El reporte muestra:
- **Subtotales** por cada Obra Social
- **Gran total general**

#### Paso 5: Finalización y Persistencia
Una vez que el usuario confirma la generación del reporte, el sistema realiza **dos acciones atómicas**:

1. **Crea** un nuevo registro en la tabla `Presentación` con:
   - ID único
   - `profesional_id`
   - `período`
   - `importeTotal` calculado
   - `estadoCobranza` inicial `'Presentada'`

2. **Actualiza** el estado de todas las sesiones incluidas en el reporte a `'Presentada'`, para excluirlas de futuras presentaciones

El usuario puede entonces **exportar** el reporte final a formatos **PDF** y **Excel**.

### 5.5. Seguimiento de Cobranza

- El usuario solo puede ver y actualizar el estado de sus propias **Presentaciones**

### 5.6. Flujo de Check-in Diario de Sesión (Nuevo)

Este flujo describe la operación más común del día a día: **registrar la asistencia de un paciente a una sesión**.

#### Paso 1: Búsqueda del Paciente
- Desde una interfaz principal (ej. un "Dashboard"), el **Usuario Profesional** ingresa el **DNI** del paciente en un campo de búsqueda de "Check-in Rápido"

#### Paso 2: Presentación de Órdenes Activas
- El sistema busca al paciente por su **DNI**
- Si lo encuentra, muestra en pantalla una tarjeta o un resumen con:
  - **Nombre del paciente**
  - **Listado** de todas las órdenes con estado `'Abierta'` que dicho paciente tiene asociadas con el `profesional_id` del usuario actual

Para cada orden en la lista, se mostrará información clave para evitar ambigüedades:
- **La Práctica asociada** (ej: "Kinesiología de hombro")
- **El progreso de las sesiones** (ej: "Sesiones pendientes: 7 de 10")
- **Un botón interactivo** con la acción: "Registrar Sesión de Hoy"

#### Paso 3: Acción Confirmada por el Usuario
- El usuario identifica visualmente la orden correcta para la visita actual
- Hace clic en el botón **"Registrar Sesión de Hoy"** correspondiente

#### Paso 4: Ejecución y Confirmación
1. El sistema busca la primera **Sesión** con estado `'Pendiente'` dentro de la Orden seleccionada
2. Cambia el estado de esa sesión a `'Realizada'`
3. Asigna la **fecha y hora actual** al campo `fechaPrestacion`
4. Muestra un **mensaje de éxito** en pantalla (ej: "Sesión 4/10 registrada para Juan Pérez")

#### Manejo de Casos de Error

##### Si el DNI no se encuentra:
- El sistema mostrará un mensaje **"Paciente no encontrado"**
- Con un botón de acceso rápido para **"Registrar Nuevo Paciente"**

##### Si el paciente existe pero no tiene órdenes activas:
- El sistema mostrará un mensaje **"El paciente [Nombre del Paciente] no tiene órdenes activas"**
- Con un botón de acceso rápido para **"Crear Nueva Orden"**

---

## 6. Requisitos No Funcionales y Futuros

### Tecnología
- Uso de **tecnologías modernas y escalables** que soporten una arquitectura **multi-tenant** de forma nativa

### Seguridad
- La seguridad es un **pilar fundamental**
- Se deben seguir las **mejores prácticas** (OWASP Top 10) para:
  - Gestión de contraseñas
  - Gestión de sesiones
  - Prevención de ataques de inyección de datos

### Futuro (v2.0)
Se contempla la posibilidad de:

- [ ] Añadir un módulo de **reportes y estadísticas**
- [ ] La funcionalidad de **registro de órdenes por OCR**
- [ ] Generación de **QR** para el paciente al momento de presentarse para la sesión

---

> **📝 Fin del Contrato Técnico**
> 
> Este documento sirve como base técnica para el desarrollo del sistema de gestión de órdenes para profesionales de la salud.

