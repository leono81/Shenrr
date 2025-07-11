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
                fechaCierre: null
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
                fechaCierre: null
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
                fechaCierre: '2025-06-30'
            }
        ],

        sesiones: [
            // Sesiones para orden 1 (María José Rodríguez)
            {
                id: 1,
                orden_id: 1,
                numeroSesion: 1,
                fechaPrestacion: '2025-06-16',
                estado: 'Realizada'
            },
            {
                id: 2,
                orden_id: 1,
                numeroSesion: 2,
                fechaPrestacion: '2025-06-18',
                estado: 'Realizada'
            },
            {
                id: 3,
                orden_id: 1,
                numeroSesion: 3,
                fechaPrestacion: '2025-06-20',
                estado: 'Realizada'
            },
            {
                id: 4,
                orden_id: 1,
                numeroSesion: 4,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 5,
                orden_id: 1,
                numeroSesion: 5,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 6,
                orden_id: 1,
                numeroSesion: 6,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 7,
                orden_id: 1,
                numeroSesion: 7,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 8,
                orden_id: 1,
                numeroSesion: 8,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 9,
                orden_id: 1,
                numeroSesion: 9,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 10,
                orden_id: 1,
                numeroSesion: 10,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            // Sesiones para orden 2 (Carlos Alberto Fernández)
            {
                id: 11,
                orden_id: 2,
                numeroSesion: 1,
                fechaPrestacion: '2025-06-21',
                estado: 'Realizada'
            },
            {
                id: 12,
                orden_id: 2,
                numeroSesion: 2,
                fechaPrestacion: '2025-06-23',
                estado: 'Realizada'
            },
            {
                id: 13,
                orden_id: 2,
                numeroSesion: 3,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 14,
                orden_id: 2,
                numeroSesion: 4,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 15,
                orden_id: 2,
                numeroSesion: 5,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 16,
                orden_id: 2,
                numeroSesion: 6,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 17,
                orden_id: 2,
                numeroSesion: 7,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            {
                id: 18,
                orden_id: 2,
                numeroSesion: 8,
                fechaPrestacion: null,
                estado: 'Pendiente'
            },
            // Sesiones para orden 3 (Ana Sofía Martínez) - 10 sesiones realizadas
            {
                id: 19,
                orden_id: 3,
                numeroSesion: 1,
                fechaPrestacion: '2025-06-02',
                estado: 'Realizada'
            },
            {
                id: 20,
                orden_id: 3,
                numeroSesion: 2,
                fechaPrestacion: '2025-06-04',
                estado: 'Realizada'
            },
            {
                id: 21,
                orden_id: 3,
                numeroSesion: 3,
                fechaPrestacion: '2025-06-06',
                estado: 'Realizada'
            },
            {
                id: 22,
                orden_id: 3,
                numeroSesion: 4,
                fechaPrestacion: '2025-06-09',
                estado: 'Realizada'
            },
            {
                id: 23,
                orden_id: 3,
                numeroSesion: 5,
                fechaPrestacion: '2025-06-11',
                estado: 'Realizada'
            },
            {
                id: 24,
                orden_id: 3,
                numeroSesion: 6,
                fechaPrestacion: '2025-06-13',
                estado: 'Realizada'
            },
            {
                id: 25,
                orden_id: 3,
                numeroSesion: 7,
                fechaPrestacion: '2025-06-16',
                estado: 'Realizada'
            },
            {
                id: 26,
                orden_id: 3,
                numeroSesion: 8,
                fechaPrestacion: '2025-06-18',
                estado: 'Realizada'
            },
            {
                id: 27,
                orden_id: 3,
                numeroSesion: 9,
                fechaPrestacion: '2025-06-20',
                estado: 'Realizada'
            },
            {
                id: 28,
                orden_id: 3,
                numeroSesion: 10,
                fechaPrestacion: '2025-06-23',
                estado: 'Realizada'
            }
        ]
    },

    // Función para inicializar datos
    init: function() {
        console.log('Inicializando datos de prueba...');
        
        // Verificar si ya se inicializó
        if (GestorOrdenes.storage.isInitialized()) {
            console.log('Datos ya inicializados - verificando integridad...');
            
            // Verificar si la orden ID 3 tiene los datos correctos
            const orden3 = GestorOrdenes.storage.ordenes.getById(3);
            const sesionesOrden3 = GestorOrdenes.storage.sesiones.getByOrden(3);
            
            if (!orden3 || orden3.cantidadSesionesTotal !== 10 || sesionesOrden3.length !== 10) {
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
        GestorOrdenes.storage.set('PACIENTES', this.pacientes);
        GestorOrdenes.storage.set('ARANCELES', this.aranceles);
        
        // Cargar datos de ejemplo actualizados
        GestorOrdenes.storage.set('ORDENES', this.ejemplos.ordenes);
        GestorOrdenes.storage.set('SESIONES', this.ejemplos.sesiones);
        GestorOrdenes.storage.set('PRESENTACIONES', []);
        
        // Marcar como inicializado
        GestorOrdenes.storage.markInitialized();
        
        console.log('Datos actualizados forzosamente - Ana Sofía debería tener 10 sesiones realizadas');
    }
};