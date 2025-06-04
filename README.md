# Sistema-de-Gestion-de-Reservas-para-Restaurantes
Descripción
ReservaFácil es un sistema web sencillo para la gestión de reservas en pequeños restaurantes. Diseñado para reemplazar los sistemas manuales (libretas, WhatsApp) con una solución digital accesible.

Características principales
✅ Registro de reservas con datos básicos del cliente
✅ Visualización por día/hora de todas las reservas
✅ Control de capacidad del restaurante (30 personas máximo)
✅ Cancelación de reservas existentes
✅ Diseño responsive que funciona en móviles y computadoras
✅ Base de datos simple en formato JSON

Tecnologías utilizadas
Interfaz: HTML5, CSS3, JavaScript (Vanilla JS)
Almacenamiento: localStorage (persistencia en el navegador)
100% JavaScript - No requiere servidor backend
Instalación y uso
Requisitos :

Navegador web moderno (Chrome, Firefox, Edge)
Python 3.x (para servidor de desarrollo)

Ejecución :

# Clonar repositorio (si aplica)
git clone https://ejemplo.com/reservafacil.git
cd reservafacil

# Iniciar servidor
python -m http.server 8000
Uso básico :

Para hacer una reserva: completar formulario y enviar
Para ver reservas: seleccione fecha en el filtro
Para cancelar: hacer clic en "Cancelar" junto a la reserva
Estructura del Proyecto
/reservafacil
│
├── index.html         # Página principal
├── style.css          # Estilos CSS
├── script.js          # Lógica de la aplicación
├── reservas.json      # Base de datos de reservas (se crea automáticamente)
└── README.md          # Este archivo
Hoja de Ruta (Próximas Funcionalidades)
🛠 Persistencia de datos : Guardar reservas en archivo JSON
🛠 Sistema de recordatorios : Notificaciones SMS/Email
🛠 Modificación de reservas existentes
🛠 Panel de administración con métricas
