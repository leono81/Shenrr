/**
 * Aplicación principal del Gestor de Órdenes
 * Lógica de negocio y manejo de UI
 */

// Extender el namespace GestorOrdenes
GestorOrdenes.app = {
    // Inicialización de la aplicación
    init: function() {
        console.log('Inicializando Gestor de Órdenes...');
        
        // Inicializar datos de prueba
        GestorOrdenes.data.init();
        
        // Configurar event listeners globales
        this.setupGlobalEventListeners();
        
        console.log('Gestor de Órdenes inicializado correctamente');
    },

    // Event listeners globales
    setupGlobalEventListeners: function() {
        // Manejar clicks en navegación
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.handleNavigation(e);
            }
        });

        // Manejar formularios
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.handleFormSubmit(e);
            }
        });
    },

    // Manejo de navegación
    handleNavigation: function(e) {
        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar clase active al enlace clickeado
        e.target.classList.add('active');
    },

    // Manejo de formularios
    handleFormSubmit: function(e) {
        e.preventDefault();
        
        const formId = e.target.id;
        console.log(`Procesando formulario: ${formId}`);
        
        // Routing a los diferentes manejadores
        switch(formId) {
            case 'ordenForm':
                this.handleOrdenSubmit(e.target);
                break;
            case 'pacienteForm':
                this.handlePacienteSubmit(e.target);
                break;
            case 'presentacionForm':
                this.handlePresentacionSubmit(e.target);
                break;
            default:
                console.warn(`No hay manejador para el formulario: ${formId}`);
        }
    },

    // Manejo de creación de órdenes
    handleOrdenSubmit: function(form) {
        try {
            const formData = new FormData(form);
            const ordenData = {
                profesional_id: 1, // POC: usuario fijo
                paciente_id: parseInt(formData.get('paciente_id')),
                obraSocial_id: parseInt(formData.get('obraSocial_id')),
                medicoDerivante_id: parseInt(formData.get('medicoDerivante_id')),
                practica_id: parseInt(formData.get('practica_id')),
                fechaEmision: formData.get('fechaEmision'),
                cantidadSesionesTotal: parseInt(formData.get('cantidadSesionesTotal')),
                estado: 'Abierta',
                fechaCierre: null
            };

            // Validar datos
            if (!this.validateOrdenData(ordenData)) {
                return;
            }

            // Guardar orden
            const success = GestorOrdenes.storage.ordenes.save(ordenData);
            if (!success) {
                throw new Error('Error al guardar la orden');
            }

            // Crear sesiones automáticamente
            this.createSessionsForOrder(ordenData);

            // Mostrar éxito
            GestorOrdenes.utils.showNotification('Orden creada exitosamente', 'success');
            
            // Limpiar formulario
            form.reset();
            
            // Actualizar lista de órdenes si estamos en esa página
            if (window.location.pathname.includes('ordenes.html')) {
                GestorOrdenes.ui.loadOrders();
            }

        } catch (error) {
            console.error('Error al crear orden:', error);
            GestorOrdenes.utils.showNotification('Error al crear la orden', 'danger');
        }
    },

    // Validar datos de orden
    validateOrdenData: function(data) {
        if (!data.paciente_id || data.paciente_id <= 0) {
            GestorOrdenes.utils.showNotification('Debe seleccionar un paciente', 'warning');
            return false;
        }

        if (!data.obraSocial_id || data.obraSocial_id <= 0) {
            GestorOrdenes.utils.showNotification('Debe seleccionar una obra social', 'warning');
            return false;
        }

        if (!data.practica_id || data.practica_id <= 0) {
            GestorOrdenes.utils.showNotification('Debe seleccionar una práctica', 'warning');
            return false;
        }

        if (!data.fechaEmision) {
            GestorOrdenes.utils.showNotification('Debe ingresar la fecha de emisión', 'warning');
            return false;
        }

        if (!data.cantidadSesionesTotal || data.cantidadSesionesTotal <= 0) {
            GestorOrdenes.utils.showNotification('Debe ingresar la cantidad de sesiones', 'warning');
            return false;
        }

        return true;
    },

    // Crear sesiones automáticamente para una orden
    createSessionsForOrder: function(orden) {
        const sesiones = [];
        
        for (let i = 1; i <= orden.cantidadSesionesTotal; i++) {
            sesiones.push({
                orden_id: orden.id,
                numeroSesion: i,
                fechaPrestacion: null,
                estado: 'Pendiente'
            });
        }

        GestorOrdenes.storage.sesiones.bulkSave(sesiones);
    },

    // Buscar paciente por DNI
    searchPatientByDni: function(dni) {
        if (!dni || dni.trim() === '') {
            return null;
        }

        const cleanDni = dni.replace(/[\s.-]/g, '');
        return GestorOrdenes.storage.pacientes.getByDni(cleanDni);
    },

    // Obtener órdenes activas de un paciente
    getActiveOrdersForPatient: function(pacienteId) {
        const ordenes = GestorOrdenes.storage.ordenes.getByPaciente(pacienteId);
        return ordenes.filter(orden => orden.estado === 'Abierta');
    },

    // Registrar sesión de hoy
    registerTodaySession: function(ordenId) {
        try {
            const sesiones = GestorOrdenes.storage.sesiones.getByOrden(ordenId);
            const pendientes = sesiones.filter(s => s.estado === 'Pendiente');
            
            if (pendientes.length === 0) {
                GestorOrdenes.utils.showNotification('No hay sesiones pendientes en esta orden', 'warning');
                return false;
            }

            // Tomar la primera sesión pendiente
            const sesion = pendientes[0];
            sesion.fechaPrestacion = GestorOrdenes.utils.getCurrentDate();
            sesion.estado = 'Realizada';

            // Guardar sesión
            const success = GestorOrdenes.storage.sesiones.save(sesion);
            if (!success) {
                throw new Error('Error al guardar la sesión');
            }

            // Obtener información para mostrar
            const orden = GestorOrdenes.storage.ordenes.getById(ordenId);
            const paciente = GestorOrdenes.storage.pacientes.getById(orden.paciente_id);
            const practica = GestorOrdenes.storage.practicas.getById(orden.practica_id);

            // Mostrar mensaje de éxito
            const mensaje = `Sesión ${sesion.numeroSesion}/${orden.cantidadSesionesTotal} registrada para ${paciente.nombreCompleto} - ${practica.nombrePractica}`;
            GestorOrdenes.utils.showNotification(mensaje, 'success');

            return true;

        } catch (error) {
            console.error('Error al registrar sesión:', error);
            GestorOrdenes.utils.showNotification('Error al registrar la sesión', 'danger');
            return false;
        }
    },

    // Algoritmo complejo de generación de presentaciones
    generateBilling: function(year, month) {
        try {
            console.log(`Generando presentación para ${month}/${year}`);
            
            // Paso 1: Recolección de sesiones candidatas
            const candidateSessions = this.collectCandidateSessions(year, month);
            console.log(`Sesiones candidatas encontradas: ${candidateSessions.length}`);
            
            if (candidateSessions.length === 0) {
                GestorOrdenes.utils.showNotification('No hay sesiones para presentar en el período seleccionado', 'info');
                return null;
            }

            // Paso 2: Aplicación de límites mensuales
            const limitedSessions = this.applyMonthlyLimits(candidateSessions);
            console.log(`Sesiones después de aplicar límites: ${limitedSessions.length}`);

            // Paso 3: Cálculo de importes
            const sessionsWithAmounts = this.calculateSessionAmounts(limitedSessions);

            // Paso 4: Consolidación y formato del reporte
            const billingData = this.consolidateBillingData(sessionsWithAmounts);

            // Paso 5: Crear registro de presentación
            const presentacion = this.createPresentationRecord(year, month, billingData);

            // Paso 6: Actualizar estado de sesiones
            this.updateSessionsStatus(limitedSessions);

            console.log('Presentación generada exitosamente');
            return {
                presentacion: presentacion,
                billingData: billingData,
                sessions: limitedSessions
            };

        } catch (error) {
            console.error('Error al generar presentación:', error);
            GestorOrdenes.utils.showNotification('Error al generar la presentación', 'danger');
            return null;
        }
    },

    // Paso 1: Recolección de sesiones candidatas
    collectCandidateSessions: function(year, month) {
        const allSessions = GestorOrdenes.storage.sesiones.getAll();
        const candidateSessions = [];

        for (const session of allSessions) {
            // Verificar que no esté ya presentada
            if (session.estado === 'Presentada') {
                continue;
            }

            // Obtener orden para verificar obra social
            const orden = GestorOrdenes.storage.ordenes.getById(session.orden_id);
            if (!orden) continue;

            // Verificar que pertenezca al profesional actual (POC: siempre 1)
            if (orden.profesional_id !== 1) continue;

            // Obtener obra social
            const obraSocial = GestorOrdenes.storage.obrasSociales.getById(orden.obraSocial_id);
            if (!obraSocial || !obraSocial.incluir_en_presentacion) continue;

            // Verificar reglas de negocio
            let shouldInclude = false;

            // Regla 1: Sesión realizada en el período
            if (session.estado === 'Realizada' && session.fechaPrestacion) {
                const sessionDate = new Date(session.fechaPrestacion);
                if (sessionDate.getFullYear() === year && (sessionDate.getMonth() + 1) === month) {
                    shouldInclude = true;
                }
            }

            // Regla 2: Orden cerrada manual en el período
            if (orden.estado === 'Cerrada Manual' && orden.fechaCierre) {
                const closeDate = new Date(orden.fechaCierre);
                if (closeDate.getFullYear() === year && (closeDate.getMonth() + 1) === month) {
                    shouldInclude = true;
                }
            }

            // Regla 3: Sesión realizada en período anterior (diferidas)
            if (session.estado === 'Realizada' && session.fechaPrestacion) {
                const sessionDate = new Date(session.fechaPrestacion);
                const sessionYear = sessionDate.getFullYear();
                const sessionMonth = sessionDate.getMonth() + 1;
                
                // Es anterior al período actual
                if (sessionYear < year || (sessionYear === year && sessionMonth < month)) {
                    shouldInclude = true;
                }
            }

            if (shouldInclude) {
                candidateSessions.push({
                    ...session,
                    orden: orden,
                    obraSocial: obraSocial
                });
            }
        }

        return candidateSessions;
    },

    // Paso 2: Aplicación de límites mensuales
    applyMonthlyLimits: function(candidateSessions) {
        const limitedSessions = [];
        
        // Agrupar por obra social y paciente
        const groupedSessions = {};
        
        for (const session of candidateSessions) {
            const key = `${session.obraSocial.id}-${session.orden.paciente_id}`;
            
            if (!groupedSessions[key]) {
                groupedSessions[key] = {
                    obraSocial: session.obraSocial,
                    paciente_id: session.orden.paciente_id,
                    sessions: []
                };
            }
            
            groupedSessions[key].sessions.push(session);
        }

        // Aplicar límites por grupo
        for (const group of Object.values(groupedSessions)) {
            const limit = group.obraSocial.limite_sesiones_mensual_paciente;
            
            if (!limit || limit <= 0) {
                // Sin límite, incluir todas
                limitedSessions.push(...group.sessions);
            } else {
                // Aplicar límite
                // Ordenar por fecha de prestación (más antigua primero)
                const sortedSessions = group.sessions.sort((a, b) => {
                    const dateA = new Date(a.fechaPrestacion || '1900-01-01');
                    const dateB = new Date(b.fechaPrestacion || '1900-01-01');
                    return dateA - dateB;
                });
                
                // Tomar solo las primeras hasta el límite
                limitedSessions.push(...sortedSessions.slice(0, limit));
            }
        }

        return limitedSessions;
    },

    // Paso 3: Cálculo de importes
    calculateSessionAmounts: function(sessions) {
        return sessions.map(session => {
            const importe = GestorOrdenes.storage.aranceles.getImporteVigente(
                session.orden.practica_id,
                session.orden.obraSocial_id,
                session.fechaPrestacion || session.orden.fechaEmision
            );

            return {
                ...session,
                importe: importe
            };
        });
    },

    // Paso 4: Consolidación y formato del reporte
    consolidateBillingData: function(sessions) {
        const consolidated = {};
        
        // Agrupar por obra social
        for (const session of sessions) {
            const osId = session.obraSocial.id;
            
            if (!consolidated[osId]) {
                consolidated[osId] = {
                    obraSocial: session.obraSocial,
                    ordenes: {},
                    subtotal: 0
                };
            }
            
            const ordenId = session.orden.id;
            if (!consolidated[osId].ordenes[ordenId]) {
                const paciente = GestorOrdenes.storage.pacientes.getById(session.orden.paciente_id);
                const practica = GestorOrdenes.storage.practicas.getById(session.orden.practica_id);
                
                consolidated[osId].ordenes[ordenId] = {
                    orden: session.orden,
                    paciente: paciente,
                    practica: practica,
                    sesiones: [],
                    cantidad: 0,
                    valorUnitario: session.importe,
                    valorTotal: 0
                };
            }
            
            consolidated[osId].ordenes[ordenId].sesiones.push(session);
            consolidated[osId].ordenes[ordenId].cantidad++;
            consolidated[osId].ordenes[ordenId].valorTotal += session.importe;
            consolidated[osId].subtotal += session.importe;
        }

        // Convertir a array para facilitar el manejo
        const result = Object.values(consolidated).map(os => ({
            ...os,
            ordenes: Object.values(os.ordenes)
        }));

        return result;
    },

    // Paso 5: Crear registro de presentación
    createPresentationRecord: function(year, month, billingData) {
        const total = billingData.reduce((sum, os) => sum + os.subtotal, 0);
        const periodo = `${GestorOrdenes.utils.getMonthName(month)} ${year}`;
        
        const presentacion = {
            profesional_id: 1,
            fechaGeneracion: GestorOrdenes.utils.getCurrentDate(),
            periodo: periodo,
            importeTotal: total,
            estadoCobranza: 'Presentada'
        };

        GestorOrdenes.storage.presentaciones.save(presentacion);
        return presentacion;
    },

    // Paso 6: Actualizar estado de sesiones
    updateSessionsStatus: function(sessions) {
        for (const session of sessions) {
            session.estado = 'Presentada';
            GestorOrdenes.storage.sesiones.save(session);
        }
    }
};

