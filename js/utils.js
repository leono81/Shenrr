/**
 * Utilidades comunes para el POC
 * Funciones auxiliares y helpers
 */

// Extender el namespace GestorOrdenes
GestorOrdenes.utils = {
    // Formateo de fechas
    formatDate: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    },

    // Formateo de fecha para inputs
    formatDateForInput: function(date) {
        if (!date) return '';
        
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return `${year}-${month}-${day}`;
    },

    // Obtener fecha actual en formato ISO
    getCurrentDate: function() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    },

    // Obtener fecha y hora actual
    getCurrentDateTime: function() {
        return new Date().toISOString();
    },

    // Formateo de moneda
    formatCurrency: function(amount) {
        if (typeof amount !== 'number') return '$0,00';
        
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(amount);
    },

    // Formateo de número
    formatNumber: function(number) {
        if (typeof number !== 'number') return '0';
        
        return new Intl.NumberFormat('es-AR').format(number);
    },

    // Validación de DNI
    validateDni: function(dni) {
        if (!dni) return false;
        
        // Remover espacios y puntos
        const cleanDni = dni.replace(/[\s.]/g, '');
        
        // Verificar que sea solo números y tenga 7-8 dígitos
        return /^\d{7,8}$/.test(cleanDni);
    },

    // Validación de email
    validateEmail: function(email) {
        if (!email) return false;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validación de CUIT
    validateCuit: function(cuit) {
        if (!cuit) return false;
        
        // Remover guiones y espacios
        const cleanCuit = cuit.replace(/[-\s]/g, '');
        
        // Verificar que tenga 11 dígitos
        return /^\d{11}$/.test(cleanCuit);
    },

    // Capitalizar primera letra
    capitalize: function(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Capitalizar cada palabra
    capitalizeWords: function(str) {
        if (!str) return '';
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },

    // === NUEVAS FUNCIONES PARA PROGRAMACIÓN AUTOMÁTICA ===
    
    // Calcular días hábiles (Lun-Vie)
    calculateBusinessDays: function(startDate, sessions) {
        const dates = [];
        const start = new Date(startDate);
        let currentDate = new Date(start);
        
        while (dates.length < sessions) {
            // Obtener día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)
            const dayOfWeek = currentDate.getDay();
            
            // Si es día hábil (Lunes a Viernes)
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                dates.push(new Date(currentDate));
            }
            
            // Avanzar al siguiente día
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    },
    
    // Calcular programación LMV (Lunes, Miércoles, Viernes)
    calculateMWFSchedule: function(startDate, sessions) {
        const dates = [];
        const start = new Date(startDate);
        let currentDate = new Date(start);
        
        while (dates.length < sessions) {
            const dayOfWeek = currentDate.getDay();
            
            // Si es Lunes (1), Miércoles (3) o Viernes (5)
            if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
                dates.push(new Date(currentDate));
            }
            
            // Avanzar al siguiente día
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    },
    
    // Calcular programación MTJ (Martes, Jueves)
    calculateTTSchedule: function(startDate, sessions) {
        const dates = [];
        const start = new Date(startDate);
        let currentDate = new Date(start);
        
        while (dates.length < sessions) {
            const dayOfWeek = currentDate.getDay();
            
            // Si es Martes (2) o Jueves (4)
            if (dayOfWeek === 2 || dayOfWeek === 4) {
                dates.push(new Date(currentDate));
            }
            
            // Avanzar al siguiente día
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    },
    
    // Validar conflictos de tiempo entre sesiones
    validateTimeConflicts: function(newSessions, existingSessions) {
        const conflicts = [];
        
        newSessions.forEach(newSession => {
            const conflictingSessions = existingSessions.filter(existing => {
                // Comparar misma fecha y hora
                return existing.fecha_programada === newSession.fecha_programada && 
                       existing.hora_programada === newSession.hora_programada &&
                       existing.id !== newSession.id; // No comparar consigo mismo
            });
            
            if (conflictingSessions.length > 0) {
                conflicts.push({
                    newSession: newSession,
                    conflicts: conflictingSessions
                });
            }
        });
        
        return conflicts;
    },
    
    // Formatear fecha para almacenamiento (YYYY-MM-DD)
    formatDateForStorage: function(date) {
        if (!date) return null;
        
        const d = date instanceof Date ? date : new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    },

    // Generar ID único
    generateId: function() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    // Obtener icono y clase CSS por práctica médica
    getPracticeIcon: function(practiceId) {
        // Validar que practiceId no sea undefined o null
        if (!practiceId) {
            return { icon: 'bi-clipboard-heart', class: 'practica-default' };
        }

        const practica = GestorOrdenes.storage.practicas.getById(practiceId);
        if (!practica || !practica.nombrePractica || typeof practica.nombrePractica !== 'string') {
            return { icon: 'bi-clipboard-heart', class: 'practica-default' };
        }
        
        const nombreLower = practica.nombrePractica.toLowerCase();
        
        if (nombreLower.includes('kinesiologia')) {
            return { icon: 'bi-heart-pulse', class: 'practica-kinesiologia' };
        } else if (nombreLower.includes('osteopatia')) {
            return { icon: 'bi-diagram-2', class: 'practica-osteopatia' };
        } else if (nombreLower.includes('rehabilitacion')) {
            return { icon: 'bi-arrow-repeat', class: 'practica-rehabilitacion' };
        } else if (nombreLower.includes('fisioterapia')) {
            return { icon: 'bi-person-arms-up', class: 'practica-fisioterapia' };
        } else if (nombreLower.includes('reeducacion')) {
            return { icon: 'bi-arrow-up-right-circle', class: 'practica-reeducacion' };
        } else {
            return { icon: 'bi-clipboard-heart', class: 'practica-default' };
        }
    },

    // Debounce para búsquedas
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Mostrar notificación
    showNotification: function(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Buscar container para notificaciones
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1050;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        
        container.appendChild(alertDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    },

    // Mostrar modal de confirmación
    showConfirmation: function(message, callback) {
        const confirmed = confirm(message);
        if (confirmed && callback) {
            callback();
        }
        return confirmed;
    },

    // Limpiar formulario
    clearForm: function(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            
            // Limpiar select2 si está presente
            const selects = form.querySelectorAll('select');
            selects.forEach(select => {
                select.selectedIndex = 0;
            });
        }
    },

    // Validar formulario
    validateForm: function(formId, rules) {
        const form = document.getElementById(formId);
        if (!form) return false;
        
        let isValid = true;
        const errors = [];
        
        Object.keys(rules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const rule = rules[fieldName];
            
            if (!field) return;
            
            // Limpiar errores previos
            field.classList.remove('is-invalid');
            
            // Validar campo requerido
            if (rule.required && !field.value.trim()) {
                field.classList.add('is-invalid');
                errors.push(`${rule.label || fieldName} es requerido`);
                isValid = false;
            }
            
            // Validar tipo de campo
            if (field.value.trim() && rule.type) {
                let validType = true;
                
                switch (rule.type) {
                    case 'email':
                        validType = this.validateEmail(field.value);
                        break;
                    case 'dni':
                        validType = this.validateDni(field.value);
                        break;
                    case 'cuit':
                        validType = this.validateCuit(field.value);
                        break;
                    case 'number':
                        validType = !isNaN(field.value) && field.value > 0;
                        break;
                    case 'date':
                        validType = !isNaN(Date.parse(field.value));
                        break;
                }
                
                if (!validType) {
                    field.classList.add('is-invalid');
                    errors.push(`${rule.label || fieldName} no es válido`);
                    isValid = false;
                }
            }
        });
        
        // Mostrar errores
        if (errors.length > 0) {
            this.showNotification(errors.join('<br>'), 'danger');
        }
        
        return isValid;
    },

    // Obtener progreso de sesiones
    getSessionProgress: function(ordenId) {
        const sesiones = GestorOrdenes.storage.sesiones.getByOrden(ordenId);
        const realizadas = sesiones.filter(s => s.estado === 'Realizada').length;
        const total = sesiones.length;
        
        return {
            realizadas: realizadas,
            total: total,
            pendientes: total - realizadas,
            porcentaje: total > 0 ? Math.round((realizadas / total) * 100) : 0
        };
    },

    // Obtener estadísticas generales
    getGeneralStats: function() {
        const ordenes = GestorOrdenes.storage.ordenes.getAll();
        const sesiones = GestorOrdenes.storage.sesiones.getAll();
        
        return {
            ordenesActivas: ordenes.filter(o => o.estado === 'Abierta').length,
            sesionesRealizadas: sesiones.filter(s => s.estado === 'Realizada').length,
            sesionesPendientes: sesiones.filter(s => s.estado === 'Pendiente').length
        };
    },

    // Obtener estadísticas del día actual
    getTodayStats: function() {
        const today = new Date();
        const fechaHoy = this.formatDateForStorage(today);
        
        const sesionesHoy = GestorOrdenes.storage.sesiones.getAll()
            .filter(sesion => {
                return sesion.fecha_programada === fechaHoy && 
                       sesion.profesional_id === 1; // POC: usuario fijo
            });

        const programadas = sesionesHoy.length;
        const completadas = sesionesHoy.filter(s => s.estado === 'Realizada').length;
        const porcentaje = programadas > 0 ? Math.round((completadas / programadas) * 100) : 0;

        // Buscar próxima cita pendiente
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const proximasCitas = sesionesHoy
            .filter(sesion => sesion.estado === 'Pendiente')
            .map(sesion => {
                const [horaStr, minutoStr] = sesion.hora_programada.split(':');
                const appointmentTime = parseInt(horaStr) * 60 + parseInt(minutoStr);
                return {
                    sesion,
                    appointmentTime,
                    isNext: appointmentTime > currentTime
                };
            })
            .filter(item => item.isNext)
            .sort((a, b) => a.appointmentTime - b.appointmentTime);

        let proximaCita = { hora: null, paciente: null };
        if (proximasCitas.length > 0) {
            const nextSession = proximasCitas[0].sesion;
            const orden = GestorOrdenes.storage.ordenes.getById(nextSession.orden_id);
            const paciente = GestorOrdenes.storage.pacientes.getById(orden.paciente_id);
            
            proximaCita = {
                hora: nextSession.hora_programada,
                paciente: paciente.nombreCompleto
            };
        }

        return {
            programadas,
            completadas,
            porcentaje,
            proximaCita
        };
    },

    // Validar timing de cita
    validateAppointmentTiming: function(cita, horaActual) {
        if (!cita || !cita.hora_programada) {
            return {
                status: 'noAppointment',
                difference: 0,
                message: '📅 No tiene cita programada para hoy'
            };
        }

        const now = horaActual || new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [horaStr, minutoStr] = cita.hora_programada.split(':');
        const appointmentTime = parseInt(horaStr) * 60 + parseInt(minutoStr);
        const difference = currentTime - appointmentTime;
        
        // Ventana de tolerancia: ±30 minutos
        if (Math.abs(difference) <= 30) {
            return {
                status: 'onTime',
                difference: difference,
                message: `✅ Cita programada para las ${cita.hora_programada}`
            };
        } else if (difference < -30) {
            return {
                status: 'early',
                difference: difference,
                message: `⏰ Llegó temprano - Cita programada para las ${cita.hora_programada}`
            };
        } else {
            return {
                status: 'late',
                difference: difference,
                message: `⏰ Llegó tarde - Cita programada para las ${cita.hora_programada}`
            };
        }
    },

    // Filtrar órdenes por criterios
    filterOrders: function(orders, criteria) {
        return orders.filter(order => {
            // Filtrar por estado
            if (criteria.estado && order.estado !== criteria.estado) {
                return false;
            }
            
            // Filtrar por paciente
            if (criteria.paciente) {
                const paciente = GestorOrdenes.storage.pacientes.getById(order.paciente_id);
                if (!paciente || !paciente.nombreCompleto.toLowerCase().includes(criteria.paciente.toLowerCase())) {
                    return false;
                }
            }
            
            // Filtrar por obra social
            if (criteria.obraSocial && order.obraSocial_id !== criteria.obraSocial) {
                return false;
            }
            
            // Filtrar por práctica
            if (criteria.practica && order.practica_id !== criteria.practica) {
                return false;
            }
            
            // Filtrar por fecha
            if (criteria.fechaDesde) {
                const fechaOrden = new Date(order.fechaEmision);
                const fechaDesde = new Date(criteria.fechaDesde);
                if (fechaOrden < fechaDesde) {
                    return false;
                }
            }
            
            if (criteria.fechaHasta) {
                const fechaOrden = new Date(order.fechaEmision);
                const fechaHasta = new Date(criteria.fechaHasta);
                if (fechaOrden > fechaHasta) {
                    return false;
                }
            }
            
            return true;
        });
    },

    // Exportar datos a CSV
    exportToCSV: function(data, filename) {
        const csvContent = "data:text/csv;charset=utf-8," 
            + data.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Logging para debugging
    log: function(message, data = null) {
        if (console && console.log) {
            console.log(`[GestorOrdenes] ${message}`, data);
        }
    },

    // Manejo de errores
    handleError: function(error, userMessage = 'Ha ocurrido un error') {
        console.error('Error:', error);
        this.showNotification(userMessage, 'danger');
    },

    // Validar período de fecha
    validatePeriod: function(year, month) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        if (year < 2024 || year > currentYear + 1) {
            return false;
        }
        
        if (month < 1 || month > 12) {
            return false;
        }
        
        return true;
    },

    // Obtener nombre del mes
    getMonthName: function(month) {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[month - 1] || '';
    },

    // Verificar si una fecha está en un período específico
    isDateInPeriod: function(date, year, month) {
        const d = new Date(date);
        return d.getFullYear() === year && (d.getMonth() + 1) === month;
    },

    // Obtener nombre del día de la semana
    getDayName: function(date) {
        const days = [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 
            'Jueves', 'Viernes', 'Sábado'
        ];
        const d = date instanceof Date ? date : new Date(date);
        return days[d.getDay()];
    },

    // Obtener nombre del día abreviado
    getDayNameShort: function(date) {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const d = date instanceof Date ? date : new Date(date);
        return days[d.getDay()];
    },

    // Formatear hora para mostrar (HH:MM)
    formatTime: function(time) {
        if (!time) return '--:--';
        return time;
    },

    // Obtener color por capacidad de citas
    getCapacityColor: function(count) {
        if (count === 0) return 'secondary';
        if (count <= 2) return 'success';
        if (count <= 4) return 'warning';
        return 'danger';
    }
};