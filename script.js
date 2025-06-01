const estudiantes = [];
const promedio = document.getElementById("promedioCurso");
const total = document.getElementById("total");
const aprobados = document.getElementById("aprobados");
const reprobados = document.getElementById("reprobados");

const tabla = document.querySelector("#tablaDeEstudiantes tbody");
const nombreEstSelec = document.getElementById("nombreEst");
const apellidoEstSelec = document.getElementById("apellidoEst");
const notaEstSelec = document.getElementById("notaEst");
const formularioEditarEst = document.getElementById(
  "formularioEditarEstudiante"
);
const botonGuardarModal = document.getElementById("guardarCambios");
const botonCancelarModal = document.getElementById("cancelarCambios");
let estudianteSeleccionado = "";
let rowSeleccionada = "";

document
  .getElementById("formularioEstudiantes")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    //seleccionar dom elements
    const selNombre = document.getElementById("nombre");
    const selApellido = document.getElementById("apellido");
    const selNota = document.getElementById("nota");

    //obtener valores de los selectores
    const nombre = selNombre.value.trim();
    const apellido = selApellido.value.trim();
    const nota = parseFloat(selNota.value);

    if (validarInputs(selNombre, selApellido, selNota)) {
      return;
    }

    //pushear estudiante al arreglo
    const estudiante = { nombre, apellido, nota };
    estudiantes.push(estudiante);
    agregarEstudiante(estudiante);
    calcularPromedio();
    e.target.reset(); //limpiar campos llenados
  });

function validarInputs(selNombre, selApellido, selNota) {
  [
    //limpiar mensajes de error de campos
    selNombre,
    selApellido,
    selNota,
  ].forEach((input) => {
    input.addEventListener("input", () => {
      input.setCustomValidity("");
    });
  });

  //validar errores
  errorNota(selNota);
  errorNombreOApellido(selApellido, "Apellido");
  errorNombreOApellido(selNombre, "Nombre");
  //evitar ingresar valores erróneos
  return (
    !selNombre.checkValidity() ||
    !selApellido.checkValidity() ||
    !selNota.checkValidity()
  );
}

//funciones de validación
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
  //si el campo está vacío
  if (num.validity.valueMissing) {
    num.setCustomValidity("Por favor, ingrese una nota.");
    //si el input no es un número
  } else if (isNaN(nota)) {
    num.setCustomValidity("Por favor, ingrese solo números.");
    //si el input no está entre 1 y 7
  } else if (nota < 1 || nota > 7) {
    num.setCustomValidity("Por favor, ingrese una nota entre 1 y 7.");
    //si el input tiene más de un decimal
  } else if (!Number.isInteger(nota * 10)) {
    num.setCustomValidity("Por favor, ingrese notas con máximo un decimal.");
  } else {
    num.setCustomValidity(""); // limpia el error, no hay problema
  }
  num.reportValidity();
  return num.checkValidity();
}

function crearBoton(tipo, accion) {
  const boton = document.createElement("button");
  boton.className = `btn btn-${tipo} ${accion} accion p-1 px-sm-2 px-md-3 fs-6 m-1 my-sm-0 mx-sm-1`;
  boton.textContent = accion;

  if (accion === "Editar") {
    boton.setAttribute("data-bs-toggle", "modal");
    boton.setAttribute("data-bs-target", "#Editar");
  }

  return boton;
}

// pushear estudiante a la tabla
function agregarEstudiante(est) {
  const row = document.createElement("tr");
  [
    //agregar estudiantes
    est.nombre,
    est.apellido,
    est.nota.toFixed(1),
  ].forEach((valor, i) => {
    const celdaValor = document.createElement("td");
    celdaValor.textContent = valor;
    row.appendChild(celdaValor);
  });
  //agregar botones
  const rowBotones = document.createElement("td");
  const botonEditar = crearBoton("success", "Editar");
  const botonBorrar = crearBoton("danger", "Borrar");
  botonEditar.addEventListener("click", () => {
    editarEstudiante(est, row);
  });
  botonBorrar.addEventListener("click", () => {
    borrarEstudiante(est, row);
  });
  rowBotones.appendChild(botonEditar);
  rowBotones.appendChild(botonBorrar);
  row.appendChild(rowBotones);
  tabla.appendChild(row);
}

function borrarEstudiante(est, row) {
  const index = estudiantes.indexOf(est);
  if (index >= 0) {
    estudiantes.splice(index, 1);
    row.remove();
    calcularPromedio();
  }
}

function editarEstudiante(est, row) {
  estudianteSeleccionado = est;
  rowSeleccionada = row;

  nombreEstSelec.value = est.nombre;
  apellidoEstSelec.value = est.apellido;
  notaEstSelec.value = est.nota;
}

botonCancelarModal.addEventListener("click", () => {
  nombreEstSelec.value = "";
  apellidoEstSelec.value = "";
  notaEstSelec.value = "";

  estudianteSeleccionado = "";
  rowSeleccionada = "";
});

botonGuardarModal.addEventListener("click", () => {
  if (validarInputs(nombreEstSelec, apellidoEstSelec, notaEstSelec)) return;

  estudianteSeleccionado.nombre = nombreEstSelec.value.trim();
  estudianteSeleccionado.apellido = apellidoEstSelec.value.trim();
  estudianteSeleccionado.nota = parseFloat(notaEstSelec.value);

  const celdasRow = rowSeleccionada.children;
  celdasRow[0].textContent = estudianteSeleccionado.nombre;
  celdasRow[1].textContent = estudianteSeleccionado.apellido;
  celdasRow[2].textContent = estudianteSeleccionado.nota.toFixed(1);

  calcularPromedio();
  // Limpiar formulario
  nombreEstSelec.value = "";
  apellidoEstSelec.value = "";
  notaEstSelec.value = "";

  botonCancelarModal.click();

  estudianteEditando = "";
  filaEditando = "";
});

//calcular promedio general
const valorInicial = 0;
function calcularPromedio() {
  if (estudiantes.length === 0) {
    promedio.textContent = "Promedio de Calificaciones: No Disponible";
  } else {
    //calcular promedio
    const totalDeNotas = estudiantes.reduce((acc, estudiante) => {
      return acc + estudiante.nota;
    }, valorInicial);
    const promedioGeneral = totalDeNotas / estudiantes.length;
    promedio.textContent = `Promedio General del Curso: ${promedioGeneral.toFixed(
      2
    )}`;
    //mostrar total estudiantes
    total.textContent = `Total de Estudiantes: ${estudiantes.length}`;

    //mostrar % aprobados
    const cantidadAprobados = estudiantes.reduce(
      (totalAprobados, estudiante) => {
        if (estudiante.nota >= 4.0) totalAprobados++;
        return totalAprobados;
      },
      valorInicial
    );
    const porcentajeAprobados = (cantidadAprobados * 100) / estudiantes.length;
    aprobados.textContent = `Estudiantes Aprobados: ${porcentajeAprobados.toFixed(
      1
    )}%`;

    //mostrar % reprobados
    const cantidadReprobados = estudiantes.reduce(
      (totalReprobados, estudiante) => {
        if (estudiante.nota < 4.0) totalReprobados++;
        return totalReprobados;
      },
      valorInicial
    );
    const porcentajeReprobados =
      (cantidadReprobados * 100) / estudiantes.length;
    reprobados.textContent = `Estudiantes Reprobados: ${porcentajeReprobados.toFixed(
      1
    )}%`;
  }
}