// Módulo de UI
GestorOrdenes.ui = {
    // Cargar dashboard
    loadDashboard: function() {
        this.loadStats();
        this.loadRecentOrders();
        this.setupQuickCheckin();
    },

    // Cargar estadísticas
    loadStats: function() {
        const stats = GestorOrdenes.utils.getGeneralStats();
        
        document.getElementById('totalOrdenes').textContent = stats.ordenesActivas;
        document.getElementById('totalSesiones').textContent = stats.sesionesRealizadas;
        document.getElementById('totalPendientes').textContent = stats.sesionesPendientes;
    },

    // Cargar órdenes recientes
    loadRecentOrders: function() {
        const ordenes = GestorOrdenes.storage.ordenes.getAll()
            .sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision))
            .slice(0, 5);

        const tbody = document.getElementById('recentOrders');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (ordenes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay órdenes registradas</td></tr>';
            return;
        }

        ordenes.forEach(orden => {
            const paciente = GestorOrdenes.storage.pacientes.getById(orden.paciente_id);
            const obraSocial = GestorOrdenes.storage.obrasSociales.getById(orden.obraSocial_id);
            const practica = GestorOrdenes.storage.practicas.getById(orden.practica_id);
            const progreso = GestorOrdenes.utils.getSessionProgress(orden.id);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paciente ? paciente.nombreCompleto : 'N/A'}</td>
                <td>${obraSocial ? obraSocial.nombre : 'N/A'}</td>
                <td>${practica ? practica.nombrePractica : 'N/A'}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar" role="progressbar" style="width: ${progreso.porcentaje}%">
                            ${progreso.realizadas}/${progreso.total}
                        </div>
                    </div>
                </td>
                <td><span class="badge estado-${orden.estado.toLowerCase().replace(' ', '-')}">${orden.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="GestorOrdenes.ui.viewOrder(${orden.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });
    },

    // Configurar check-in rápido
    setupQuickCheckin: function() {
        const searchBtn = document.getElementById('searchBtn');
        const dniInput = document.getElementById('dniSearch');
        const searchResult = document.getElementById('searchResult');

        if (!searchBtn || !dniInput || !searchResult) return;

        searchBtn.addEventListener('click', () => {
            const dni = dniInput.value.trim();
            this.performQuickSearch(dni, searchResult);
        });

        dniInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const dni = dniInput.value.trim();
                this.performQuickSearch(dni, searchResult);
            }
        });
    },

    // Realizar búsqueda rápida
    performQuickSearch: function(dni, resultContainer) {
        if (!dni) {
            resultContainer.innerHTML = '<div class="alert alert-warning">Ingrese un DNI para buscar</div>';
            return;
        }

        const paciente = GestorOrdenes.app.searchPatientByDni(dni);
        
        if (!paciente) {
            resultContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> Paciente no encontrado
                    <hr>
                    <a href="pages/ordenes.html" class="btn btn-sm btn-primary">
                        <i class="bi bi-person-plus"></i> Registrar Nuevo Paciente
                    </a>
                </div>
            `;
            return;
        }

        const ordenesActivas = GestorOrdenes.app.getActiveOrdersForPatient(paciente.id);
        
        if (ordenesActivas.length === 0) {
            resultContainer.innerHTML = `
                <div class="alert alert-info">
                    <strong>${paciente.nombreCompleto}</strong> no tiene órdenes activas
                    <hr>
                    <a href="pages/ordenes.html" class="btn btn-sm btn-primary">
                        <i class="bi bi-file-earmark-plus"></i> Crear Nueva Orden
                    </a>
                </div>
            `;
            return;
        }

        // Mostrar órdenes activas
        let html = `
            <div class="patient-info">
                <div class="patient-name">${paciente.nombreCompleto}</div>
                <div class="patient-dni">DNI: ${paciente.dni}</div>
            </div>
        `;

        ordenesActivas.forEach(orden => {
            const practica = GestorOrdenes.storage.practicas.getById(orden.practica_id);
            const progreso = GestorOrdenes.utils.getSessionProgress(orden.id);
            
            html += `
                <div class="order-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${practica ? practica.nombrePractica : 'N/A'}</strong>
                            <div class="order-progress">Sesiones pendientes: ${progreso.pendientes} de ${progreso.total}</div>
                        </div>
                        <button class="btn btn-success btn-sm" onclick="GestorOrdenes.ui.registerSessionFromDashboard(${orden.id})">
                            <i class="bi bi-check-circle"></i> Registrar Sesión de Hoy
                        </button>
                    </div>
                </div>
            `;
        });

        resultContainer.innerHTML = html;
    },

    // Registrar sesión desde dashboard
    registerSessionFromDashboard: function(ordenId) {
        const success = GestorOrdenes.app.registerTodaySession(ordenId);
        
        if (success) {
            // Actualizar estadísticas
            this.loadStats();
            this.loadRecentOrders();
            
            // Limpiar búsqueda
            document.getElementById('dniSearch').value = '';
            document.getElementById('searchResult').innerHTML = '';
        }
    },

    // Ver orden (placeholder)
    viewOrder: function(ordenId) {
        // Redireccionar a página de órdenes con filtro
        window.location.href = `pages/ordenes.html?orden=${ordenId}`;
    }
};

// Función de inicialización global
GestorOrdenes.init = function() {
    console.log('=== Iniciando Gestor de Órdenes POC ===');
    
    // Verificar que todos los módulos estén cargados
    if (!GestorOrdenes.storage || !GestorOrdenes.data || !GestorOrdenes.utils) {
        console.error('Módulos no cargados correctamente');
        return false;
    }
    
    // Inicializar aplicación
    GestorOrdenes.app.init();
    
    console.log('=== POC Inicializado Correctamente ===');
    return true;
};

// Función de utilidad para debugging desde la consola
GestorOrdenes.debug = {
    forceUpdateData: function() {
        console.log('🔧 Ejecutando actualización forzada de datos...');
        GestorOrdenes.data.forceUpdate();
        
        // Refrescar estadísticas si estamos en el dashboard
        if (typeof GestorOrdenes.ui !== 'undefined' && GestorOrdenes.ui.loadStats) {
            setTimeout(() => {
                GestorOrdenes.ui.loadStats();
                GestorOrdenes.ui.loadRecentOrders();
                console.log('📊 Dashboard actualizado');
            }, 500);
        }
        
        console.log('✅ Actualización completada - recarga la página si no ves cambios');
    },
    
    checkOrder3: function() {
        const orden3 = GestorOrdenes.storage.ordenes.getById(3);
        const sesionesOrden3 = GestorOrdenes.storage.sesiones.getByOrden(3);
        const progreso = GestorOrdenes.utils.getSessionProgress(3);
        
        console.log('📋 Diagnóstico Orden ID 3 (Ana Sofía Martínez):');
        console.log('- Cantidad total sesiones:', orden3 ? orden3.cantidadSesionesTotal : 'NO ENCONTRADA');
        console.log('- Sesiones en DB:', sesionesOrden3.length);
        console.log('- Progreso calculado:', `${progreso.realizadas}/${progreso.total} (${progreso.porcentaje}%)`);
        console.log('- Estado orden:', orden3 ? orden3.estado : 'NO ENCONTRADA');
        
        if (sesionesOrden3.length > 0) {
            console.log('- Estados sesiones:', sesionesOrden3.map(s => `${s.numeroSesion}:${s.estado}`).join(', '));
        }
        
        return { orden3, sesionesOrden3, progreso };
    }
};

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    GestorOrdenes.init();
});

// Exponer GestorOrdenes globalmente para debugging
window.GestorOrdenes = GestorOrdenes;