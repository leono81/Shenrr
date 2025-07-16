/**
 * Módulo de Agenda para gestión de capacidad concurrente
 * Implementa vista de calendario con indicadores de capacidad
 */

GestorOrdenes.agenda = {
    // Estado actual de la agenda
    currentDate: new Date(),
    currentView: 'daily', // 'daily' o 'weekly'
    
    // Configuración
    config: {
        startHour: 8,
        endHour: 20,
        maxCapacityRecommended: 4,
        warningCapacity: 3
    },

    // Inicializar módulo de agenda
    init: function() {
        console.log('Inicializando módulo de agenda...');
        
        this.bindEvents();
        this.loadCurrentView();
    },

    // Vincular eventos
    bindEvents: function() {
        // Cambio de vista
        document.querySelectorAll('input[name="vistaTipo"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentView = e.target.id === 'vistaDiaria' ? 'daily' : 'weekly';
                this.loadCurrentView();
            });
        });

        // Navegación de fechas
        document.getElementById('prevPeriod').addEventListener('click', () => {
            this.navigatePeriod(-1);
        });

        document.getElementById('nextPeriod').addEventListener('click', () => {
            this.navigatePeriod(1);
        });

        // Selector de fecha
        document.getElementById('dateSelector').addEventListener('change', (e) => {
            this.currentDate = new Date(e.target.value);
            this.loadCurrentView();
        });

        // Modal de horario
        document.getElementById('quickScheduleBtn').addEventListener('click', () => {
            this.handleQuickSchedule();
        });

        // Confirmar programación con advertencia
        document.getElementById('confirmScheduleBtn').addEventListener('click', () => {
            this.confirmScheduleWithWarning();
        });
    },

    // Navegar período
    navigatePeriod: function(direction) {
        if (this.currentView === 'daily') {
            this.currentDate.setDate(this.currentDate.getDate() + direction);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        }
        this.loadCurrentView();
    },

    // Cargar vista actual
    loadCurrentView: function() {
        this.updateNavigationLabels();
        this.updateDateSelector();
        
        if (this.currentView === 'daily') {
            this.renderDailyView();
        } else {
            this.renderWeeklyView();
        }
    },

    // Actualizar etiquetas de navegación
    updateNavigationLabels: function() {
        const labelElement = document.getElementById('currentPeriodLabel');
        const prevLabel = document.getElementById('prevLabel');
        const nextLabel = document.getElementById('nextLabel');
        
        if (this.currentView === 'daily') {
            labelElement.textContent = GestorOrdenes.utils.formatDate(this.currentDate);
            prevLabel.textContent = 'Día Anterior';
            nextLabel.textContent = 'Día Siguiente';
        } else {
            const startOfWeek = this.getStartOfWeek(this.currentDate);
            const endOfWeek = this.getEndOfWeek(this.currentDate);
            labelElement.textContent = `${GestorOrdenes.utils.formatDate(startOfWeek)} - ${GestorOrdenes.utils.formatDate(endOfWeek)}`;
            prevLabel.textContent = 'Semana Anterior';
            nextLabel.textContent = 'Semana Siguiente';
        }
    },

    // Actualizar selector de fecha
    updateDateSelector: function() {
        const dateSelector = document.getElementById('dateSelector');
        dateSelector.value = this.currentDate.toISOString().split('T')[0];
    },

    // Renderizar vista diaria
    renderDailyView: function() {
        const container = document.getElementById('agendaContainer');
        container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'agenda-grid daily';

        // Header vacío para la columna de tiempo
        const emptyHeader = document.createElement('div');
        emptyHeader.className = 'agenda-header time-header';
        grid.appendChild(emptyHeader);

        // Header del día
        const dayHeader = document.createElement('div');
        dayHeader.className = 'agenda-header';
        dayHeader.innerHTML = `
            <div>
                <div>${GestorOrdenes.utils.getDayName(this.currentDate)}</div>
                <div class="small">${GestorOrdenes.utils.formatDate(this.currentDate)}</div>
            </div>
        `;
        grid.appendChild(dayHeader);

        // Slots de tiempo
        for (let hour = this.config.startHour; hour < this.config.endHour; hour++) {
            // Columna de tiempo
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = `${hour.toString().padStart(2, '0')}:00`;
            grid.appendChild(timeSlot);

            // Celda de agenda
            const cell = this.createAgendaCell(this.currentDate, hour);
            grid.appendChild(cell);
        }

        container.appendChild(grid);
    },

    // Renderizar vista semanal
    renderWeeklyView: function() {
        const container = document.getElementById('agendaContainer');
        container.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'agenda-grid weekly';

        const startOfWeek = this.getStartOfWeek(this.currentDate);

        // Header vacío para la columna de tiempo
        const emptyHeader = document.createElement('div');
        emptyHeader.className = 'agenda-header time-header';
        grid.appendChild(emptyHeader);

        // Headers de días
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'agenda-header';
            dayHeader.innerHTML = `
                <div>${GestorOrdenes.utils.getDayName(date, true)}</div>
                <div class="small">${date.getDate()}</div>
            `;
            grid.appendChild(dayHeader);
        }

        // Slots de tiempo y celdas
        for (let hour = this.config.startHour; hour < this.config.endHour; hour++) {
            // Columna de tiempo
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = `${hour.toString().padStart(2, '0')}:00`;
            grid.appendChild(timeSlot);

            // Celdas para cada día
            for (let i = 0; i < 7; i++) {
                const date = new Date(startOfWeek);
                date.setDate(date.getDate() + i);
                
                const cell = this.createAgendaCell(date, hour);
                grid.appendChild(cell);
            }
        }

        container.appendChild(grid);
    },

    // Crear celda de agenda
    createAgendaCell: function(date, hour) {
        const cell = document.createElement('div');
        cell.className = 'agenda-cell';
        
        const capacity = this.getCapacityByTimeSlot(date, hour);
        cell.classList.add(`capacity-${capacity.level}`);
        
        // Marcar tiempo pasado o actual
        const now = new Date();
        const cellDateTime = new Date(date);
        cellDateTime.setHours(hour, 0, 0, 0);
        
        if (cellDateTime < now) {
            cell.classList.add('past-time');
        } else if (cellDateTime.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0).getTime()) {
            cell.classList.add('current-time');
        }

        // Contenido de la celda
        const content = document.createElement('div');
        content.className = 'agenda-cell-content';
        
        if (capacity.count > 0) {
            content.innerHTML = `
                <div class="capacity-count">
                    <span class="capacity-indicator capacity-${capacity.level}"></span>
                    ${capacity.count} paciente${capacity.count !== 1 ? 's' : ''}
                </div>
                <div class="patient-preview">
                    ${capacity.patients.slice(0, 2).map(p => p.nombre.split(' ')[0]).join(', ')}
                    ${capacity.count > 2 ? '...' : ''}
                </div>
            `;
        } else {
            content.innerHTML = `
                <div class="capacity-count text-muted">
                    <span class="capacity-indicator capacity-free"></span>
                    Libre
                </div>
            `;
        }

        cell.appendChild(content);

        // Eventos
        cell.addEventListener('click', () => {
            this.showTimeSlotDetails(date, hour, capacity);
        });

        cell.addEventListener('mouseenter', (e) => {
            if (capacity.count > 0) {
                this.showTooltip(e, capacity);
            }
        });

        cell.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });

        // Datos para identificación
        cell.dataset.date = date.toISOString().split('T')[0];
        cell.dataset.hour = hour;

        return cell;
    },

    // Obtener capacidad por slot de tiempo
    getCapacityByTimeSlot: function(date, hour) {
        try {
            const dateStr = date.toISOString().split('T')[0];
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            
            const sesiones = GestorOrdenes.storage.sesiones.getAll();
            const pacientes = GestorOrdenes.storage.pacientes.getAll();
            const practicas = GestorOrdenes.storage.practicas.getAll();
            
            // Filtrar sesiones para este horario
            const sesionesEnHorario = sesiones.filter(sesion => {
                if (!sesion.fecha_programada || !sesion.hora_programada) return false;
                
                const sesionHour = parseInt(sesion.hora_programada.split(':')[0]);
                return sesion.fecha_programada === dateStr && sesionHour === hour;
            });

            // Construir información de pacientes
            const patients = sesionesEnHorario.map(sesion => {
                const orden = GestorOrdenes.storage.ordenes.getById(sesion.orden_id);
                if (!orden) {
                    console.log('Orden no encontrada para sesión:', sesion.id, 'orden_id:', sesion.orden_id);
                    return null;
                }
                
                const paciente = pacientes.find(p => p.id === orden.paciente_id);
                const practica = practicas.find(p => p.id === orden.practica_id);
                
                if (!paciente) {
                    console.log('Paciente no encontrado para orden:', orden.id, 'paciente_id:', orden.paciente_id);
                }
                
                if (!practica) {
                    console.log('Práctica no encontrada para orden:', orden.id, 'practica_id:', orden.practica_id);
                }
                
                return {
                    id: paciente?.id || 0,
                    nombre: paciente?.nombreCompleto || 'Paciente Desconocido',
                    practica: practica?.nombrePractica || 'Práctica Desconocida',
                    estado: sesion.estado,
                    sesionId: sesion.id
                };
            }).filter(patient => patient !== null);

            // Determinar nivel de capacidad
            let level = 'free';
            if (patients.length >= 5) level = 'high';
            else if (patients.length >= 3) level = 'medium';
            else if (patients.length > 0) level = 'low';

            return {
                count: patients.length,
                patients: patients,
                level: level,
                date: dateStr,
                hour: hour,
                time: timeStr
            };
        } catch (error) {
            console.error('Error al calcular capacidad:', error);
            return { count: 0, patients: [], level: 'free', date: '', hour: 0, time: '' };
        }
    },

    // Mostrar tooltip
    showTooltip: function(event, capacity) {
        this.hideTooltip(); // Limpiar tooltip anterior
        
        const tooltip = document.createElement('div');
        tooltip.className = 'agenda-tooltip';
        tooltip.id = 'agendaTooltip';
        
        const patientsHtml = capacity.patients.map(patient => `
            <div class="tooltip-patient">
                <div class="tooltip-patient-name">${patient.nombre}</div>
                <div class="tooltip-patient-practice">${patient.practica}</div>
                <div class="tooltip-patient-status status-${patient.estado.toLowerCase()}">${patient.estado}</div>
            </div>
        `).join('');
        
        tooltip.innerHTML = `
            <div class="fw-bold mb-2">
                ${capacity.count} paciente${capacity.count !== 1 ? 's' : ''} programado${capacity.count !== 1 ? 's' : ''}
            </div>
            ${patientsHtml}
        `;
        
        document.body.appendChild(tooltip);
        
        // Posicionar tooltip
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        
        // Ajustar si se sale de la ventana
        if (tooltip.offsetLeft < 10) {
            tooltip.style.left = '10px';
        }
        if (tooltip.offsetLeft + tooltip.offsetWidth > window.innerWidth - 10) {
            tooltip.style.left = `${window.innerWidth - tooltip.offsetWidth - 10}px`;
        }
    },

    // Ocultar tooltip
    hideTooltip: function() {
        const tooltip = document.getElementById('agendaTooltip');
        if (tooltip) {
            tooltip.remove();
        }
    },

    // Mostrar detalles de slot de tiempo
    showTimeSlotDetails: function(date, hour, capacity) {
        const modal = new bootstrap.Modal(document.getElementById('timeSlotModal'));
        const modalTimeSlot = document.getElementById('modalTimeSlot');
        const modalContent = document.getElementById('modalContent');
        
        const dateStr = GestorOrdenes.utils.formatDate(date);
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        
        modalTimeSlot.textContent = `${dateStr} - ${timeStr}`;
        
        // Información de capacidad
        let capacityClass = 'info';
        let capacityIcon = 'info-circle';
        let capacityText = 'Normal';
        
        if (capacity.level === 'high') {
            capacityClass = 'danger';
            capacityIcon = 'exclamation-triangle';
            capacityText = 'Capacidad Alta';
        } else if (capacity.level === 'medium') {
            capacityClass = 'warning';
            capacityIcon = 'exclamation-triangle';
            capacityText = 'Capacidad Media';
        } else if (capacity.level === 'low') {
            capacityClass = 'success';
            capacityIcon = 'check-circle';
            capacityText = 'Capacidad Baja';
        }
        
        const patientsHtml = capacity.patients.length > 0 ? `
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Práctica</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${capacity.patients.map(patient => `
                            <tr>
                                <td>${patient.nombre}</td>
                                <td>${patient.practica}</td>
                                <td><span class="badge estado-${patient.estado.toLowerCase()}">${patient.estado}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        ` : '<p class="text-muted">No hay pacientes programados en este horario.</p>';
        
        modalContent.innerHTML = `
            <div class="capacity-info">
                <h6><i class="bi bi-${capacityIcon} text-${capacityClass}"></i> ${capacityText}</h6>
                <p class="mb-0">${capacity.count} paciente${capacity.count !== 1 ? 's' : ''} programado${capacity.count !== 1 ? 's' : ''}</p>
            </div>
            
            <h6>Pacientes Programados:</h6>
            ${patientsHtml}
            
            ${this.getAlternativeTimes(date, hour)}
        `;
        
        // Configurar datos para acciones rápidas
        document.getElementById('quickScheduleBtn').dataset.date = date.toISOString().split('T')[0];
        document.getElementById('quickScheduleBtn').dataset.hour = hour;
        document.getElementById('quickScheduleBtn').dataset.capacity = capacity.count;
        
        modal.show();
    },

    // Obtener horarios alternativos
    getAlternativeTimes: function(date, hour) {
        const alternatives = [];
        const dateStr = date.toISOString().split('T')[0];
        
        // Buscar horarios cercanos con menor capacidad
        for (let h = this.config.startHour; h < this.config.endHour; h++) {
            if (h === hour) continue;
            
            const capacity = this.getCapacityByTimeSlot(date, h);
            if (capacity.count < this.config.warningCapacity) {
                alternatives.push({
                    hour: h,
                    time: `${h.toString().padStart(2, '0')}:00`,
                    capacity: capacity.count,
                    level: capacity.level
                });
            }
        }
        
        // Ordenar por capacidad y proximidad al horario original
        alternatives.sort((a, b) => {
            const capacityDiff = a.capacity - b.capacity;
            if (capacityDiff !== 0) return capacityDiff;
            
            const timeDiff = Math.abs(a.hour - hour) - Math.abs(b.hour - hour);
            return timeDiff;
        });
        
        if (alternatives.length === 0) {
            return '';
        }
        
        const alternativesHtml = alternatives.slice(0, 6).map(alt => `
            <span class="time-suggestion" data-hour="${alt.hour}">
                <span class="capacity-indicator capacity-${alt.level}"></span>
                ${alt.time} (${alt.capacity})
            </span>
        `).join('');
        
        return `
            <div class="alternative-times">
                <h6><i class="bi bi-clock"></i> Horarios Alternativos Disponibles:</h6>
                <div>${alternativesHtml}</div>
                <small class="text-muted">Números entre paréntesis indican pacientes ya programados</small>
            </div>
        `;
    },

    // Manejar programación rápida
    handleQuickSchedule: function() {
        const btn = document.getElementById('quickScheduleBtn');
        const date = btn.dataset.date;
        const hour = parseInt(btn.dataset.hour);
        const currentCapacity = parseInt(btn.dataset.capacity);
        
        if (currentCapacity >= this.config.warningCapacity) {
            this.showCapacityWarning(date, hour, currentCapacity);
        } else {
            this.redirectToScheduleForm(date, hour);
        }
    },

    // Mostrar advertencia de capacidad
    showCapacityWarning: function(date, hour, currentCapacity) {
        const warningModal = new bootstrap.Modal(document.getElementById('capacityWarningModal'));
        const warningContent = document.getElementById('capacityWarningContent');
        
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const dateStr = GestorOrdenes.utils.formatDate(new Date(date));
        
        warningContent.innerHTML = `
            <div class="alert alert-warning">
                <h6><i class="bi bi-exclamation-triangle"></i> Alta Demanda Detectada</h6>
                <p>Ya tienes <strong>${currentCapacity} pacientes</strong> programados para el <strong>${dateStr} a las ${timeStr}</strong>.</p>
                <p>Se recomienda un máximo de ${this.config.maxCapacityRecommended} pacientes por horario para mantener la calidad de atención.</p>
            </div>
            
            ${this.getAlternativeTimes(new Date(date), hour)}
        `;
        
        // Configurar botón de confirmación
        document.getElementById('confirmScheduleBtn').dataset.date = date;
        document.getElementById('confirmScheduleBtn').dataset.hour = hour;
        
        // Cerrar modal anterior
        bootstrap.Modal.getInstance(document.getElementById('timeSlotModal')).hide();
        
        warningModal.show();
    },

    // Confirmar programación con advertencia
    confirmScheduleWithWarning: function() {
        const btn = document.getElementById('confirmScheduleBtn');
        const date = btn.dataset.date;
        const hour = parseInt(btn.dataset.hour);
        
        // Cerrar modal de advertencia
        bootstrap.Modal.getInstance(document.getElementById('capacityWarningModal')).hide();
        
        this.redirectToScheduleForm(date, hour);
    },

    // Redirigir a formulario de programación
    redirectToScheduleForm: function(date, hour) {
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        window.location.href = `ordenes.html?schedule_date=${date}&schedule_time=${timeStr}`;
    },

    // Utilidades de fecha
    getStartOfWeek: function(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
        start.setDate(diff);
        return start;
    },

    getEndOfWeek: function(date) {
        const end = this.getStartOfWeek(date);
        end.setDate(end.getDate() + 6);
        return end;
    }
};