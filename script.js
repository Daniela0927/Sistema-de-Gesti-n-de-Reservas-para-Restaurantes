// Sistema de Reservas 100% JavaScript

// Configuración inicial
const CAPACIDAD_MAXIMA = 30;
const LOCAL_STORAGE_KEY = 'reservas';

// Cargar reservas desde localStorage
let reservas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

// Elementos del DOM
const reservaForm = document.getElementById('reservaForm');
const listaReservas = document.getElementById('listaReservas');
const filtroFecha = document.getElementById('filtroFecha');

// Funciones principales

// 1. Guardar reservas en localStorage
function guardarReservas() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reservas));
}

// 2. Registrar nueva reserva
function registrarReserva(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const personas = parseInt(document.getElementById('personas').value);

    // Validar capacidad
    if (!validarCapacidad(fecha, hora, personas)) {
        alert('No hay suficiente capacidad para esa fecha y hora');
        return;
    }

    const nuevaReserva = {
        id: Date.now(),
        nombre,
        telefono,
        fecha,
        hora,
        personas,
        estado: 'confirmada'
    };

    reservas.push(nuevaReserva);
    guardarReservas();
    actualizarListaReservas();
    reservaForm.reset();
    alert('Reserva registrada con éxito');
}

// 3. Validar capacidad
function validarCapacidad(fecha, hora, personas) {
    const reservasMismoHorario = reservas.filter(r => 
        r.fecha === fecha && 
        r.hora === hora &&
        r.estado === 'confirmada'
    );

    const totalPersonas = reservasMismoHorario.reduce((sum, r) => sum + r.personas, 0);
    return (totalPersonas + personas) <= CAPACIDAD_MAXIMA;
}

// 4. Mostrar reservas
function actualizarListaReservas(fecha = new Date().toISOString().split('T')[0]) {
    const reservasFiltradas = reservas.filter(r => r.fecha === fecha);
    
    listaReservas.innerHTML = reservasFiltradas
        .map(r => `
            <div class="reserva-item">
                <p><strong>Nombre:</strong> ${r.nombre}</p>
                <p><strong>Teléfono:</strong> ${r.telefono}</p>
                <p><strong>Hora:</strong> ${r.hora}</p>
                <p><strong>Personas:</strong> ${r.personas}</p>
                <button onclick="cancelarReserva(${r.id})">Cancelar</button>
                <button onclick="modificarReserva(${r.id})">Modificar</button>
            </div>
        `)
        .join('');
}

// 5. Cancelar reserva
function cancelarReserva(id) {
    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
        reserva.estado = 'cancelada';
        guardarReservas();
        actualizarListaReservas();
        alert('Reserva cancelada');
    }
}

// 6. Modificar reserva
function modificarReserva(id) {
    const reserva = reservas.find(r => r.id === id);
    if (reserva) {
        // Llenar formulario con datos existentes
        document.getElementById('nombre').value = reserva.nombre;
        document.getElementById('telefono').value = reserva.telefono;
        document.getElementById('fecha').value = reserva.fecha;
        document.getElementById('hora').value = reserva.hora;
        document.getElementById('personas').value = reserva.personas;
        
        // Eliminar reserva existente
        reservas = reservas.filter(r => r.id !== id);
        guardarReservas();
    }
}

// Event Listeners
reservaForm.addEventListener('submit', registrarReserva);
filtroFecha.addEventListener('change', (e) => {
    actualizarListaReservas(e.target.value);
});

// Inicialización
filtroFecha.value = new Date().toISOString().split('T')[0];
actualizarListaReservas();