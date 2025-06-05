// Clase para manejar las reservas
class ReservaFacil {
    constructor() {
        // Inicializar variables
        this.reservas = [];
        this.config = {
            capacidadMaxima: 50,
            horarioApertura: '10:00',
            horarioCierre: '22:00',
            duracionReserva: 90
        };

        // Cargar datos guardados
        this.cargarDatos();

        // Inicializar eventos
        this.inicializarEventos();
    }

    // Cargar datos del localStorage
    cargarDatos() {
        if (localStorage.getItem('reservas')) {
            this.reservas = JSON.parse(localStorage.getItem('reservas'));
        }

        if (localStorage.getItem('config')) {
            this.config = JSON.parse(localStorage.getItem('config'));
        }
    }

    // Guardar datos en localStorage
    guardarDatos() {
        localStorage.setItem('reservas', JSON.stringify(this.reservas));
        localStorage.setItem('config', JSON.stringify(this.config));
    }

    // Inicializar eventos
    inicializarEventos() {
        // Navegación
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.mostrarSeccion(link.id.replace('nav-', ''));
            });
        });

        // Formulario de reserva
        document.getElementById('form-reserva').addEventListener('submit', (e) => {
            e.preventDefault();
            this.crearReserva();
        });

        // Formulario de configuración
        document.getElementById('form-config').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarConfiguracion();
        });

        // Filtro de fecha
        document.getElementById('filtro-fecha').addEventListener('change', (e) => {
            this.mostrarReservas(e.target.value);
        });

        // Botón "Hoy"
        document.getElementById('btn-hoy').addEventListener('click', () => {
            const hoy = new Date().toISOString().split('T')[0];
            document.getElementById('filtro-fecha').value = hoy;
            this.mostrarReservas(hoy);
        });

        // Cargar configuración inicial
        this.cargarConfiguracion();
    }

    // Mostrar sección específica
    mostrarSeccion(seccion) {
        // Ocultar todas las secciones
        document.querySelectorAll('main section').forEach(s => {
            s.classList.remove('active');
        });

        // Mostrar la sección seleccionada
        document.getElementById(`seccion-${seccion}`).classList.add('active');

        // Actualizar navegación
        document.querySelectorAll('nav li').forEach(li => {
            li.classList.remove('active');
        });
        document.querySelector(`#nav-${seccion}`).parentElement.classList.add('active');

        // Si es la sección de reservas, mostrar las de hoy
        if (seccion === 'calendario') {
            const hoy = new Date().toISOString().split('T')[0];
            document.getElementById('filtro-fecha').value = hoy;
            this.mostrarReservas(hoy);
        }
    }

    // Crear nueva reserva
    crearReserva() {
        const form = document.getElementById('form-reserva');
        const reserva = {
            id: Date.now(),
            nombre: form.nombre.value,
            telefono: form.telefono.value,
            fecha: form.fecha.value,
            hora: form.hora.value,
            comensales: parseInt(form.comensales.value),
            notas: form.notas.value,
            estado: 'confirmada'
        };

        // Validar capacidad
        if (!this.validarCapacidad(reserva)) {
            alert('No hay suficiente capacidad para esta reserva');
            return;
        }

        // Agregar reserva
        this.reservas.push(reserva);
        this.guardarDatos();
        form.reset();
        alert('Reserva creada exitosamente');
        this.mostrarReservas(reserva.fecha);
    }

    // Validar capacidad
    validarCapacidad(nuevaReserva) {
        const reservasMismoHorario = this.reservas.filter(r => 
            r.fecha === nuevaReserva.fecha && 
            r.hora === nuevaReserva.hora
        );

        const totalComensales = reservasMismoHorario.reduce((sum, r) => sum + r.comensales, 0);
        return (totalComensales + nuevaReserva.comensales) <= this.config.capacidadMaxima;
    }

    // Mostrar reservas por fecha
    mostrarReservas(fecha) {
        const reservasFecha = this.reservas
            .filter(r => r.fecha === fecha)
            .sort((a, b) => a.hora.localeCompare(b.hora));

        const lista = document.getElementById('lista-reservas');
        lista.innerHTML = '';

        if (reservasFecha.length === 0) {
            lista.innerHTML = '<p class="empty-message">No hay reservas para esta fecha</p>';
            return;
        }

        reservasFecha.forEach(reserva => {
            const item = document.createElement('div');
            item.className = 'reserva-item';
            item.innerHTML = `
                <div class="reserva-info">
                    <h3>${reserva.nombre}</h3>
                    <p><strong>Hora:</strong> ${reserva.hora}</p>
                    <p><strong>Comensales:</strong> ${reserva.comensales}</p>
                    ${reserva.notas ? `<p><strong>Notas:</strong> ${reserva.notas}</p>` : ''}
                </div>
                <div class="reserva-acciones">
                    <button class="btn btn-secondary" onclick="reservaFacil.editarReserva(${reserva.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger" onclick="reservaFacil.cancelarReserva(${reserva.id})">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            `;
            lista.appendChild(item);
        });
    }

    // Cargar configuración en el formulario
    cargarConfiguracion() {
        const form = document.getElementById('form-config');
        form.nombreRestaurante.value = this.config.nombreRestaurante || '';
        form.capacidadMaxima.value = this.config.capacidadMaxima;
        form.horarioApertura.value = this.config.horarioApertura;
        form.horarioCierre.value = this.config.horarioCierre;
        form.duracionReserva.value = this.config.duracionReserva;
    }

    // Guardar configuración
    guardarConfiguracion() {
        const form = document.getElementById('form-config');
        this.config = {
            nombreRestaurante: form.nombreRestaurante.value,
            capacidadMaxima: parseInt(form.capacidadMaxima.value),
            horarioApertura: form.horarioApertura.value,
            horarioCierre: form.horarioCierre.value,
            duracionReserva: parseInt(form.duracionReserva.value)
        };
        this.guardarDatos();
        alert('Configuración guardada exitosamente');
    }

    // Editar reserva
    editarReserva(id) {
        const reserva = this.reservas.find(r => r.id === id);
        if (!reserva) return;

        const modal = document.getElementById('modal-reserva');
        const form = document.getElementById('form-editar-reserva');

        // Llenar formulario con datos actuales
        form.reservaId.value = reserva.id;
        form.modalNombre.value = reserva.nombre;
        // Llenar otros campos...

        modal.classList.add('active');
    }

    // Cancelar reserva
    cancelarReserva(id) {
        if (confirm('¿Está seguro de cancelar esta reserva?')) {
            this.reservas = this.reservas.filter(r => r.id !== id);
            this.guardarDatos();
            this.mostrarReservas(document.getElementById('filtro-fecha').value);
        }
    }
}

// Inicializar la aplicación
const reservaFacil = new ReservaFacil();
