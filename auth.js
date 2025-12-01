document.addEventListener("DOMContentLoaded", () => {
  // Aquí guardamos y leemos los usuarios desde la memoria del navegador
  function getUsuarios() {
    try {
      const raw = localStorage.getItem("usuarios");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  function setUsuarios(obj) {
    localStorage.setItem("usuarios", JSON.stringify(obj));
  }

  // Esto sirve para que el usuario pueda ver u ocultar la contraseña
  function bindToggle(inputId, checkboxId) {
    const input = document.getElementById(inputId);
    const checkbox = document.getElementById(checkboxId);
    if (input && checkbox) {
      checkbox.addEventListener("change", () => {
        input.type = checkbox.checked ? "text" : "password";
      });
    }
  }

  // Activamos el "mostrar contraseña" en cada página
  bindToggle("claveLogin", "mostrarClaveLogin");   // login
  bindToggle("clave", "mostrarClave");             // registro
  bindToggle("nuevaClave", "mostrarNuevaClave");   // recuperar

  // LOGIN
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const correo = document.getElementById("correoLogin").value.trim();
      const claveInput = document.getElementById("claveLogin");
      const clave = claveInput.value;
      const msg = document.getElementById("mensajeLogin");

      const usuarios = getUsuarios();
      const user = usuarios[correo];

      // Si el correo no existe en la memoria
      if (!user) {
        msg.textContent = "Usuario o contraseña incorrectos";
        claveInput.value = ""; // borramos la contraseña para que la escriba de nuevo
        return;
      }

      // Si la cuenta ya está bloqueada
      if (user.bloqueado) {
        alert("⚠ Cuenta bloqueada. Usa la opción de recuperar contraseña.");
        claveInput.value = "";
        return;
      }

      // Aquí revisamos si la contraseña es correcta
      if (user.clave !== clave) {
        user.intentos = (user.intentos || 0) + 1;
        claveInput.value = ""; // borramos la contraseña

        // Si se equivoca 3 veces, bloqueamos la cuenta
        if (user.intentos >= 3) {
          user.bloqueado = true;
          setUsuarios(usuarios);
          alert("⚠ Cuenta bloqueada");
        } else {
          msg.textContent = `Contraseña incorrecta. Intento ${user.intentos} de 3.`;
          setUsuarios(usuarios);
        }
        return;
      }

      // Si la contraseña es correcta, reiniciamos los intentos y desbloqueamos
      user.intentos = 0;
      user.bloqueado = false;
      setUsuarios(usuarios);
      msg.textContent = "Bienvenido " + user.nombre;
    });
  }

  // ---------------- REGISTRO ----------------
const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const clave = document.getElementById("clave").value;
    const msg = document.getElementById("mensaje");

    // Revisamos que cada dato cumpla las reglas
    if (!regexNombre.test(nombre)) return msg.textContent = "Nombre inválido";
    if (!regexCorreo.test(correo)) return msg.textContent = "Correo inválido";
    if (!regexCelular.test(celular)) return msg.textContent = "Celular inválido (8 dígitos en Bolivia)";
    if (!regexClave.test(clave)) return msg.textContent = "Contraseña insegura";

    const usuarios = getUsuarios();
    if (usuarios[correo]) return msg.textContent = "Ya existe este correo";

    // Guardamos el nuevo usuario en la memoria del navegador
    usuarios[correo] = { nombre, correo, celular, clave, intentos: 0, bloqueado: false };
    setUsuarios(usuarios);

    // Aquí mostramos el mensaje que pediste
    msg.textContent = "✅ Cuenta registrada";

    // Limpiamos el formulario para que quede listo
    formRegistro.reset();
  });
}

  // RECUPERAR 
  const formRecuperar = document.getElementById("formRecuperar");
  if (formRecuperar) {
    formRecuperar.addEventListener("submit", (e) => {
      e.preventDefault();
      const correo = document.getElementById("correoRecuperar").value.trim();
      const nuevaClave = document.getElementById("nuevaClave").value;
      const msg = document.getElementById("mensajeRecuperar");

      // Revisamos que el correo y la nueva contraseña sean válidos
      if (!regexCorreo.test(correo)) return msg.textContent = "Correo inválido";
      if (!regexClave.test(nuevaClave)) return msg.textContent = "Contraseña insegura";

      const usuarios = getUsuarios();
      const user = usuarios[correo];
      if (!user) { msg.textContent = "No existe este usuario"; return; }

      // Aquí actualizamos la contraseña olvidada
      user.clave = nuevaClave;
      user.intentos = 0;       // Reiniciamos los intentos
      user.bloqueado = false;  // Desbloqueamos la cuenta
      setUsuarios(usuarios);

      alert("Contraseña actualizada. Tu cuenta ha sido desbloqueada.");
      window.location.href = "../login/index.html";
    });
  }
});
