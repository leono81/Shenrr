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

    // === NUEVO: Crear orden con programación automática ===
    createOrdenWithScheduling: function(ordenData, onConflictCallback = null) {
        try {
            // Guardar orden primero
            const success = GestorOrdenes.storage.ordenes.save(ordenData);
            if (!success) {
                throw new Error('Error al guardar la orden');
            }
            
            // Generar programación automática
            const scheduledSessions = this.generateAutomaticSchedule(ordenData);
            
            // Validar conflictos si es necesario
            if (ordenData.programacion_tipo !== 'personalizada') {
                const conflicts = this.checkScheduleConflicts(scheduledSessions);
                
                if (conflicts.length > 0) {
                    console.warn('Conflictos detectados:', conflicts);
                    
                    // Si hay callback para manejar conflictos, usarlo
                    if (onConflictCallback) {
                        return new Promise((resolve, reject) => {
                            this.showConflictResolutionModal(conflicts, (continueAnyway) => {
                                if (continueAnyway) {
                                    // Marcar sesiones con flag de conflicto
                                    this.markSessionsWithConflicts(scheduledSessions, conflicts);
                                    GestorOrdenes.storage.sesiones.bulkSave(scheduledSessions);
                                    resolve(true);
                                } else {
                                    // No continuar, devolver false
                                    resolve(false);
                                }
                            });
                        });
                    } else {
                        // Sin callback, marcar conflictos y continuar
                        this.markSessionsWithConflicts(scheduledSessions, conflicts);
                    }
                }
            }
            
            // Guardar sesiones programadas
            GestorOrdenes.storage.sesiones.bulkSave(scheduledSessions);
            
            console.log(`Orden ${ordenData.id} creada con ${scheduledSessions.length} sesiones programadas automáticamente`);
            return true;
            
        } catch (error) {
            console.error('Error en createOrdenWithScheduling:', error);
            throw error;
        }
    },
    
    // Marcar sesiones con flag de conflicto
    markSessionsWithConflicts: function(sessions, conflicts) {
        conflicts.forEach(conflict => {
            const session = sessions.find(s => 
                s.fecha_programada === conflict.conflictDate && 
                s.hora_programada === conflict.conflictTime
            );
            
            if (session) {
                session.conflicto = true;
                session.motivo_conflicto = `Solapamiento con ${conflict.conflicts.length} sesión(es) existente(s)`;
            }
        });
    },
    
    // Generar programación automática de sesiones
    generateAutomaticSchedule: function(orden) {
        console.log('Generando programación automática para orden:', orden);
        
        const sesiones = [];
        let fechasProgramadas = [];
        
        // Determinar fechas según tipo de programación
        switch (orden.programacion_tipo) {
            case 'habiles':
                fechasProgramadas = GestorOrdenes.utils.calculateBusinessDays(
                    orden.fecha_primera_sesion, 
                    orden.cantidadSesionesTotal
                );
                break;
                
            case 'lmv':
                fechasProgramadas = GestorOrdenes.utils.calculateMWFSchedule(
                    orden.fecha_primera_sesion, 
                    orden.cantidadSesionesTotal
                );
                break;
                
            case 'mtj':
                fechasProgramadas = GestorOrdenes.utils.calculateTTSchedule(
                    orden.fecha_primera_sesion, 
                    orden.cantidadSesionesTotal
                );
                break;
                
            case 'personalizada':
                // Para personalizada, crear sesiones sin fecha (se asignarán después)
                for (let i = 1; i <= orden.cantidadSesionesTotal; i++) {
                    sesiones.push({
                        orden_id: orden.id,
                        numeroSesion: i,
                        fechaPrestacion: null,
                        estado: 'Pendiente',
                        // Campos extendidos
                        fecha_programada: null,
                        hora_programada: orden.hora_sesiones,
                        fecha_real: null,
                        hora_real: null,
                        tipo_atencion: 'programada'
                    });
                }
                return sesiones;
                
            default:
                throw new Error(`Tipo de programación no válido: ${orden.programacion_tipo}`);
        }
        
        // Crear sesiones con fechas programadas aplicando validación de capacidad
        fechasProgramadas.forEach((fecha, index) => {
            const dateStr = GestorOrdenes.utils.formatDateForStorage(fecha);
            const time = orden.hora_sesiones || '09:00';
            
            // Validar capacidad antes de programar
            const validation = GestorOrdenes.capacity.validateBeforeScheduling(dateStr, time);
            
            const sesion = {
                orden_id: orden.id,
                numeroSesion: index + 1,
                fechaPrestacion: null, // Aún no realizada
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: dateStr,
                hora_programada: time,
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            };
            
            // Marcar conflicto si hay problemas de capacidad
            if (!validation.isValid) {
                sesion.conflicto = true;
                sesion.motivo_conflicto = `Capacidad excedida: ${validation.currentCount + 1} pacientes programados`;
            } else if (validation.needsWarning) {
                sesion.advertencia_capacidad = true;
                sesion.capacidad_actual = validation.currentCount;
            }
            
            sesiones.push(sesion);
        });
        
        console.log(`Generadas ${sesiones.length} sesiones programadas:`, sesiones);
        return sesiones;
    },
    
    // Detectar conflictos de programación con detalle
    checkScheduleConflicts: function(newSessions) {
        const existingSessions = GestorOrdenes.storage.sesiones.getAll()
            .filter(session => session.fecha_programada && session.hora_programada);
        
        const conflicts = [];
        
        newSessions.forEach(newSession => {
            const conflictingSessions = existingSessions.filter(existing => {
                // Comparar misma fecha y hora
                return existing.fecha_programada === newSession.fecha_programada && 
                       existing.hora_programada === newSession.hora_programada &&
                       existing.orden_id !== newSession.orden_id; // No comparar misma orden
            });
            
            if (conflictingSessions.length > 0) {
                // Obtener información adicional para el conflicto
                const conflictData = conflictingSessions.map(conflict => {
                    const orden = GestorOrdenes.storage.ordenes.getById(conflict.orden_id);
                    const paciente = orden ? GestorOrdenes.storage.pacientes.getById(orden.paciente_id) : null;
                    
                    return {
                        sesion: conflict,
                        orden: orden,
                        paciente: paciente
                    };
                });
                
                conflicts.push({
                    newSession: newSession,
                    conflictDate: newSession.fecha_programada,
                    conflictTime: newSession.hora_programada,
                    conflicts: conflictData
                });
            }
        });
        
        return conflicts;
    },
    
    // Mostrar modal de resolución de conflictos
    showConflictResolutionModal: function(conflicts, callback) {
        const modal = this.createConflictModal(conflicts);
        document.body.appendChild(modal);
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        // Manejar botones del modal
        modal.querySelector('.btn-continue').addEventListener('click', () => {
            bootstrapModal.hide();
            if (callback) callback(true); // Continuar de todas formas
        });
        
        modal.querySelector('.btn-review').addEventListener('click', () => {
            bootstrapModal.hide();
            if (callback) callback(false); // No continuar, revisar manualmente
        });
        
        // Limpiar modal al cerrar
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    },
    
    // Crear modal HTML para conflictos
    createConflictModal: function(conflicts) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        
        const conflictList = conflicts.map(conflict => {
            const conflictDetails = conflict.conflicts.map(c => 
                `<li>Paciente: ${c.paciente ? c.paciente.nombreCompleto : 'N/A'} - Sesión ${c.sesion.numeroSesion}</li>`
            ).join('');
            
            return `
                <div class="alert alert-warning">
                    <h6><i class="bi bi-exclamation-triangle"></i> Conflicto en ${GestorOrdenes.utils.formatDate(conflict.conflictDate)} a las ${conflict.conflictTime}</h6>
                    <ul class="mb-0">
                        ${conflictDetails}
                    </ul>
                </div>
            `;
        }).join('');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">
                            <i class="bi bi-exclamation-triangle"></i> Conflictos de Horario Detectados
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Se encontraron ${conflicts.length} conflicto(s) de horario con sesiones ya programadas:</p>
                        ${conflictList}
                        <p class="mt-3">
                            <strong>¿Qué desea hacer?</strong>
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary btn-review">
                            <i class="bi bi-search"></i> Revisar Manualmente
                        </button>
                        <button type="button" class="btn btn-warning btn-continue">
                            <i class="bi bi-exclamation-triangle"></i> Continuar de Todas Formas
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    },

    // Crear sesiones automáticamente para una orden (LEGACY - mantenido para compatibilidad)
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
    registerTodaySession: function(ordenId, tipoAtencion = 'programada') {
        try {
            const sesiones = GestorOrdenes.storage.sesiones.getByOrden(ordenId);
            const pendientes = sesiones.filter(s => s.estado === 'Pendiente');
            
            if (pendientes.length === 0) {
                GestorOrdenes.utils.showNotification('No hay sesiones pendientes en esta orden', 'warning');
                return false;
            }

            // Tomar la primera sesión pendiente
            const sesion = pendientes[0];
            const now = new Date();
            
            // Actualizar información básica
            sesion.fechaPrestacion = GestorOrdenes.utils.getCurrentDate();
            sesion.estado = 'Realizada';
            
            // Agregar información de timing
            sesion.fecha_real = GestorOrdenes.utils.getCurrentDate();
            sesion.hora_real = now.toTimeString().slice(0, 5); // HH:MM
            sesion.tipo_atencion = tipoAtencion;
            
            // Marcar si hubo cambio de horario
            if (sesion.hora_programada) {
                const timingValidation = GestorOrdenes.utils.validateAppointmentTiming(sesion, now);
                sesion.cambio_horario = timingValidation.status !== 'onTime';
                
                if (sesion.cambio_horario) {
                    sesion.hora_programada_original = sesion.hora_programada;
                    sesion.motivo_cambio = tipoAtencion === 'urgencia' ? 'urgencia' : 
                                          timingValidation.status === 'early' ? 'adelanto' : 
                                          timingValidation.status === 'late' ? 'atraso' : 'reagendado';
                }
            }

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
            const tipoMsg = tipoAtencion === 'urgencia' ? ' (urgencia)' : '';
            const mensaje = `Sesión ${sesion.numeroSesion}/${orden.cantidadSesionesTotal} registrada para ${paciente.nombreCompleto} - ${practica.nombrePractica}${tipoMsg}`;
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
        this.setupQuickCheckin();
    },

    // Cargar citas de hoy
    loadTodayAppointments: function() {
        const today = new Date();
        const fechaHoy = GestorOrdenes.utils.formatDate(today);
        
        // Actualizar fecha en el header
        const fechaHoyElement = document.getElementById('fechaHoy');
        if (fechaHoyElement) {
            fechaHoyElement.textContent = fechaHoy;
        }

        // Obtener citas programadas para hoy
        const citasHoy = this.getTodayAppointments();
        
        const container = document.getElementById('citasHoy');
        if (!container) return;

        if (citasHoy.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-calendar-x display-6 text-muted"></i>
                    <p class="text-muted mt-2">No hay citas programadas para hoy</p>
                    <div class="d-flex gap-2 justify-content-center">
                        <a href="pages/ordenes.html" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-file-earmark-plus"></i> Ver Órdenes Pendientes
                        </a>
                        <a href="pages/ordenes.html" class="btn btn-outline-success btn-sm">
                            <i class="bi bi-plus-circle"></i> Crear Nueva Orden
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        // Renderizar citas con estados dinámicos
        let citasHtml = '<div class="row">';
        citasHoy.forEach(cita => {
            const estadoInfo = this.getAppointmentStatus(cita);
            citasHtml += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card border-${estadoInfo.color} h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title text-${estadoInfo.color}">
                                    <i class="bi bi-clock"></i> ${cita.hora_programada}
                                </h6>
                                <span class="badge bg-${estadoInfo.color}">${estadoInfo.texto}</span>
                            </div>
                            <p class="card-text">
                                <strong>${cita.paciente_nombre}</strong><br>
                                <small class="text-muted">
                                    ${cita.obra_social} | ${cita.practica}
                                </small>
                            </p>
                            ${this.getAppointmentActions(cita, estadoInfo.estado)}
                        </div>
                    </div>
                </div>
            `;
        });
        citasHtml += '</div>';
        
        container.innerHTML = citasHtml;
    },

    // Obtener citas programadas para hoy
    getTodayAppointments: function() {
        const today = new Date();
        const fechaHoy = GestorOrdenes.utils.formatDateForStorage(today);
        
        const sesiones = GestorOrdenes.storage.sesiones.getAll()
            .filter(sesion => {
                return sesion.fecha_programada === fechaHoy && 
                       sesion.profesional_id === 1; // POC: usuario fijo
            })
            .sort((a, b) => a.hora_programada.localeCompare(b.hora_programada));

        return sesiones.map(sesion => {
            const orden = GestorOrdenes.storage.ordenes.getById(sesion.orden_id);
            const paciente = GestorOrdenes.storage.pacientes.getById(orden.paciente_id);
            const obraSocial = GestorOrdenes.storage.obrasSociales.getById(orden.obraSocial_id);
            const practica = GestorOrdenes.storage.practicas.getById(orden.practica_id);
            
            return {
                sesion_id: sesion.id,
                orden_id: orden.id,
                paciente_id: paciente.id,
                paciente_nombre: paciente.nombreCompleto,
                paciente_dni: paciente.dni,
                obra_social: obraSocial.nombre,
                practica: practica.nombrePractica,
                hora_programada: sesion.hora_programada,
                estado: sesion.estado,
                fecha_programada: sesion.fecha_programada,
                fecha_real: sesion.fecha_real,
                hora_real: sesion.hora_real
            };
        });
    },

    // Obtener estado de una cita
    getAppointmentStatus: function(cita) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [horaStr, minutoStr] = cita.hora_programada.split(':');
        const appointmentTime = parseInt(horaStr) * 60 + parseInt(minutoStr);
        
        if (cita.estado === 'Realizada') {
            return {
                estado: 'realizada',
                texto: 'REALIZADA',
                color: 'success'
            };
        }
        
        if (cita.estado === 'Ausente') {
            return {
                estado: 'ausente',
                texto: 'AUSENTE',
                color: 'danger'
            };
        }
        
        // Ventana de "en curso": ±15 minutos
        if (currentTime >= appointmentTime - 15 && currentTime <= appointmentTime + 15) {
            return {
                estado: 'en_curso',
                texto: 'EN CURSO',
                color: 'warning'
            };
        }
        
        if (currentTime > appointmentTime + 15) {
            return {
                estado: 'vencida',
                texto: 'VENCIDA',
                color: 'danger'
            };
        }
        
        return {
            estado: 'pendiente',
            texto: 'PENDIENTE',
            color: 'primary'
        };
    },

    // Obtener acciones para una cita
    getAppointmentActions: function(cita, estado) {
        switch(estado) {
            case 'realizada':
                return `
                    <small class="text-muted">
                        <i class="bi bi-check-circle"></i> Realizada a las ${cita.hora_real}
                    </small>
                `;
            case 'ausente':
                return `
                    <small class="text-muted">
                        <i class="bi bi-x-circle"></i> Marcada como ausente
                    </small>
                `;
            case 'en_curso':
            case 'vencida':
            case 'pendiente':
                return `
                    <div class="d-grid gap-1">
                        <button class="btn btn-sm btn-success" 
                                onclick="GestorOrdenes.ui.registerSessionFromAppointment(${cita.sesion_id})">
                            <i class="bi bi-check-circle"></i> Registrar Sesión
                        </button>
                        <button class="btn btn-sm btn-outline-danger" 
                                onclick="GestorOrdenes.ui.markAppointmentAbsent(${cita.sesion_id})">
                            <i class="bi bi-x-circle"></i> Marcar Ausente
                        </button>
                    </div>
                `;
            default:
                return '';
        }
    },

    // Actualizar citas de hoy
    refreshTodayAppointments: function() {
        this.loadTodayAppointments();
        this.loadTodayStats();
    },

    // Obtener citas de hoy para un paciente específico
    getPatientTodayAppointments: function(pacienteId, fechaHoy) {
        const sesiones = GestorOrdenes.storage.sesiones.getAll()
            .filter(sesion => {
                const orden = GestorOrdenes.storage.ordenes.getById(sesion.orden_id);
                return orden && 
                       orden.paciente_id === pacienteId &&
                       sesion.fecha_programada === fechaHoy && 
                       sesion.profesional_id === 1; // POC: usuario fijo
            })
            .sort((a, b) => a.hora_programada.localeCompare(b.hora_programada));

        return sesiones.map(sesion => {
            const orden = GestorOrdenes.storage.ordenes.getById(sesion.orden_id);
            const practica = GestorOrdenes.storage.practicas.getById(orden.practica_id);
            
            return {
                sesion_id: sesion.id,
                orden_id: orden.id,
                practica: practica.nombrePractica,
                hora_programada: sesion.hora_programada,
                estado: sesion.estado,
                fecha_programada: sesion.fecha_programada,
                fecha_real: sesion.fecha_real,
                hora_real: sesion.hora_real
            };
        });
    },

    // Cargar estadísticas del día
    loadTodayStats: function() {
        const stats = GestorOrdenes.utils.getTodayStats();
        
        // Widget 1: Citas programadas hoy
        const citasProgramadasElement = document.getElementById('citasProgramadasHoy');
        if (citasProgramadasElement) {
            citasProgramadasElement.textContent = stats.programadas;
        }

        // Widget 2: Citas completadas
        const citasCompletadasElement = document.getElementById('citasCompletadasHoy');
        const citasTotalElement = document.getElementById('citasTotalHoy');
        const porcentajeElement = document.getElementById('porcentajeCompletado');
        
        if (citasCompletadasElement) {
            citasCompletadasElement.textContent = stats.completadas;
        }
        if (citasTotalElement) {
            citasTotalElement.textContent = stats.programadas;
        }
        if (porcentajeElement) {
            porcentajeElement.textContent = stats.porcentaje;
        }

        // Widget 3: Próxima cita
        const proximaCitaHoraElement = document.getElementById('proximaCitaHora');
        const proximaCitaPacienteElement = document.getElementById('proximaCitaPaciente');
        
        if (proximaCitaHoraElement) {
            proximaCitaHoraElement.textContent = stats.proximaCita.hora || '--:--';
        }
        if (proximaCitaPacienteElement) {
            proximaCitaPacienteElement.textContent = stats.proximaCita.paciente || '--';
        }
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

        // Verificar si tiene citas programadas para hoy
        const today = new Date();
        const fechaHoy = GestorOrdenes.utils.formatDateForStorage(today);
        const citasHoy = this.getPatientTodayAppointments(paciente.id, fechaHoy);
        
        // Mostrar información del paciente
        let html = `
            <div class="patient-info">
                <div class="patient-name">${paciente.nombreCompleto}</div>
                <div class="patient-dni">DNI: ${paciente.dni}</div>
        `;

        // Agregar información de citas de hoy si existen
        if (citasHoy.length > 0) {
            // Validar timing de la cita más próxima
            const citaActual = citasHoy[0]; // Primera cita del día
            const timingValidation = GestorOrdenes.utils.validateAppointmentTiming(citaActual);
            
            const alertClass = timingValidation.status === 'onTime' ? 'alert-success' : 
                             timingValidation.status === 'early' ? 'alert-warning' : 
                             timingValidation.status === 'late' ? 'alert-warning' : 'alert-info';
            
            html += `
                <div class="mt-2">
                    <div class="${alertClass} mb-2">
                        <strong>${timingValidation.message}</strong>
                    </div>
                    <div class="alert alert-info mb-2">
                        <strong><i class="bi bi-calendar-check"></i> Todas las citas de hoy:</strong>
                        <ul class="mb-0 mt-1">
            `;
            
            citasHoy.forEach(cita => {
                const estadoInfo = this.getAppointmentStatus(cita);
                const citaTiming = GestorOrdenes.utils.validateAppointmentTiming(cita);
                const timingIcon = citaTiming.status === 'onTime' ? '✅' : 
                                  citaTiming.status === 'early' ? '⏰' : 
                                  citaTiming.status === 'late' ? '⏰' : '📅';
                
                html += `
                    <li>
                        <span class="badge bg-${estadoInfo.color} me-2">${cita.hora_programada}</span>
                        ${timingIcon} ${cita.practica} - ${estadoInfo.texto}
                    </li>
                `;
            });
            
            html += `
                        </ul>
                    </div>
                </div>
            `;
        }

        html += `</div>`;

        ordenesActivas.forEach(orden => {
            const practica = GestorOrdenes.storage.practicas.getById(orden.practica_id);
            const progreso = GestorOrdenes.utils.getSessionProgress(orden.id);
            
            // Verificar si esta orden tiene cita programada para hoy
            const citaOrden = citasHoy.find(cita => cita.orden_id === orden.id);
            let citaInfo = '';
            
            if (citaOrden) {
                const estadoInfo = this.getAppointmentStatus(citaOrden);
                citaInfo = `
                    <div class="cita-info">
                        <small class="text-${estadoInfo.color}">
                            <i class="bi bi-clock"></i> Programada para las ${citaOrden.hora_programada} - ${estadoInfo.texto}
                        </small>
                    </div>
                `;
            }
            
            html += `
                <div class="order-card">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${practica ? practica.nombrePractica : 'N/A'}</strong>
                            <div class="order-progress">Sesiones pendientes: ${progreso.pendientes} de ${progreso.total}</div>
                            ${citaInfo}
                        </div>
                        <button class="btn btn-success btn-sm" onclick="GestorOrdenes.ui.registerSessionWithTiming(${orden.id}, ${paciente.id})">
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
            
            // Actualizar citas del día
            this.refreshTodayAppointments();
            
            // Limpiar búsqueda
            document.getElementById('dniSearch').value = '';
            document.getElementById('searchResult').innerHTML = '';
        }
    },

    // Ver orden (placeholder)
    viewOrder: function(ordenId) {
        // Redireccionar a página de órdenes con filtro
        window.location.href = `pages/ordenes.html?orden=${ordenId}`;
    },

    // Registrar sesión desde cita programada
    registerSessionFromAppointment: function(sesionId) {
        try {
            const sesion = GestorOrdenes.storage.sesiones.getById(sesionId);
            if (!sesion) {
                GestorOrdenes.utils.showNotification('Sesión no encontrada', 'error');
                return false;
            }

            // Actualizar sesión con datos reales
            const now = new Date();
            sesion.fechaPrestacion = GestorOrdenes.utils.getCurrentDate();
            sesion.fecha_real = GestorOrdenes.utils.getCurrentDate();
            sesion.hora_real = now.toTimeString().slice(0, 5); // HH:MM
            sesion.estado = 'Realizada';

            // Guardar sesión
            const success = GestorOrdenes.storage.sesiones.save(sesion);
            if (!success) {
                throw new Error('Error al guardar la sesión');
            }

            GestorOrdenes.utils.showNotification('✅ Sesión registrada exitosamente', 'success');
            
            // Actualizar widgets
            this.refreshTodayAppointments();
            
            return true;
        } catch (error) {
            console.error('Error al registrar sesión:', error);
            GestorOrdenes.utils.showNotification('Error al registrar la sesión', 'error');
            return false;
        }
    },

    // Marcar cita como ausente
    markAppointmentAbsent: function(sesionId) {
        try {
            const sesion = GestorOrdenes.storage.sesiones.getById(sesionId);
            if (!sesion) {
                GestorOrdenes.utils.showNotification('Sesión no encontrada', 'error');
                return false;
            }

            // Confirmar acción
            if (!confirm('¿Está seguro de marcar esta cita como ausente?')) {
                return false;
            }

            // Actualizar sesión
            const now = new Date();
            sesion.fechaPrestacion = GestorOrdenes.utils.getCurrentDate();
            sesion.fecha_real = GestorOrdenes.utils.getCurrentDate();
            sesion.hora_real = now.toTimeString().slice(0, 5); // HH:MM
            sesion.estado = 'Ausente';

            // Guardar sesión
            const success = GestorOrdenes.storage.sesiones.save(sesion);
            if (!success) {
                throw new Error('Error al guardar la sesión');
            }

            GestorOrdenes.utils.showNotification('❌ Cita marcada como ausente', 'warning');
            
            // Actualizar widgets
            this.refreshTodayAppointments();
            
            return true;
        } catch (error) {
            console.error('Error al marcar ausencia:', error);
            GestorOrdenes.utils.showNotification('Error al marcar la ausencia', 'error');
            return false;
        }
    },

    // Registrar sesión con validación de timing
    registerSessionWithTiming: function(ordenId, pacienteId) {
        const today = new Date();
        const fechaHoy = GestorOrdenes.utils.formatDateForStorage(today);
        const citasHoy = this.getPatientTodayAppointments(pacienteId, fechaHoy);
        
        // Buscar la cita más próxima para esta orden
        const citaActual = citasHoy.find(cita => cita.orden_id === ordenId);
        
        if (!citaActual) {
            // No hay cita programada - mostrar modal de urgencia
            this.showTimingModal('noAppointment', null, ordenId);
            return;
        }
        
        const timingValidation = GestorOrdenes.utils.validateAppointmentTiming(citaActual);
        
        if (timingValidation.status === 'onTime') {
            // A tiempo - proceder directo
            this.confirmTimingAction('attendNow', ordenId, citaActual.sesion_id);
        } else {
            // Temprano/tarde - mostrar modal de confirmación
            this.showTimingModal(timingValidation.status, citaActual, ordenId);
        }
    },

    // Mostrar modal de confirmación de timing
    showTimingModal: function(status, cita, ordenId) {
        const modal = document.getElementById('confirmTimingModal');
        const modalBody = document.getElementById('confirmTimingModalBody');
        const modalFooter = document.getElementById('confirmTimingModalFooter');
        
        let bodyContent = '';
        let footerContent = '';
        
        if (status === 'noAppointment') {
            bodyContent = `
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Sin cita programada</strong>
                </div>
                <p>Este paciente no tiene cita programada para hoy.</p>
                <p>¿Desea atenderlo como urgencia?</p>
            `;
            
            footerContent = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-warning" onclick="GestorOrdenes.ui.confirmTimingAction('attendUrgency', ${ordenId}, null)">
                    <i class="bi bi-lightning"></i> Atender como Urgencia
                </button>
            `;
        } else {
            const timingValidation = GestorOrdenes.utils.validateAppointmentTiming(cita);
            const isEarly = status === 'early';
            const isLate = status === 'late';
            
            bodyContent = `
                <div class="alert ${isEarly ? 'alert-warning' : 'alert-danger'}">
                    <i class="bi bi-${isEarly ? 'clock' : 'clock-history'}"></i>
                    <strong>${timingValidation.message}</strong>
                </div>
                <p>Diferencia: ${Math.abs(timingValidation.difference)} minutos ${timingValidation.difference > 0 ? 'tarde' : 'temprano'}</p>
                <p>¿Cómo desea proceder?</p>
            `;
            
            footerContent = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-success" onclick="GestorOrdenes.ui.confirmTimingAction('attendNow', ${ordenId}, ${cita.sesion_id})">
                    <i class="bi bi-check-circle"></i> Atender Ahora
                </button>
                <button type="button" class="btn btn-outline-primary" onclick="GestorOrdenes.ui.confirmTimingAction('maintainSchedule', ${ordenId}, ${cita.sesion_id})">
                    <i class="bi bi-calendar-check"></i> Mantener Horario Original
                </button>
            `;
        }
        
        modalBody.innerHTML = bodyContent;
        modalFooter.innerHTML = footerContent;
        
        // Mostrar modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    },

    // Confirmar acción de timing
    confirmTimingAction: function(action, ordenId, sesionId) {
        const modal = document.getElementById('confirmTimingModal');
        const bsModal = bootstrap.Modal.getInstance(modal);
        
        try {
            switch (action) {
                case 'attendNow':
                    this.executeAttendNow(ordenId, sesionId);
                    break;
                case 'attendUrgency':
                    this.executeAttendUrgency(ordenId);
                    break;
                case 'maintainSchedule':
                    this.executeMaintainSchedule(ordenId, sesionId);
                    break;
                default:
                    console.error('Acción no reconocida:', action);
                    return;
            }
            
            if (bsModal) {
                bsModal.hide();
            }
            
        } catch (error) {
            console.error('Error al ejecutar acción:', error);
            GestorOrdenes.utils.showNotification('Error al procesar la acción', 'error');
        }
    },

    // Ejecutar atender ahora
    executeAttendNow: function(ordenId, sesionId) {
        if (sesionId) {
            // Registrar sesión específica
            this.registerSessionFromAppointment(sesionId);
        } else {
            // Registrar sesión general
            this.registerSessionFromDashboard(ordenId);
        }
        
        // Actualizar todos los widgets del dashboard
        this.updateDashboardAfterCheckIn();
        
        GestorOrdenes.utils.showNotification('✅ Sesión registrada exitosamente', 'success');
    },

    // Ejecutar atender como urgencia
    executeAttendUrgency: function(ordenId) {
        const success = GestorOrdenes.app.registerTodaySession(ordenId, 'urgencia');
        
        if (success) {
            this.updateDashboardAfterCheckIn();
            GestorOrdenes.utils.showNotification('⚡ Sesión de urgencia registrada', 'warning');
        }
    },

    // Ejecutar mantener horario original
    executeMaintainSchedule: function(ordenId, sesionId) {
        GestorOrdenes.utils.showNotification('⏰ Check-in cancelado - manteniendo horario original', 'info');
        
        // Simplemente no hacer nada, mantener el horario original
        // En una implementación real, se podría enviar una notificación al paciente
    },

    // Actualizar dashboard después del check-in
    updateDashboardAfterCheckIn: function() {
        // Actualizar widgets principales
        this.refreshTodayAppointments();
        this.loadTodayStats();
        
        // Actualizar estadísticas generales
        this.loadStats();
        this.loadRecentOrders();
        
        // Limpiar resultado de búsqueda
        const searchInput = document.getElementById('dniSearch');
        const searchResult = document.getElementById('searchResult');
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        if (searchResult) {
            searchResult.innerHTML = '';
        }
        
        // Agregar nota visual de actualización
        const container = document.getElementById('citasHoy');
        if (container) {
            container.style.opacity = '0.5';
            setTimeout(() => {
                container.style.opacity = '1';
            }, 300);
        }
    },

    // === WIDGET DE NOTIFICACIONES (HU-1.2) ===
    
    // Cargar y renderizar notificaciones
    loadNotifications: function() {
        try {
            const notificaciones = GestorOrdenes.storage.notificaciones.getUnread();
            const container = document.getElementById('notificationsContainer');
            
            if (!container) {
                console.warn('Container de notificaciones no encontrado');
                return;
            }
            
            if (notificaciones.length === 0) {
                container.innerHTML = `
                    <div class="p-3 text-center text-muted">
                        <i class="bi bi-check-circle-fill text-success fs-1"></i>
                        <p class="mt-2 mb-0">¡Todo al día! No hay notificaciones pendientes.</p>
                    </div>
                `;
                return;
            }
            
            // Agrupar por tipo
            const agrupadas = {
                orden_sin_programar: notificaciones.filter(n => n.tipo === 'orden_sin_programar'),
                conflicto_horario: notificaciones.filter(n => n.tipo === 'conflicto_horario'),
                cita_proxima: notificaciones.filter(n => n.tipo === 'cita_proxima')
            };
            
            let html = '';
            
            // Notificaciones críticas (órdenes sin programar)
            if (agrupadas.orden_sin_programar.length > 0) {
                html += this.renderNotificationGroup(
                    'Órdenes Sin Programar',
                    agrupadas.orden_sin_programar,
                    'danger',
                    'exclamation-triangle-fill'
                );
            }
            
            // Conflictos de horario
            if (agrupadas.conflicto_horario.length > 0) {
                html += this.renderNotificationGroup(
                    'Conflictos de Horario',
                    agrupadas.conflicto_horario,
                    'warning',
                    'clock-fill'
                );
            }
            
            // Citas próximas
            if (agrupadas.cita_proxima.length > 0) {
                html += this.renderNotificationGroup(
                    'Citas Próximas',
                    agrupadas.cita_proxima,
                    'info',
                    'calendar-event-fill'
                );
            }
            
            container.innerHTML = html;
            
            // Actualizar contador en el título si existe
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.textContent = notificaciones.length;
                badge.style.display = notificaciones.length > 0 ? 'inline' : 'none';
            }
            
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        }
    },
    
    // Renderizar grupo de notificaciones
    renderNotificationGroup: function(titulo, notificaciones, tipoColor, icono) {
        let html = `
            <div class="border-bottom">
                <div class="p-3 bg-${tipoColor} bg-opacity-10">
                    <h6 class="mb-0 text-${tipoColor}">
                        <i class="bi bi-${icono}"></i> ${titulo} (${notificaciones.length})
                    </h6>
                </div>
                <div class="p-0">
        `;
        
        notificaciones.forEach(notificacion => {
            const fechaCreacion = new Date(notificacion.fecha_creacion).toLocaleString('es-ES');
            html += `
                <div class="notification-item p-3 border-bottom">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <p class="mb-1">${notificacion.mensaje}</p>
                            <small class="text-muted">
                                <i class="bi bi-clock"></i> ${fechaCreacion}
                            </small>
                        </div>
                        <div class="ms-3">
                            ${notificacion.accion_url ? `
                                <button class="btn btn-sm btn-outline-${tipoColor} me-1" 
                                        onclick="GestorOrdenes.ui.handleNotificationAction('${notificacion.accion_url}', ${notificacion.id})">
                                    <i class="bi bi-arrow-right"></i> Ver
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-outline-secondary" 
                                    onclick="GestorOrdenes.ui.markNotificationAsRead(${notificacion.id})">
                                <i class="bi bi-check"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    },
    
    // Marcar notificación como leída
    markNotificationAsRead: function(notificationId) {
        const success = GestorOrdenes.storage.notificaciones.markAsRead(notificationId);
        if (success) {
            this.loadNotifications();
            GestorOrdenes.utils.showNotification('Notificación marcada como leída', 'success');
        }
    },
    
    // Marcar todas las notificaciones como leídas
    markAllNotificationsAsRead: function() {
        const success = GestorOrdenes.storage.notificaciones.markAllAsRead();
        if (success) {
            this.loadNotifications();
            GestorOrdenes.utils.showNotification('Todas las notificaciones marcadas como leídas', 'success');
        }
    },
    
    // Manejar acción de notificación
    handleNotificationAction: function(url, notificationId) {
        // Marcar como leída al hacer click en acción
        GestorOrdenes.storage.notificaciones.markAsRead(notificationId);
        
        // Navegar a la URL
        if (url.startsWith('pages/')) {
            window.location.href = url;
        } else {
            // URL externa o con parámetros especiales
            window.open(url, '_blank');
        }
    },
    
    // Refrescar notificaciones
    refreshNotifications: function() {
        console.log('🔔 Actualizando notificaciones...');
        
        // Ejecutar detectores
        this.runNotificationDetectors();
        this.cleanupNotifications();
        
        // Recargar UI
        setTimeout(() => {
            this.loadNotifications();
            GestorOrdenes.utils.showNotification('Notificaciones actualizadas', 'info');
        }, 500);
    },

    // === SISTEMA DE NOTIFICACIONES (HU-1.2) ===
    
    // Detector de órdenes sin programar
    detectUnscheduledOrders: function() {
        try {
            const ordenes = GestorOrdenes.storage.ordenes.getActivas();
            const notificacionesCreadas = [];
            
            ordenes.forEach(orden => {
                const sesiones = GestorOrdenes.storage.sesiones.getByOrden(orden.id);
                const sesionesSinProgramar = sesiones.filter(s => 
                    s.estado === 'Pendiente' && !s.fecha_programada
                );
                
                // Si hay sesiones sin programar, crear notificación
                if (sesionesSinProgramar.length > 0) {
                    const paciente = GestorOrdenes.storage.pacientes.getById(orden.paciente_id);
                    const notificacionExistente = GestorOrdenes.storage.notificaciones.getByOrden(orden.id)
                        .find(n => n.tipo === 'orden_sin_programar' && !n.leida);
                    
                    // Solo crear si no existe una notificación no leída del mismo tipo
                    if (!notificacionExistente) {
                        const notificacion = {
                            tipo: 'orden_sin_programar',
                            mensaje: `La orden #${orden.id} de ${paciente ? paciente.nombreCompleto : 'Paciente'} tiene ${sesionesSinProgramar.length} sesión(es) sin programar`,
                            orden_id: orden.id,
                            fecha_creacion: new Date().toISOString(),
                            leida: false,
                            accion_url: `pages/ordenes.html?orden=${orden.id}`
                        };
                        
                        const success = GestorOrdenes.storage.notificaciones.save(notificacion);
                        if (success) {
                            notificacionesCreadas.push(notificacion);
                        }
                    }
                }
            });
            
            console.log(`Detector de órdenes sin programar: ${notificacionesCreadas.length} notificaciones creadas`);
            return notificacionesCreadas;
            
        } catch (error) {
            console.error('Error en detector de órdenes sin programar:', error);
            return [];
        }
    },
    
    // Detector de conflictos de horario
    detectScheduleConflicts: function() {
        try {
            const sesiones = GestorOrdenes.storage.sesiones.getAll();
            const sesionesConFecha = sesiones.filter(s => 
                s.fecha_programada && s.hora_programada && s.estado === 'Pendiente'
            );
            const notificacionesCreadas = [];
            
            // Agrupar sesiones por fecha y hora
            const agrupadas = {};
            sesionesConFecha.forEach(sesion => {
                const key = `${sesion.fecha_programada}_${sesion.hora_programada}`;
                if (!agrupadas[key]) {
                    agrupadas[key] = [];
                }
                agrupadas[key].push(sesion);
            });
            
            // Buscar conflictos (más de una sesión en el mismo momento)
            Object.keys(agrupadas).forEach(key => {
                const sesionesEnMomento = agrupadas[key];
                if (sesionesEnMomento.length > 1) {
                    const [fecha, hora] = key.split('_');
                    const notificacionExistente = GestorOrdenes.storage.notificaciones.getAll()
                        .find(n => 
                            n.tipo === 'conflicto_horario' && 
                            n.mensaje.includes(fecha) && 
                            n.mensaje.includes(hora) && 
                            !n.leida
                        );
                    
                    // Solo crear si no existe una notificación no leída del mismo conflicto
                    if (!notificacionExistente) {
                        const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES');
                        const notificacion = {
                            tipo: 'conflicto_horario',
                            mensaje: `Conflicto de horario: ${sesionesEnMomento.length} sesiones programadas el ${fechaFormateada} a las ${hora}`,
                            orden_id: null, // Conflicto general, no específico de una orden
                            fecha_creacion: new Date().toISOString(),
                            leida: false,
                            accion_url: `pages/agenda.html?fecha=${fecha}&hora=${hora}`
                        };
                        
                        const success = GestorOrdenes.storage.notificaciones.save(notificacion);
                        if (success) {
                            notificacionesCreadas.push(notificacion);
                        }
                    }
                }
            });
            
            console.log(`Detector de conflictos: ${notificacionesCreadas.length} notificaciones creadas`);
            return notificacionesCreadas;
            
        } catch (error) {
            console.error('Error en detector de conflictos:', error);
            return [];
        }
    },
    
    // Detector de citas próximas
    detectUpcomingAppointments: function() {
        try {
            const sesiones = GestorOrdenes.storage.sesiones.getAll();
            const hoy = new Date();
            const mañana = new Date(hoy);
            mañana.setDate(hoy.getDate() + 1);
            const mañanaStr = mañana.toISOString().split('T')[0];
            
            const sesionesProximas = sesiones.filter(s => 
                s.fecha_programada === mañanaStr && 
                s.estado === 'Pendiente'
            );
            const notificacionesCreadas = [];
            
            sesionesProximas.forEach(sesion => {
                const orden = GestorOrdenes.storage.ordenes.getById(sesion.orden_id);
                const paciente = GestorOrdenes.storage.pacientes.getById(orden.paciente_id);
                
                const notificacionExistente = GestorOrdenes.storage.notificaciones.getAll()
                    .find(n => 
                        n.tipo === 'cita_proxima' && 
                        n.mensaje.includes(`Sesión #${sesion.numeroSesion}`) &&
                        n.mensaje.includes(paciente ? paciente.nombreCompleto : '') &&
                        !n.leida
                    );
                
                // Solo crear si no existe una notificación no leída
                if (!notificacionExistente) {
                    const notificacion = {
                        tipo: 'cita_proxima',
                        mensaje: `Cita mañana: Sesión #${sesion.numeroSesion} de ${paciente ? paciente.nombreCompleto : 'Paciente'} a las ${sesion.hora_programada}`,
                        orden_id: orden.id,
                        fecha_creacion: new Date().toISOString(),
                        leida: false,
                        accion_url: `pages/sesiones.html?sesion=${sesion.id}`
                    };
                    
                    const success = GestorOrdenes.storage.notificaciones.save(notificacion);
                    if (success) {
                        notificacionesCreadas.push(notificacion);
                    }
                }
            });
            
            console.log(`Detector de citas próximas: ${notificacionesCreadas.length} notificaciones creadas`);
            return notificacionesCreadas;
            
        } catch (error) {
            console.error('Error en detector de citas próximas:', error);
            return [];
        }
    },
    
    // Ejecutar todos los detectores automáticamente
    runNotificationDetectors: function() {
        console.log('🔔 Ejecutando detectores de notificaciones...');
        
        const resultados = {
            ordenesSinProgramar: this.detectUnscheduledOrders(),
            conflictosHorario: this.detectScheduleConflicts(),
            citasProximas: this.detectUpcomingAppointments()
        };
        
        const totalNotificaciones = resultados.ordenesSinProgramar.length + 
                                   resultados.conflictosHorario.length + 
                                   resultados.citasProximas.length;
        
        console.log(`📊 Detectores completados: ${totalNotificaciones} notificaciones nuevas`);
        return resultados;
    },
    
    // Limpiar notificaciones obsoletas
    cleanupNotifications: function() {
        try {
            let limpiezaCount = 0;
            
            // Limpiar notificaciones de órdenes que ya no existen
            const notificaciones = GestorOrdenes.storage.notificaciones.getAll();
            notificaciones.forEach(notificacion => {
                if (notificacion.orden_id) {
                    const orden = GestorOrdenes.storage.ordenes.getById(notificacion.orden_id);
                    if (!orden || orden.estado === 'Cerrada') {
                        GestorOrdenes.storage.notificaciones.delete(notificacion.id);
                        limpiezaCount++;
                    }
                }
            });
            
            // Limpiar notificaciones viejas (más de 30 días)
            const limpiezaViejas = GestorOrdenes.storage.notificaciones.deleteOld(30);
            
            console.log(`🧹 Limpieza de notificaciones: ${limpiezaCount} eliminadas por órdenes cerradas`);
            return limpiezaCount;
            
        } catch (error) {
            console.error('Error en limpieza de notificaciones:', error);
            return 0;
        }
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
    
    // Ejecutar detectores de notificaciones automáticamente
    setTimeout(() => {
        GestorOrdenes.ui.runNotificationDetectors();
        GestorOrdenes.ui.cleanupNotifications();
    }, 1000);
    
    console.log('=== POC Inicializado Correctamente ===');
    return true;
};

// Validaciones de capacidad (HU-1.3)
GestorOrdenes.capacity = {
    // Validar capacidad antes de programar
    validateBeforeScheduling: function(date, time) {
        try {
            const dateStr = date.toISOString ? date.toISOString().split('T')[0] : date;
            const hour = parseInt(time.split(':')[0]);
            
            // Calcular capacidad actual
            const sesiones = GestorOrdenes.storage.sesiones.getAll();
            const sesionesEnHorario = sesiones.filter(sesion => {
                if (!sesion.fecha_programada || !sesion.hora_programada) return false;
                
                const sesionHour = parseInt(sesion.hora_programada.split(':')[0]);
                return sesion.fecha_programada === dateStr && sesionHour === hour;
            });
            
            const currentCount = sesionesEnHorario.length;
            
            return {
                isValid: currentCount < 5, // Límite máximo absoluto
                needsWarning: currentCount >= 3, // Advertencia a partir de 3
                currentCount: currentCount,
                level: currentCount >= 5 ? 'high' : currentCount >= 3 ? 'medium' : currentCount > 0 ? 'low' : 'free',
                patients: sesionesEnHorario,
                date: dateStr,
                time: time
            };
        } catch (error) {
            console.error('Error al validar capacidad:', error);
            return { isValid: true, needsWarning: false, currentCount: 0 };
        }
    },
    
    // Mostrar advertencia de capacidad
    showWarning: function(validation, callback) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'capacityWarningModalTemp';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-warning">
                        <h5 class="modal-title text-dark">
                            <i class="bi bi-exclamation-triangle"></i> Advertencia de Capacidad
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <h6><i class="bi bi-exclamation-triangle"></i> Alta Demanda Detectada</h6>
                            <p>Ya hay <strong>${validation.currentCount} pacientes</strong> programados para el <strong>${validation.date} a las ${validation.time}</strong>.</p>
                            <p>Se recomienda un máximo de 4 pacientes por horario para mantener la calidad de atención.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Elegir Otro Horario</button>
                        <button type="button" class="btn btn-warning" id="confirmCapacityBtn">
                            Continuar de Todas Formas
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const bootstrapModal = new bootstrap.Modal(modal);
        
        document.getElementById('confirmCapacityBtn').addEventListener('click', () => {
            bootstrapModal.hide();
            if (callback) callback(true);
        });
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
            if (callback && !modal.confirmed) callback(false);
        });
        
        bootstrapModal.show();
    }
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

// Exponer GestorOrdenes globalmente para debugging
window.GestorOrdenes = GestorOrdenes;