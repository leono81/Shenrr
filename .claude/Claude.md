# **Guía Claude Code - POC Gestor de Órdenes**

## **🎯 Contexto del Proyecto**

Estamos desarrollando un **POC (Proof of Concept)** para validar el flujo completo de un Sistema de Gestión de Órdenes para Profesionales de la Salud. 

**Objetivo:** Carga de órdenes → Registro de sesiones → Generación de presentación

## **📋 Metodología de Trabajo**

### **OBLIGATORIO: Secuencia de Desarrollo**
1. **Research:** Explorar el código existente y entender patrones
2. **Plan:** Crear plan detallado de implementación 
3. **Implement:** Ejecutar con checkpoints de validación

**Antes de cualquier implementación, SIEMPRE di:** 
> "Voy a investigar el código y crear un plan antes de implementar."

### **🔒 Política de Calidad ZERO TOLERANCE**
- ❌ TODOS los errores son BLOQUEANTES
- ✅ TODO debe estar en VERDE antes de continuar
- 🛑 NO saltar directo a codificar - seguir la secuencia

## **🛠️ Stack Tecnológico POC**

```javascript
// Frontend Stack
- HTML5 + JavaScript Vanilla
- Bootstrap 5 (UI framework)
- LocalStorage (persistencia)
- SheetJS (exportación Excel)
- Chart.js (si necesitamos gráficos)
```

### **📁 Estructura del Proyecto**
```
gestor-ordenes-poc/
├── index.html              # Dashboard principal
├── pages/
│   ├── ordenes.html       # Gestión de órdenes  
│   ├── checkin.html       # Check-in diario
│   └── presentaciones.html # Generación de reportes
├── js/
│   ├── app.js             # Lógica principal
│   ├── storage.js         # LocalStorage management
│   ├── data.js            # Datos de prueba
│   └── utils.js           # Utilidades comunes
├── css/style.css          # Estilos personalizados
└── libs/                  # Librerías externas
```


## **📊 Datos de Prueba Precargados**

### Obras Sociales
- Swiss Medical, Galeno, Medife, Sancor Seguros

### Pacientes Ficticios
- 5 pacientes con DNI, nombres y obras sociales asignadas

### Prácticas
- Kinesiología, Osteopatia

### Aranceles
- Tabla básica con precios por práctica/obra social


### Ejemplos de pantalla

**🚨 Solo ejemplos de UI&UX**
- En .claude/examples encontraras html para que uses como ejemplo de consulta al momento de diseñar la Interfaz

- Siempre recurrir a las ejemplos cuando hay dudas.

## **🎯 Funcionalidades Core del POC**


### **FASE 1**
- [] Estructura base HTML
- [] LocalStorage implementation 
- [] Datos de prueba cargados
- [] Navegación básica

### **FASE 2**
- [ ] Formulario nueva orden
- [ ] Listado de órdenes existentes
- [ ] Estados: Abierta/Cerrada Normal/Cerrada Manual
- [ ] Generación automática de sesiones

### **FASE 3**
- [ ] Búsqueda rápida por DNI
- [ ] Mostrar órdenes activas del paciente
- [ ] Botón "Registrar Sesión de Hoy"
- [ ] Confirmación visual

### **FASE 4**
- [ ] Selector mes/año
- [ ] Recolección sesiones "Realizadas"
- [ ] Agrupación por Obra Social
- [ ] Cálculo de importes
- [ ] Exportación Excel con SheetJS

### **FASE 5**
- [ ] Flujo completo end-to-end
- [ ] Validaciones de datos
- [ ] UX/UI polish básico

## **⚡ Reglas de Implementación Específicas**

### **JavaScript Patterns**
```javascript
// ✅ USAR: Módulos con namespace
const GestorOrdenes = {
    storage: { /* LocalStorage ops */ },
    utils: { /* Helper functions */ },
    ui: { /* DOM manipulation */ }
};

// ❌ EVITAR: Variables globales sueltas
let ordenes = []; // NO
```

### **HTML Structure**
```html
<!-- ✅ USAR: Semantic HTML -->
<main role="main">
    <section class="ordenes-section">
        <header><h2>Gestión de Órdenes</h2></header>
        <article class="orden-card">...</article>
    </section>
</main>

<!-- ❌ EVITAR: Div soup -->
<div><div><div>...</div></div></div>
```

### **LocalStorage Strategy**
```javascript
// ✅ Estructura de datos clara
const STORAGE_KEYS = {
    ORDENES: 'gestorOrdenes_ordenes',
    SESIONES: 'gestorOrdenes_sesiones', 
    PACIENTES: 'gestorOrdenes_pacientes',
    PRESENTACIONES: 'gestorOrdenes_presentaciones'
};
```

## **🚨 Casos de Error Comunes**


### **POC-Test Failed**
```bash
# Si fallan las pruebas:
1. Verificar que LocalStorage funcione
2. Comprobar carga de datos de prueba
3. Validar navegación entre páginas
```

## **📈 Progreso Actual**
- [ ] **Setup Base** 
- [ ] **Módulo Órdenes** 
- [ ] **Check-in Diario**
- [ ] **Presentaciones**
- [ ] **Testing Final**

## **🎯 Entregables POC**
1. ✅ Aplicación web funcional (local)
2. ✅ Datos de prueba precargados
3. ⏳ Guía de uso (1 página)
4. ⏳ Lista de mejoras para MVP

---

**💡 Tip:** Usa `ultrathink` para problemas complejos de lógica de negocio (ej: algoritmo de generación de presentaciones)

**🔄 Checkpoint:** Antes de cada Fase, confirma que el anterior está ✅ GREEN