// 0. CONFIGURACIÓN INICIAL (FECHA)
window.addEventListener("DOMContentLoaded", function() {
    // 1. Buscamos la cajita de la fecha
    const cajaFecha = document.getElementById("fecha-hoy");
    
    // 2. Creamos un objeto Fecha (saca la hora de tu PC)
    const fechaActual = new Date();
    
    // 3. La escribimos en formato local (Paraguay: dia/mes/año)
    cajaFecha.innerText = fechaActual.toLocaleDateString('es-PY')

    // 4. Numero de factura
    document.getElementById("factura-actual").innerText = numeroFactura;

    // Recuperamos el total guardado
const totalGuardado = localStorage.getItem("totalAcumulado");
if (totalGuardado) {
    totalAcumulado = Number(totalGuardado);
    // Cambia la línea de abajo para que NO repita "Total:" ni "Gs."
    document.getElementById("total-pagar").innerText = totalAcumulado.toLocaleString('es-PY'); 
}

// Recuperamos las filas de la tabla
const filasGuardadas = localStorage.getItem("filasGuardadas");
if (filasGuardadas) {
    cuerpoTabla.innerHTML = filasGuardadas;
}
});
// 1. TRAEMOS LOS ELEMENTOS DEL HTML (Los Ganchos)
const inputProducto = document.getElementById("producto-nombre");
const inputCantidad = document.getElementById("cantidad");
const inputPrecio = document.getElementById("precio");
const boton = document.getElementById("btn-agregar");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const textoTotal = document.getElementById("total-pagar");
const inputCliente = document.getElementById("cliente-nombre");
const inputRuc = document.getElementById("cliente-ruc");

// 2. VARIABLES GLOBALES
let totalAcumulado = 0;
// Intentamos sacar el número guardado (recuerda que se guarda como texto)
let numeroGuardado = localStorage.getItem("facturaActual");

// Si existe (no es null), lo convertimos a número. Si no, empezamos en 1.
let numeroFactura = numeroGuardado ? Number(numeroGuardado) : 1;

// 3. EVENTO (El Oído del Botón)
boton.addEventListener("click", function() {
    
    // A. LEEMOS (Sacamos los valores de las cajas)
    const nombre = inputProducto.value;
    const cantidad = Number(inputCantidad.value);
    const precio = Number(inputPrecio.value);

    // B. VALIDACIÓN (El Guardia de Seguridad)
    if (nombre === "" || cantidad === 0 || precio === 0) {
        alert("¡Faltan datos!");
        return; // ¡Stop!
    }

    // C. CÁLCULOS
    const subtotal = cantidad * precio;
    totalAcumulado += subtotal; // Sumamos al total general

    // D. INYECCIÓN HTML (Escribimos en la tabla)
    // Usamos += para no borrar lo anterior
    // Usamos ${} para poner las variables en su lugar
    cuerpoTabla.innerHTML += `
        <tr>
            <td>${nombre}</td>
            <td>${cantidad}</td>
            <td>${precio.toLocaleString('es-PY')}</td>
            <td>${subtotal.toLocaleString('es-PY')}</td>
            <td>
                <button class="btn-editar" onclick="editarProducto(this, '${nombre}', ${cantidad}, ${precio}, ${subtotal})">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="btn-borrar" onclick="eliminarProducto(this, ${subtotal})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `;

    // E. ACTUALIZAR TOTAL VISIBLE
    textoTotal.innerText = totalAcumulado.toLocaleString('es-PY');
    guardarEstadoVenta();
    actualizarColorTotal();

    // F. LIMPIAR CAJAS
    inputProducto.value = "";
    inputCantidad.value = "";
    inputPrecio.value = "";
});

// 4. FUNCIÓN EXTRA: ELIMINAR
function eliminarProducto(botonEliminar, valorRestar) {
    // A. Restamos la plata del total
    totalAcumulado -= valorRestar;
    textoTotal.innerText = totalAcumulado.toLocaleString('es-PY');

    // B. Borramos la fila (Buscamos el 'tr' más cercano al botón)
    botonEliminar.closest('tr').remove();

    // C. Guardamos el cambio en la memoria
    guardarEstadoVenta();
    actualizarColorTotal();
}

// 5. FUNCIÓN NUEVA VENTA (Limpiar todo)
function nuevaVenta() {
    
    // A. Reiniciamos la memoria (la variable numérica)
    totalAcumulado = 0;
    
    // B. Actualizamos el texto del total a "0"
    textoTotal.innerText = "0";

    // C. Limpiamos la tabla (La "Casa" se queda sin muebles)
    cuerpoTabla.innerHTML = "";

    // D. Borramos los datos del cliente anterior
    document.getElementById("cliente-nombre").value = "";
    document.getElementById("cliente-ruc").value = "";
    
    // E. (Opcional) Ponemos el cursor en el nombre del cliente para escribir rápido
    document.getElementById("cliente-nombre").focus();

    // F. Sube el numero en la memoria
    numeroFactura++;

    // G. Actualiza el numero en la pantalla
    document.getElementById("factura-actual").innerText = numeroFactura

    // H. Guardamos el nuevo numero en la caja fuerte.
    localStorage.setItem("facturaActual", numeroFactura);

    guardarEstadoVenta();
    actualizarColorTotal();
}

function guardarEstadoVenta() {
    //Guardamos el HTML de las filas
    localStorage.setItem("filasGuardadas", cuerpoTabla.innerHTML);
    //Guardamos el total actual para que no se pierda la cuenta
    localStorage.setItem("totalAcumulado", totalAcumulado);
}

function actualizarColorTotal() {
    const elementoTotal = document.getElementById("total-pagar");
    const elementoIva = document.getElementById("iva-detalle"); // <--- NUEVO

    // 1. Calculamos el IVA (Total dividido 11)
    // Usamos Math.round para que no salgan decimales feos
    const calculoIva = Math.round(totalAcumulado / 11);

    // 2. Lo escribimos en pantalla con formato de puntos
    elementoIva.innerText = `Liquidación del IVA (10%): ${calculoIva.toLocaleString('es-PY')} Gs.`;

    // 3. Tu lógica de colores que ya tenías
    if (totalAcumulado > 0) {
        elementoTotal.classList.add("total-verde");
    } else {
        elementoTotal.classList.remove("total-verde");
    }
}

// Función para saltar al siguiente campo al presionar Enter
function configurarSalto(actual, siguiente) {
    actual.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita que el Enter haga cosas raras
            siguiente.focus();      // Mueve el cursor al siguiente campo
        }
    });
}

// Configuramos la "Ruta de Vuelo" del Enter
configurarSalto(inputCliente, inputRuc);
configurarSalto(inputRuc, inputProducto);
configurarSalto(inputProducto, inputCantidad);
configurarSalto(inputCantidad, inputPrecio);

// Caso especial: Del precio al botón de agregar
inputPrecio.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        boton.click(); // ¡En vez de solo saltar, que agregue el producto de una!
        inputProducto.focus(); // Y vuelve el foco al nombre del producto para el siguiente ítem
    }
});

function editarProducto(botonEditar, nombre, cant, prec, totalFila) {
    // 1. Cargamos los datos de la fila de nuevo en los inputs de arriba
    inputProducto.value = nombre;
    inputCantidad.value = cant;
    inputPrecio.value = prec;

    // 2. Usamos tu función de eliminar para limpiar la fila y restar el total
    eliminarProducto(botonEditar, totalFila);

    // 3. Llevamos el foco al primer campo para que el usuario empiece a corregir
    inputProducto.focus();
}