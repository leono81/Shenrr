/**
 * Gestor de LocalStorage para el POC
 * Maneja la persistencia de datos en el navegador
 */

const GestorOrdenes = {
    storage: {
        // Claves de almacenamiento
        keys: {
            ORDENES: 'gestorOrdenes_ordenes',
            SESIONES: 'gestorOrdenes_sesiones',
            PACIENTES: 'gestorOrdenes_pacientes',
            OBRAS_SOCIALES: 'gestorOrdenes_obras_sociales',
            MEDICOS_DERIVANTES: 'gestorOrdenes_medicos_derivantes',
            PRACTICAS: 'gestorOrdenes_practicas',
            ARANCELES: 'gestorOrdenes_aranceles',
            PRESENTACIONES: 'gestorOrdenes_presentaciones',
            INITIALIZED: 'gestorOrdenes_initialized'
        },

        // Obtener datos del localStorage
        get: function(key) {
            try {
                const data = localStorage.getItem(this.keys[key]);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('Error al obtener datos del storage:', error);
                return null;
            }
        },

        // Guardar datos en localStorage
        set: function(key, data) {
            try {
                localStorage.setItem(this.keys[key], JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error al guardar datos en storage:', error);
                return false;
            }
        },

        // Eliminar datos del localStorage
        remove: function(key) {
            try {
                localStorage.removeItem(this.keys[key]);
                return true;
            } catch (error) {
                console.error('Error al eliminar datos del storage:', error);
                return false;
            }
        },

        // Limpiar todo el storage
        clear: function() {
            try {
                Object.values(this.keys).forEach(key => {
                    localStorage.removeItem(key);
                });
                return true;
            } catch (error) {
                console.error('Error al limpiar storage:', error);
                return false;
            }
        },

        // Verificar si ya se inicializó
        isInitialized: function() {
            return localStorage.getItem(this.keys.INITIALIZED) === 'true';
        },

        // Marcar como inicializado
        markInitialized: function() {
            localStorage.setItem(this.keys.INITIALIZED, 'true');
        },

        // Obtener siguiente ID para una entidad
        getNextId: function(entityKey) {
            const entities = this.get(entityKey) || [];
            if (entities.length === 0) return 1;
            
            const maxId = Math.max(...entities.map(entity => entity.id));
            return maxId + 1;
        },

        // Métodos específicos para cada entidad
        pacientes: {
            getAll: function() {
                return GestorOrdenes.storage.get('PACIENTES') || [];
            },
            
            getById: function(id) {
                const pacientes = this.getAll();
                return pacientes.find(p => p.id === id);
            },
            
            getByDni: function(dni) {
                const pacientes = this.getAll();
                return pacientes.find(p => p.dni === dni);
            },
            
            save: function(paciente) {
                const pacientes = this.getAll();
                const index = pacientes.findIndex(p => p.id === paciente.id);
                
                if (index >= 0) {
                    pacientes[index] = paciente;
                } else {
                    paciente.id = GestorOrdenes.storage.getNextId('PACIENTES');
                    pacientes.push(paciente);
                }
                
                return GestorOrdenes.storage.set('PACIENTES', pacientes);
            }
        },

        ordenes: {
            getAll: function() {
                return GestorOrdenes.storage.get('ORDENES') || [];
            },
            
            getById: function(id) {
                const ordenes = this.getAll();
                return ordenes.find(o => o.id === id);
            },
            
            getByPaciente: function(pacienteId) {
                const ordenes = this.getAll();
                return ordenes.filter(o => o.paciente_id === pacienteId);
            },
            
            getActivas: function() {
                const ordenes = this.getAll();
                return ordenes.filter(o => o.estado === 'Abierta');
            },
            
            save: function(orden) {
                const ordenes = this.getAll();
                const index = ordenes.findIndex(o => o.id === orden.id);
                
                if (index >= 0) {
                    ordenes[index] = orden;
                } else {
                    orden.id = GestorOrdenes.storage.getNextId('ORDENES');
                    ordenes.push(orden);
                }
                
                return GestorOrdenes.storage.set('ORDENES', ordenes);
            }
        },

        sesiones: {
            getAll: function() {
                return GestorOrdenes.storage.get('SESIONES') || [];
            },
            
            getById: function(id) {
                const sesiones = this.getAll();
                return sesiones.find(s => s.id === id);
            },
            
            getByOrden: function(ordenId) {
                const sesiones = this.getAll();
                return sesiones.filter(s => s.orden_id === ordenId);
            },
            
            getPendientesByOrden: function(ordenId) {
                const sesiones = this.getByOrden(ordenId);
                return sesiones.filter(s => s.estado === 'Pendiente');
            },
            
            getRealizadas: function() {
                const sesiones = this.getAll();
                return sesiones.filter(s => s.estado === 'Realizada');
            },
            
            save: function(sesion) {
                const sesiones = this.getAll();
                const index = sesiones.findIndex(s => s.id === sesion.id);
                
                if (index >= 0) {
                    sesiones[index] = sesion;
                } else {
                    sesion.id = GestorOrdenes.storage.getNextId('SESIONES');
                    sesiones.push(sesion);
                }
                
                return GestorOrdenes.storage.set('SESIONES', sesiones);
            },
            
            bulkSave: function(sesionesArray) {
                const sesiones = this.getAll();
                
                sesionesArray.forEach(sesion => {
                    if (!sesion.id) {
                        sesion.id = GestorOrdenes.storage.getNextId('SESIONES');
                    }
                    
                    const index = sesiones.findIndex(s => s.id === sesion.id);
                    if (index >= 0) {
                        sesiones[index] = sesion;
                    } else {
                        sesiones.push(sesion);
                    }
                });
                
                return GestorOrdenes.storage.set('SESIONES', sesiones);
            }
        },

        obrasSociales: {
            getAll: function() {
                return GestorOrdenes.storage.get('OBRAS_SOCIALES') || [];
            },
            
            getById: function(id) {
                const obrasSociales = this.getAll();
                return obrasSociales.find(os => os.id === id);
            }
        },

        medicos: {
            getAll: function() {
                return GestorOrdenes.storage.get('MEDICOS_DERIVANTES') || [];
            },
            
            getById: function(id) {
                const medicos = this.getAll();
                return medicos.find(m => m.id === id);
            }
        },

        practicas: {
            getAll: function() {
                return GestorOrdenes.storage.get('PRACTICAS') || [];
            },
            
            getById: function(id) {
                const practicas = this.getAll();
                return practicas.find(p => p.id === id);
            }
        },

        aranceles: {
            getAll: function() {
                return GestorOrdenes.storage.get('ARANCELES') || [];
            },
            
            getByPracticaYObraSocial: function(practicaId, obraSocialId) {
                const aranceles = this.getAll();
                return aranceles.filter(a => a.practica_id === practicaId && a.obraSocial_id === obraSocialId);
            },
            
            getImporteVigente: function(practicaId, obraSocialId, fechaPrestacion) {
                const aranceles = this.getByPracticaYObraSocial(practicaId, obraSocialId);
                
                // Filtrar aranceles vigentes en la fecha de prestación
                const arancelesVigentes = aranceles.filter(a => {
                    const fechaVigencia = new Date(a.fecha_vigencia);
                    const fechaComparar = new Date(fechaPrestacion);
                    return fechaVigencia <= fechaComparar;
                });
                
                // Obtener el más reciente
                if (arancelesVigentes.length === 0) return 0;
                
                const masReciente = arancelesVigentes.reduce((prev, current) => {
                    return new Date(prev.fecha_vigencia) > new Date(current.fecha_vigencia) ? prev : current;
                });
                
                return masReciente.importe;
            }
        },

        presentaciones: {
            getAll: function() {
                return GestorOrdenes.storage.get('PRESENTACIONES') || [];
            },
            
            getById: function(id) {
                const presentaciones = this.getAll();
                return presentaciones.find(p => p.id === id);
            },
            
            save: function(presentacion) {
                const presentaciones = this.getAll();
                const index = presentaciones.findIndex(p => p.id === presentacion.id);
                
                if (index >= 0) {
                    presentaciones[index] = presentacion;
                } else {
                    presentacion.id = GestorOrdenes.storage.getNextId('PRESENTACIONES');
                    presentaciones.push(presentacion);
                }
                
                return GestorOrdenes.storage.set('PRESENTACIONES', presentaciones);
            }
        }
    }
};