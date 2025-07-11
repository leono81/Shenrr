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
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    // Generar ID único
    generateId: function() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
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
    }
};