/**
 * Datos de prueba para el POC
 * Incluye datos maestros y ejemplos para testing
 */

// Extender el namespace GestorOrdenes
GestorOrdenes.data = {
    // Datos maestros iniciales
    obrasSociales: [
        {
            id: 1,
            nombre: 'Swiss Medical',
            cuit: '30-52141240-6',
            incluir_en_presentacion: true,
            limite_sesiones_mensual_paciente: 12
        },
        {
            id: 2,
            nombre: 'Galeno',
            cuit: '30-68469560-7',
            incluir_en_presentacion: true,
            limite_sesiones_mensual_paciente: 10
        },
        {
            id: 3,
            nombre: 'Medife',
            cuit: '30-54624291-3',
            incluir_en_presentacion: true,
            limite_sesiones_mensual_paciente: 8
        },
        {
            id: 4,
            nombre: 'Sancor Seguros',
            cuit: '30-54625421-4',
            incluir_en_presentacion: true,
            limite_sesiones_mensual_paciente: null // Sin límite
        },
        {
            id: 5,
            nombre: 'Particular',
            cuit: '',
            incluir_en_presentacion: false,
            limite_sesiones_mensual_paciente: null
        }
    ],

    practicas: [
        {
            id: 1,
            nombrePractica: 'Sesión Kinesiología Motora',
            codigoInterno: 'KIN-MOT-001'
        },
        {
            id: 2,
            nombrePractica: 'Sesión Kinesiología Respiratoria',
            codigoInterno: 'KIN-RESP-001'
        },
        {
            id: 3,
            nombrePractica: 'Sesión Osteopatía',
            codigoInterno: 'OST-001'
        },
        {
            id: 4,
            nombrePractica: 'Sesión Rehabilitación Deportiva',
            codigoInterno: 'REH-DEP-001'
        },
        {
            id: 5,
            nombrePractica: 'Sesión Reeducación Postural',
            codigoInterno: 'REE-POST-001'
        },
        {
            id: 6,
            nombrePractica: 'Sesión Fisioterapia',
            codigoInterno: 'FISIO-001'
        }
    ],

    medicosDerivantes: [
        {
            id: 1,
            nombreCompleto: 'Dr. Juan Carlos Pérez',
            matricula: 'MN-12345'
        },
        {
            id: 2,
            nombreCompleto: 'Dra. María Elena González',
            matricula: 'MN-67890'
        },
        {
            id: 3,
            nombreCompleto: 'Dr. Roberto Silva',
            matricula: 'MN-11223'
        },
        {
            id: 4,
            nombreCompleto: 'Dra. Ana Martínez',
            matricula: 'MN-44556'
        },
        {
            id: 5,
            nombreCompleto: 'Dr. Carlos López',
            matricula: 'MN-77889'
        }
    ],

    pacientes: [
        {
            id: 1,
            nombreCompleto: 'María José Rodríguez',
            dni: '12345678',
            obraSocial_id: 1,
            numeroAfiliado: 'SM-123456'
        },
        {
            id: 2,
            nombreCompleto: 'Carlos Alberto Fernández',
            dni: '23456789',
            obraSocial_id: 2,
            numeroAfiliado: 'GAL-234567'
        },
        {
            id: 3,
            nombreCompleto: 'Ana Sofía Martínez',
            dni: '34567890',
            obraSocial_id: 3,
            numeroAfiliado: 'MED-345678'
        },
        {
            id: 4,
            nombreCompleto: 'Pedro Luis García',
            dni: '45678901',
            obraSocial_id: 1,
            numeroAfiliado: 'SM-456789'
        },
        {
            id: 5,
            nombreCompleto: 'Laura Beatriz Sánchez',
            dni: '56789012',
            obraSocial_id: 4,
            numeroAfiliado: 'SAN-567890'
        },
        {
            id: 6,
            nombreCompleto: 'Roberto Carlos Díaz',
            dni: '67890123',
            obraSocial_id: 1,
            numeroAfiliado: 'SM-678901'
        },
        {
            id: 7,
            nombreCompleto: 'Silvia Elena Torres',
            dni: '78901234',
            obraSocial_id: 2,
            numeroAfiliado: 'GAL-789012'
        },
        {
            id: 8,
            nombreCompleto: 'Miguel Ángel Herrera',
            dni: '89012345',
            obraSocial_id: 3,
            numeroAfiliado: 'MED-890123'
        },
        {
            id: 9,
            nombreCompleto: 'Patricia Mónica Vega',
            dni: '90123456',
            obraSocial_id: 1,
            numeroAfiliado: 'SM-901234'
        },
        {
            id: 10,
            nombreCompleto: 'Alejandro Fabián Morales',
            dni: '01234567',
            obraSocial_id: 5,
            numeroAfiliado: 'PART-012345'
        },
        {
            id: 11,
            nombreCompleto: 'Carmen Rosa Jiménez',
            dni: '11223344',
            obraSocial_id: 2,
            numeroAfiliado: 'GAL-112233'
        },
        {
            id: 12,
            nombreCompleto: 'Fernando José Castro',
            dni: '22334455',
            obraSocial_id: 3,
            numeroAfiliado: 'MED-223344'
        },
        {
            id: 13,
            nombreCompleto: 'Gabriela Beatriz Romero',
            dni: '33445566',
            obraSocial_id: 1,
            numeroAfiliado: 'SM-334455'
        },
        {
            id: 14,
            nombreCompleto: 'Horacio Daniel Mendez',
            dni: '44556677',
            obraSocial_id: 4,
            numeroAfiliado: 'SAN-445566'
        },
        {
            id: 15,
            nombreCompleto: 'Isabel María Vargas',
            dni: '55667788',
            obraSocial_id: 2,
            numeroAfiliado: 'GAL-556677'
        }
    ],

    aranceles: [
        // Swiss Medical
        {
            id: 1,
            practica_id: 1,
            obraSocial_id: 1,
            importe: 4500,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 2,
            practica_id: 2,
            obraSocial_id: 1,
            importe: 5000,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 3,
            practica_id: 3,
            obraSocial_id: 1,
            importe: 6000,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 4,
            practica_id: 4,
            obraSocial_id: 1,
            importe: 5500,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 5,
            practica_id: 5,
            obraSocial_id: 1,
            importe: 4800,
            fecha_vigencia: '2024-01-01'
        },
        // Galeno
        {
            id: 6,
            practica_id: 1,
            obraSocial_id: 2,
            importe: 4200,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 7,
            practica_id: 2,
            obraSocial_id: 2,
            importe: 4700,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 8,
            practica_id: 3,
            obraSocial_id: 2,
            importe: 5800,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 9,
            practica_id: 4,
            obraSocial_id: 2,
            importe: 5300,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 10,
            practica_id: 5,
            obraSocial_id: 2,
            importe: 4600,
            fecha_vigencia: '2024-01-01'
        },
        // Medife
        {
            id: 11,
            practica_id: 1,
            obraSocial_id: 3,
            importe: 4000,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 12,
            practica_id: 2,
            obraSocial_id: 3,
            importe: 4500,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 13,
            practica_id: 3,
            obraSocial_id: 3,
            importe: 5500,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 14,
            practica_id: 4,
            obraSocial_id: 3,
            importe: 5000,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 15,
            practica_id: 5,
            obraSocial_id: 3,
            importe: 4300,
            fecha_vigencia: '2024-01-01'
        },
        // Sancor Seguros
        {
            id: 16,
            practica_id: 1,
            obraSocial_id: 4,
            importe: 4800,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 17,
            practica_id: 2,
            obraSocial_id: 4,
            importe: 5200,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 18,
            practica_id: 3,
            obraSocial_id: 4,
            importe: 6200,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 19,
            practica_id: 4,
            obraSocial_id: 4,
            importe: 5700,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 20,
            practica_id: 5,
            obraSocial_id: 4,
            importe: 5000,
            fecha_vigencia: '2024-01-01'
        },
        // Fisioterapia
        {
            id: 21,
            practica_id: 6,
            obraSocial_id: 1,
            importe: 5200,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 22,
            practica_id: 6,
            obraSocial_id: 2,
            importe: 4800,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 23,
            practica_id: 6,
            obraSocial_id: 3,
            importe: 4500,
            fecha_vigencia: '2024-01-01'
        },
        {
            id: 24,
            practica_id: 6,
            obraSocial_id: 4,
            importe: 5100,
            fecha_vigencia: '2024-01-01'
        }
    ],

    // Notificaciones para el sistema de alertas (HU-1.2)
    notificaciones: [
        // Ejemplos para testing del sistema de notificaciones
        {
            id: 1,
            tipo: 'orden_sin_programar',
            mensaje: 'La orden #4 no tiene sesiones programadas',
            orden_id: 4,
            fecha_creacion: '2025-07-16T10:00:00.000Z',
            leida: false,
            accion_url: 'pages/ordenes.html?orden=4'
        },
        {
            id: 2,
            tipo: 'conflicto_horario',
            mensaje: 'Conflicto de horario detectado el 2025-07-18 a las 14:00',
            orden_id: null,
            fecha_creacion: '2025-07-16T11:30:00.000Z',
            leida: false,
            accion_url: 'pages/agenda.html?fecha=2025-07-18'
        }
    ],

    // Datos de ejemplo para testing
    ejemplos: {
        ordenes: [
            {
                id: 1,
                profesional_id: 1,
                paciente_id: 1,
                obraSocial_id: 1,
                medicoDerivante_id: 1,
                practica_id: 1,
                fechaEmision: '2025-06-15',
                cantidadSesionesTotal: 10,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'habiles',
                hora_sesiones: '14:00',
                fecha_primera_sesion: '2025-06-16'
            },
            {
                id: 2,
                profesional_id: 1,
                paciente_id: 2,
                obraSocial_id: 2,
                medicoDerivante_id: 2,
                practica_id: 2,
                fechaEmision: '2025-06-20',
                cantidadSesionesTotal: 8,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'lmv',
                hora_sesiones: '10:00',
                fecha_primera_sesion: '2025-06-21'
            },
            {
                id: 3,
                profesional_id: 1,
                paciente_id: 3,
                obraSocial_id: 3,
                medicoDerivante_id: 3,
                practica_id: 3,
                fechaEmision: '2025-06-01',
                cantidadSesionesTotal: 10,
                estado: 'Cerrada Normal',
                fechaCierre: '2025-06-30',
                // Campos extendidos para programación
                programacion_tipo: 'mtj',
                hora_sesiones: '16:00',
                fecha_primera_sesion: '2025-06-02'
            },
            // Órdenes con fechas actuales para mostrar el dashboard
            {
                id: 4,
                profesional_id: 1,
                paciente_id: 4,
                obraSocial_id: 1,
                medicoDerivante_id: 1,
                practica_id: 1,
                fechaEmision: '2025-07-10',
                cantidadSesionesTotal: 12,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'habiles',
                hora_sesiones: '09:00',
                fecha_primera_sesion: '2025-07-15'
            },
            {
                id: 5,
                profesional_id: 1,
                paciente_id: 6,
                obraSocial_id: 1,
                medicoDerivante_id: 2,
                practica_id: 2,
                fechaEmision: '2025-07-12',
                cantidadSesionesTotal: 8,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'lmv',
                hora_sesiones: '11:00',
                fecha_primera_sesion: '2025-07-15'
            },
            {
                id: 6,
                profesional_id: 1,
                paciente_id: 7,
                obraSocial_id: 2,
                medicoDerivante_id: 3,
                practica_id: 6,
                fechaEmision: '2025-07-14',
                cantidadSesionesTotal: 10,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'mtj',
                hora_sesiones: '15:00',
                fecha_primera_sesion: '2025-07-16'
            },
            {
                id: 7,
                profesional_id: 1,
                paciente_id: 8,
                obraSocial_id: 3,
                medicoDerivante_id: 4,
                practica_id: 3,
                fechaEmision: '2025-07-16',
                cantidadSesionesTotal: 6,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'habiles',
                hora_sesiones: '14:00',
                fecha_primera_sesion: '2025-07-16'
            },
            {
                id: 8,
                profesional_id: 1,
                paciente_id: 9,
                obraSocial_id: 1,
                medicoDerivante_id: 5,
                practica_id: 5,
                fechaEmision: '2025-07-15',
                cantidadSesionesTotal: 8,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'lmv',
                hora_sesiones: '16:30',
                fecha_primera_sesion: '2025-07-17'
            },
            {
                id: 9,
                profesional_id: 1,
                paciente_id: 10,
                obraSocial_id: 5,
                medicoDerivante_id: 1,
                practica_id: 1,
                fechaEmision: '2025-07-16',
                cantidadSesionesTotal: 10,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación
                programacion_tipo: 'personalizada',
                hora_sesiones: '10:30',
                fecha_primera_sesion: '2025-07-17'
            },
            // Órdenes adicionales para crear conflictos de horario
            {
                id: 10,
                profesional_id: 1,
                paciente_id: 11,
                obraSocial_id: 2,
                medicoDerivante_id: 2,
                practica_id: 2,
                fechaEmision: '2025-07-16',
                cantidadSesionesTotal: 6,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación - MISMO HORARIO que orden 5
                programacion_tipo: 'habiles',
                hora_sesiones: '11:00',
                fecha_primera_sesion: '2025-07-16'
            },
            {
                id: 11,
                profesional_id: 1,
                paciente_id: 12,
                obraSocial_id: 3,
                medicoDerivante_id: 3,
                practica_id: 4,
                fechaEmision: '2025-07-15',
                cantidadSesionesTotal: 8,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación - MISMO HORARIO que orden 6
                programacion_tipo: 'mtj',
                hora_sesiones: '15:00',
                fecha_primera_sesion: '2025-07-16'
            },
            {
                id: 12,
                profesional_id: 1,
                paciente_id: 13,
                obraSocial_id: 1,
                medicoDerivante_id: 4,
                practica_id: 3,
                fechaEmision: '2025-07-16',
                cantidadSesionesTotal: 5,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación - MISMO HORARIO que otras (15:00)
                programacion_tipo: 'habiles',
                hora_sesiones: '15:00',
                fecha_primera_sesion: '2025-07-16'
            },
            {
                id: 13,
                profesional_id: 1,
                paciente_id: 14,
                obraSocial_id: 4,
                medicoDerivante_id: 5,
                practica_id: 1,
                fechaEmision: '2025-07-16',
                cantidadSesionesTotal: 7,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación - HORARIO SATURADO (09:00)
                programacion_tipo: 'lmv',
                hora_sesiones: '09:00',
                fecha_primera_sesion: '2025-07-17'
            },
            {
                id: 14,
                profesional_id: 1,
                paciente_id: 15,
                obraSocial_id: 2,
                medicoDerivante_id: 1,
                practica_id: 5,
                fechaEmision: '2025-07-16',
                cantidadSesionesTotal: 6,
                estado: 'Abierta',
                fechaCierre: null,
                // Campos extendidos para programación - CREAR SATURACIÓN EN 11:00
                programacion_tipo: 'habiles',
                hora_sesiones: '11:00',
                fecha_primera_sesion: '2025-07-16'
            }
        ],

        sesiones: [
            // Sesiones para orden 1 (María José Rodríguez)
            {
                id: 1,
                orden_id: 1,
                numeroSesion: 1,
                fechaPrestacion: '2025-06-16',
                estado: 'Realizada',
                // Campos extendidos para programación
                fecha_programada: '2025-06-16',
                hora_programada: '14:00',
                fecha_real: '2025-06-16',
                hora_real: '14:00',
                tipo_atencion: 'programada'
            },
            {
                id: 2,
                orden_id: 1,
                numeroSesion: 2,
                fechaPrestacion: '2025-06-18',
                estado: 'Realizada',
                // Campos extendidos para programación
                fecha_programada: '2025-06-17',
                hora_programada: '14:00',
                fecha_real: '2025-06-18',
                hora_real: '14:00',
                tipo_atencion: 'programada'
            },
            {
                id: 3,
                orden_id: 1,
                numeroSesion: 3,
                fechaPrestacion: '2025-06-20',
                estado: 'Realizada',
                // Campos extendidos para programación
                fecha_programada: '2025-06-18',
                hora_programada: '14:00',
                fecha_real: '2025-06-20',
                hora_real: '14:00',
                tipo_atencion: 'programada'
            },
            {
                id: 4,
                orden_id: 1,
                numeroSesion: 4,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: '2025-06-19',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 5,
                orden_id: 1,
                numeroSesion: 5,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: '2025-06-20',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 6,
                orden_id: 1,
                numeroSesion: 6,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: '2025-06-23',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 7,
                orden_id: 1,
                numeroSesion: 7,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: '2025-06-24',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 8,
                orden_id: 1,
                numeroSesion: 8,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: '2025-06-25',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 9,
                orden_id: 1,
                numeroSesion: 9,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: '2025-06-26',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 10,
                orden_id: 1,
                numeroSesion: 10,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación
                fecha_programada: '2025-06-27',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            // Sesiones para orden 2 (Carlos Alberto Fernández)
            {
                id: 11,
                orden_id: 2,
                numeroSesion: 1,
                fechaPrestacion: '2025-06-21',
                estado: 'Realizada',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-06-21',
                hora_programada: '10:00',
                fecha_real: '2025-06-21',
                hora_real: '10:00',
                tipo_atencion: 'programada'
            },
            {
                id: 12,
                orden_id: 2,
                numeroSesion: 2,
                fechaPrestacion: '2025-06-23',
                estado: 'Realizada',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-06-23',
                hora_programada: '10:00',
                fecha_real: '2025-06-23',
                hora_real: '10:00',
                tipo_atencion: 'programada'
            },
            {
                id: 13,
                orden_id: 2,
                numeroSesion: 3,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-06-25',
                hora_programada: '10:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 14,
                orden_id: 2,
                numeroSesion: 4,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-06-27',
                hora_programada: '10:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 15,
                orden_id: 2,
                numeroSesion: 5,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-06-30',
                hora_programada: '10:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 16,
                orden_id: 2,
                numeroSesion: 6,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-07-02',
                hora_programada: '10:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 17,
                orden_id: 2,
                numeroSesion: 7,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-07-04',
                hora_programada: '10:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 18,
                orden_id: 2,
                numeroSesion: 8,
                fechaPrestacion: null,
                estado: 'Pendiente',
                // Campos extendidos para programación (LMV - Lunes, Miércoles, Viernes)
                fecha_programada: '2025-07-07',
                hora_programada: '10:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            // Sesiones para orden 3 (Ana Sofía Martínez) - 10 sesiones realizadas
            {
                id: 19,
                orden_id: 3,
                numeroSesion: 1,
                fechaPrestacion: '2025-06-02',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-02',
                hora_programada: '16:00',
                fecha_real: '2025-06-02',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 20,
                orden_id: 3,
                numeroSesion: 2,
                fechaPrestacion: '2025-06-04',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-04',
                hora_programada: '16:00',
                fecha_real: '2025-06-04',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 21,
                orden_id: 3,
                numeroSesion: 3,
                fechaPrestacion: '2025-06-06',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-06',
                hora_programada: '16:00',
                fecha_real: '2025-06-06',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 22,
                orden_id: 3,
                numeroSesion: 4,
                fechaPrestacion: '2025-06-09',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-09',
                hora_programada: '16:00',
                fecha_real: '2025-06-09',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 23,
                orden_id: 3,
                numeroSesion: 5,
                fechaPrestacion: '2025-06-11',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-11',
                hora_programada: '16:00',
                fecha_real: '2025-06-11',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 24,
                orden_id: 3,
                numeroSesion: 6,
                fechaPrestacion: '2025-06-13',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-13',
                hora_programada: '16:00',
                fecha_real: '2025-06-13',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 25,
                orden_id: 3,
                numeroSesion: 7,
                fechaPrestacion: '2025-06-16',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-16',
                hora_programada: '16:00',
                fecha_real: '2025-06-16',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 26,
                orden_id: 3,
                numeroSesion: 8,
                fechaPrestacion: '2025-06-18',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-18',
                hora_programada: '16:00',
                fecha_real: '2025-06-18',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 27,
                orden_id: 3,
                numeroSesion: 9,
                fechaPrestacion: '2025-06-20',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-20',
                hora_programada: '16:00',
                fecha_real: '2025-06-20',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 28,
                orden_id: 3,
                numeroSesion: 10,
                fechaPrestacion: '2025-06-23',
                estado: 'Realizada',
                // Campos extendidos para programación (MTJ - Martes, Jueves)
                fecha_programada: '2025-06-23',
                hora_programada: '16:00',
                fecha_real: '2025-06-23',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            
            // *** SESIONES PARA ÓRDENES ACTUALES - JULIO 2025 ***
            
            // Sesiones para orden 4 (Pedro Luis García) - Habiles 09:00
            {
                id: 29,
                orden_id: 4,
                numeroSesion: 1,
                fechaPrestacion: '2025-07-15',
                estado: 'Realizada',
                profesional_id: 1,
                fecha_programada: '2025-07-15',
                hora_programada: '09:00',
                fecha_real: '2025-07-15',
                hora_real: '09:00',
                tipo_atencion: 'programada'
            },
            {
                id: 30,
                orden_id: 4,
                numeroSesion: 2,
                fechaPrestacion: '2025-07-16',
                estado: 'Realizada',
                profesional_id: 1,
                fecha_programada: '2025-07-16',
                hora_programada: '09:00',
                fecha_real: '2025-07-16',
                hora_real: '09:05',
                tipo_atencion: 'programada',
                cambio_horario: true,
                motivo_cambio: 'atraso'
            },
            // Sesiones para HOY (16 de julio) - Solo 5 turnos para presentación
            {
                id: 31,
                orden_id: 4,
                numeroSesion: 3,
                fechaPrestacion: '2025-07-16',
                estado: 'Realizada',
                profesional_id: 1,
                fecha_programada: '2025-07-16',
                hora_programada: '15:00',
                fecha_real: '2025-07-16',
                hora_real: '15:00',
                tipo_atencion: 'programada'
            },
            {
                id: 32,
                orden_id: 5,
                numeroSesion: 1,
                fechaPrestacion: '2025-07-16',
                estado: 'Realizada',
                profesional_id: 1,
                fecha_programada: '2025-07-16',
                hora_programada: '16:00',
                fecha_real: '2025-07-16',
                hora_real: '16:00',
                tipo_atencion: 'programada'
            },
            {
                id: 33,
                orden_id: 6,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-16',
                hora_programada: '17:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 34,
                orden_id: 7,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-16',
                hora_programada: '20:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 35,
                orden_id: 8,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-16',
                hora_programada: '20:30',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            // Sesiones para el día siguiente (17 de julio) - Próximas citas
            {
                id: 36,
                orden_id: 8,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '16:30',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 37,
                orden_id: 9,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '10:30',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 38,
                orden_id: 5,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '11:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            // Más sesiones programadas para la semana
            {
                id: 39,
                orden_id: 4,
                numeroSesion: 4,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '09:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 40,
                orden_id: 6,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '15:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 41,
                orden_id: 4,
                numeroSesion: 5,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-18',
                hora_programada: '09:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 42,
                orden_id: 7,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-18',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 43,
                orden_id: 5,
                numeroSesion: 3,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-18',
                hora_programada: '11:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 44,
                orden_id: 6,
                numeroSesion: 3,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-18',
                hora_programada: '15:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            // *** SESIONES PARA CREAR CONFLICTOS DE HORARIO ***
            
            // Sesiones para otros días (mover a mañana para no interferir con el conteo de hoy)
            {
                id: 45,
                orden_id: 10,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '09:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            {
                id: 46,
                orden_id: 11,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '10:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            {
                id: 47,
                orden_id: 12,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '11:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            {
                id: 48,
                orden_id: 14,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '14:00',
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            // *** SESIONES PARA MAÑANA (17 de julio) - CREAR SATURACIÓN ***
            
            // Crear SATURACIÓN en 09:00 el 17 de julio (4-5 pacientes)
            {
                id: 49,
                orden_id: 13,
                numeroSesion: 1,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '09:00', // Con sesión id: 39, serán 2
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 50,
                orden_id: 10,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '09:00', // Tercer paciente en 09:00
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 51,
                orden_id: 11,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '09:00', // Cuarto paciente en 09:00
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            {
                id: 52,
                orden_id: 12,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '09:00', // QUINTO paciente en 09:00 - CAPACIDAD ALTA (ROJO)
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            },
            
            // Crear capacidad media en 11:00 el 17 de julio
            {
                id: 53,
                orden_id: 14,
                numeroSesion: 2,
                fechaPrestacion: null,
                estado: 'Pendiente',
                profesional_id: 1,
                fecha_programada: '2025-07-17',
                hora_programada: '11:00', // Con sesiones 38, 37 = 3 pacientes (amarillo)
                fecha_real: null,
                hora_real: null,
                tipo_atencion: 'programada'
            }
        ]
    },

    // Función para inicializar datos
    init: function() {
        console.log('Inicializando datos de prueba...');
        
        // Verificar si ya se inicializó
        if (GestorOrdenes.storage.isInitialized()) {
            console.log('Datos ya inicializados - verificando integridad...');
            
            // Verificar si tenemos las órdenes actuales y sesiones con conflictos
            const orden10 = GestorOrdenes.storage.ordenes.getById(10);
            const sesionesHoy = GestorOrdenes.storage.sesiones.getAll()
                .filter(s => s.fecha_programada === '2025-07-16');
            const sesiones11am = sesionesHoy.filter(s => s.hora_programada === '11:00');
            
            if (!orden10 || sesiones11am.length < 3) {
                console.log('Datos desactualizados detectados - ejecutando actualización forzada...');
                this.forceUpdate();
                return;
            }
            
            console.log('Datos están actualizados correctamente');
            return;
        }
        
        // Cargar datos maestros
        GestorOrdenes.storage.set('OBRAS_SOCIALES', this.obrasSociales);
        GestorOrdenes.storage.set('PRACTICAS', this.practicas);
        GestorOrdenes.storage.set('MEDICOS_DERIVANTES', this.medicosDerivantes);
        GestorOrdenes.storage.set('PACIENTES', this.pacientes);
        GestorOrdenes.storage.set('ARANCELES', this.aranceles);
        
        // Cargar datos de ejemplo
        GestorOrdenes.storage.set('ORDENES', this.ejemplos.ordenes);
        GestorOrdenes.storage.set('SESIONES', this.ejemplos.sesiones);
        GestorOrdenes.storage.set('PRESENTACIONES', []);
        GestorOrdenes.storage.set('NOTIFICACIONES', this.notificaciones);
        
        // Marcar como inicializado
        GestorOrdenes.storage.markInitialized();
        
        console.log('Datos de prueba inicializados correctamente');
    },

    // Función para resetear datos (útil para testing)
    reset: function() {
        console.log('Reseteando datos...');
        GestorOrdenes.storage.clear();
        this.init();
    },

    // Función para forzar actualización de datos
    forceUpdate: function() {
        console.log('Forzando actualización de datos...');
        
        // Limpiar storage completamente
        GestorOrdenes.storage.clear();
        
        // Cargar datos maestros actualizados
        GestorOrdenes.storage.set('OBRAS_SOCIALES', this.obrasSociales);
        GestorOrdenes.storage.set('PRACTICAS', this.practicas);
        GestorOrdenes.storage.set('MEDICOS_DERIVANTES', this.medicosDerivantes);
        GestorOrdenes.storage.set('NOTIFICACIONES', this.notificaciones);
        GestorOrdenes.storage.set('PACIENTES', this.pacientes);
        GestorOrdenes.storage.set('ARANCELES', this.aranceles);
        
        // Cargar datos de ejemplo actualizados
        GestorOrdenes.storage.set('ORDENES', this.ejemplos.ordenes);
        GestorOrdenes.storage.set('SESIONES', this.ejemplos.sesiones);
        GestorOrdenes.storage.set('PRESENTACIONES', []);
        
        // Marcar como inicializado
        GestorOrdenes.storage.markInitialized();
        
        console.log('Datos actualizados forzosamente - Conflictos de horario y capacidad agregados para demostración');
    }
};