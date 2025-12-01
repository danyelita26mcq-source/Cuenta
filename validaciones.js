// Aquí estoy diciendo qué cosas son válidas para cada campo:

// El nombre solo puede tener letras y espacios
const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;

// El correo debe tener el formato correcto con @ y un dominio
const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// El celular en Bolivia tiene 8 números y empieza en 6, 7 o 8
const regexCelular = /^[678][0-9]{7}$/;

// La contraseña debe tener al menos una mayúscula, una minúscula, un número y un símbolo
const regexClave = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

