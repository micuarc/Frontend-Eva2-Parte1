const estudiantes = [];
const promedio = document.getElementById("promedioCurso");
const tabla = document.querySelector("#tablaDeEstudiantes tbody");

document
  .getElementById("formularioEstudiantes")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    //Seleccionar dom elements
    const selNombre = document.getElementById("nombre");
    const selApellido = document.getElementById("apellido");
    const selNota = document.getElementById("nota");
    //Obtener valores de los selectores
    const nombre = selNombre.value.trim();
    const apellido = selApellido.value.trim();
    const nota = parseFloat(selNota.value);
    [
      //Limpiar mensajes de error de campos
      selNombre,
      selApellido,
      selNota,
    ].forEach((input) => {
      input.addEventListener("input", () => {
        input.setCustomValidity("");
      });
    });

    //Validar errores
    errorNota(selNota);
    errorNombreOApellido(selApellido, "Apellido");
    errorNombreOApellido(selNombre, "Nombre");
    //Evitar ingresar valores erróneos
    if (
      !selNombre.checkValidity() ||
      !selApellido.checkValidity() ||
      !selNota.checkValidity()
    ) {
      return;
    }
    //Pushear estudiante al arreglo
    const estudiante = { nombre, apellido, nota };
    estudiantes.push(estudiante);
    agregarEstudiante(estudiante);
    calcularPromedio();
    e.target.reset(); //limpiar campos llenados
  });

//Funciones de validación
function errorNombreOApellido(sel, campo) {
  const valor = sel.value.trim();
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  if (valor === "") {
    sel.setCustomValidity(`Por favor, complete el campo '${campo}'`);
  } else if (!regex.test(valor)) {
    sel.setCustomValidity(`Por favor, ingrese solo letras.`);
  } else {
    sel.setCustomValidity("");
  }
  sel.reportValidity();
  return sel.checkValidity();
}

function errorNota(num) {
  const nota = parseFloat(num.value);
  //Si el campo está vacío
  if (num.validity.valueMissing) {
    num.setCustomValidity("Por favor, ingrese una nota.");
    //Si el input no es un número
  } else if (isNaN(nota)) {
    num.setCustomValidity("Por favor, ingrese solo números.");
    //Si el input no está entre 1 y 7
  } else if (nota < 1 || nota > 7) {
    num.setCustomValidity("Por favor, ingrese una nota entre 1 y 7.");
    //Si el input tiene más de un decimal
  } else if (!Number.isInteger(nota * 10)) {
    num.setCustomValidity("Por favor, ingrese notas con máximo un decimal.");
  } else {
    num.setCustomValidity(""); // limpia el error, no hay problema
  }
  num.reportValidity();
  return num.checkValidity();
}

// Pushear estudiante a la tabla
function agregarEstudiante(est) {
  const row = document.createElement("tr");
  [
    est.nombre,
    est.apellido,
    est.nota.toFixed(1),
    `${crearBoton("success", "Editar")} ${crearBoton("danger", "Borrar")}`,
  ].forEach((valor, i) => {
    const celdaValor = document.createElement("td");
    i !== 3
      ? (celdaValor.textContent = valor)
      : celdaValor.insertAdjacentHTML("afterbegin", valor);
    row.appendChild(celdaValor);
  });
  tabla.appendChild(row);
}

function crearBoton(tipo, accion) {
  return `<button class="btn btn-${tipo} accion p-1 px-sm-2 px-md-3 fs-6 m-1 my-sm-0 mx-sm-1">${accion}</button>`;
}

//Calcular promedio general
const valorInicial = 0;
function calcularPromedio() {
  if (estudiantes.length === 0) {
    promedio.textContent = "Promedio de Calificaciones: No Disponible";
  } else {
    const totalDeNotas = estudiantes.reduce((acc, estudiante) => {
      return acc + estudiante.nota;
    }, valorInicial);
    const promedioGeneral = totalDeNotas / estudiantes.length;
    promedio.textContent = `Promedio General del Curso: ${promedioGeneral.toFixed(
      2
    )}`;
  }
}
