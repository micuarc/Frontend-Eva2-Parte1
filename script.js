const estudiantes = [];

//SELECTORES
//selectores de resumen de información
const formularioEstudiantes = document.getElementById("formularioEstudiantes");
const promedio = document.getElementById("promedioCurso");
const total = document.getElementById("total");
const aprobados = document.getElementById("aprobados");
const reprobados = document.getElementById("reprobados");

// selector de tabla
const tabla = document.querySelector("#tablaDeEstudiantes tbody");
// selectores de estudiante para editar
const nombreEstSelec = document.getElementById("nombreEst");
const apellidoEstSelec = document.getElementById("apellidoEst");
const notaEstSelec = document.getElementById("notaEst");
// selectores de formulario para editar
const formularioEditarEst = document.getElementById(
  "formularioEditarEstudiante"
);
// selectores de botones para editar
const botonGuardarModal = document.getElementById("guardarCambios");
const botonCancelarModal = document.getElementById("cancelarCambios");
// conocer el estudiante por editar
let estudianteSeleccionado = "";
let rowSeleccionada = "";

//VALIDACIONES, CREACIONES Y CÁLCULOS

//validación de strings de nombre y apellido
function errorNombreOApellido(sel, campo) {
  const valor = sel.value.trim();
  //expresión regular que solo permita valores válidos (no números ni caracteres especiales)
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

  // validaciones por cada caso:
  if (valor === "") {
    //si el input está vacío
    sel.setCustomValidity(`Por favor, complete el campo '${campo}'`);
  } else if (!regex.test(valor)) {
    //si se envía un nombre inválido -> ej: "B3nj4" o "Benj@"
    sel.setCustomValidity(`Por favor, ingrese solo letras.`);
  } else {
    //si es válido
    sel.setCustomValidity("");
  }
  return sel.reportValidity(); //mostrar mensaje de error, retorna true si es válido
}

//validación de notas
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
    // limpia el error, no hay problema
    num.setCustomValidity("");
  }
  return num.reportValidity(); //mostrar mensaje de error
}

function validarInputs(selNombre, selApellido, selNota) {
  //limpiar msje de error mientras usuario escribe input
  [selNombre, selApellido, selNota].forEach((input) => {
    input.addEventListener("input", () => {
      input.setCustomValidity("");
    });
  });

  //llamar funciones de validación
  errorNota(selNota);
  errorNombreOApellido(selApellido, "Apellido");
  errorNombreOApellido(selNombre, "Nombre");

  //devolver true en caso de haber algún error
  return (
    !selNombre.checkValidity() ||
    !selApellido.checkValidity() ||
    !selNota.checkValidity()
  );
}

//crear botones de editar y borrar estudiante
function crearBoton(tipo, accion) {
  const boton = document.createElement("button");

  //se agregan las clases de bootstrap y una para poder seleccionar el botón
  boton.className = `btn btn-${tipo} ${accion} accion p-1 px-sm-2 px-md-3 fs-6 m-1 my-sm-0 mx-sm-1`;
  boton.textContent = accion;

  // si el botón es para editar, se agregan atributos para conectar al modal
  if (accion === "Editar") {
    boton.setAttribute("data-bs-toggle", "modal");
    boton.setAttribute("data-bs-target", "#Editar");
  }
  return boton;
}

//calcular promedio general, total estudiantes, % aprobados, % reprobados
const valorInicial = 0;
function calcular() {
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

    //calcular total de aprobados
    const cantidadAprobados = estudiantes.reduce(
      (totalAprobados, estudiante) => {
        if (estudiante.nota >= 4.0) totalAprobados++;
        return totalAprobados;
      },
      valorInicial
    );
    //calcular y mostrar % de aprobados
    const porcentajeAprobados = (cantidadAprobados * 100) / estudiantes.length;
    aprobados.textContent = `Estudiantes Aprobados: ${porcentajeAprobados.toFixed(
      1
    )}%`;

    //calcular total de reprobados
    const cantidadReprobados = estudiantes.reduce(
      (totalReprobados, estudiante) => {
        if (estudiante.nota < 4.0) totalReprobados++;
        return totalReprobados;
      },
      valorInicial
    );
    //calcular y mostrar % de reprobados
    const porcentajeReprobados =
      (cantidadReprobados * 100) / estudiantes.length;
    reprobados.textContent = `Estudiantes Reprobados: ${porcentajeReprobados.toFixed(
      1
    )}%`;
  }
}

//CRUD - MANIPULACIÓN DOM
//crear estudiante y pushearlo al array
formularioEstudiantes.addEventListener("submit", (e) => {
  e.preventDefault();
  //selectores del input al agregar estudiante
  const selNombre = document.getElementById("nombre");
  const selApellido = document.getElementById("apellido");
  const selNota = document.getElementById("nota");

  //obtener valores de los selectores
  const nombre = selNombre.value.trim();
  const apellido = selApellido.value.trim();
  const nota = parseFloat(selNota.value);

  //validar inputs. si es T, se detiene la ejecución
  if (validarInputs(selNombre, selApellido, selNota)) {
    return;
  }

  // crear estudiante y pushearlo al arreglo
  const estudiante = { nombre, apellido, nota };
  estudiantes.push(estudiante);
  // agregar estudiante a la tabla
  agregarEstudiante(estudiante);
  calcular();
  e.target.reset(); //limpiar campos llenados
});

// agregar estudiante a la tabla
function agregarEstudiante(est) {
  //crear una fila por estudiante
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
  //agregar botones de acciones
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
  //agregar fila entera a la tabla
  tabla.appendChild(row);
}

// 3. BORRAR ESTUDIANTE
function borrarEstudiante(est, row) {
  //calcular index para saber cuál estudiante borrar
  const index = estudiantes.indexOf(est);
  //si el array no está vacío, se ubica la posición del est y se quita
  if (index >= 0) {
    estudiantes.splice(index, 1);
    row.remove();
    //volvemos a calcular
    calcular();
  }
}
// 4. EDITAR ESTUDIANTE
function editarEstudiante(est, row) {
  //asignamos el estudiante por editar para pasarlo a los listeners
  estudianteSeleccionado = est;
  rowSeleccionada = row;
  //llenamos los input del modal de edición con el estudiante por editar
  nombreEstSelec.value = est.nombre;
  apellidoEstSelec.value = est.apellido;
  notaEstSelec.value = est.nota;
}

//LISTENERS
// cancelar edicion en modal y/o salir del modal -> reinicia valores input de edición
botonCancelarModal.addEventListener("click", () => {
  //Limpiar valores
  nombreEstSelec.value = "";
  apellidoEstSelec.value = "";
  notaEstSelec.value = "";
  // deseleccionar estudiante que se iba a modificar
  estudianteSeleccionado = "";
  rowSeleccionada = "";
});

// guardar cambios del modal de edición
botonGuardarModal.addEventListener("click", () => {
  //retorna true si hay error y no continúa
  if (validarInputs(nombreEstSelec, apellidoEstSelec, notaEstSelec)) return;
  // seleccionar valores del input
  estudianteSeleccionado.nombre = nombreEstSelec.value.trim();
  estudianteSeleccionado.apellido = apellidoEstSelec.value.trim();
  estudianteSeleccionado.nota = parseFloat(notaEstSelec.value);
  //actualizar los valores de la tabla
  const celdasRow = rowSeleccionada.children;
  celdasRow[0].textContent = estudianteSeleccionado.nombre;
  celdasRow[1].textContent = estudianteSeleccionado.apellido;
  celdasRow[2].textContent = estudianteSeleccionado.nota.toFixed(1);
  //recalcular los valores de las tarjetas
  calcular();
  // Limpiar formulario
  botonCancelarModal.click();
});
