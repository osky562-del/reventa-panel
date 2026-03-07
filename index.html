// Cargar datos guardados
let movimientos = JSON.parse(localStorage.getItem('vrixo_data')) || [];

window.onload = () => {
    // Poner fecha de hoy por defecto en los inputs
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('g-fecha').value = hoy;
    document.getElementById('v-fecha').value = hoy;
    actualizarInterfaz();
};

// Función para registrar la compra del lote + su envío
function registrarGasto() {
    const fecha = document.getElementById('g-fecha').value;
    const concepto = document.getElementById('g-concepto').value;
    const costeLote = parseFloat(document.getElementById('g-coste-lote').value) || 0;
    const costeEnvio = parseFloat(document.getElementById('g-coste-envio').value) || 0;
    const plataforma = document.getElementById('g-plataforma').value;

    if (!concepto || (costeLote + costeEnvio) <= 0) {
        alert("Pon un nombre al lote y su precio");
        return;
    }

    // Sumamos ambos para tener la inversión total de ese movimiento
    const inversionTotal = costeLote + costeEnvio;

    movimientos.push({
        id: Date.now(),
        fecha,
        concepto: `📦 COMPRA: ${concepto}`,
        plataforma,
        gasto: inversionTotal,
        ingreso: 0
    });

    guardarYRefrescar();
    // Limpiar campos
    document.getElementById('g-concepto').value = "";
    document.getElementById('g-coste-lote').value = "";
    document.getElementById('g-coste-envio').value = "";
}

// Función para registrar la venta de cada uno de los 40 productos
function registrarVenta() {
    const fecha = document.getElementById('v-fecha').value;
    const producto = document.getElementById('v-producto').value;
    const precio = parseFloat(document.getElementById('v-precio').value) || 0;
    const plataforma = document.getElementById('v-plataforma').value;

    if (!producto || precio <= 0) {
        alert("Pon el nombre del producto vendido y el precio");
        return;
    }

    movimientos.push({
        id: Date.now(),
        fecha,
        concepto: `💰 VENTA: ${producto}`,
        plataforma,
        gasto: 0,
        ingreso: precio
    });

    guardarYRefrescar();
    document.getElementById('v-producto').value = "";
    document.getElementById('v-precio').value = "";
}

function borrarDato(id) {
    if (confirm("¿Borrar este registro?")) {
        movimientos = movimientos.filter(m => m.id !== id);
        guardarYRefrescar();
    }
}

function guardarYRefrescar() {
    localStorage.setItem('vrixo_data', JSON.stringify(movimientos));
    actualizarInterfaz();
}

function actualizarInterfaz() {
    const tabla = document.getElementById('tabla-cuerpo');
    let totalG = 0;
    let totalI = 0;
    tabla.innerHTML = "";

    // Ordenar por fecha (reciente arriba)
    movimientos.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).forEach(m => {
        totalG += m.gasto;
        totalI += m.ingreso;

        tabla.innerHTML += `
            <tr>
                <td>${m.fecha}</td>
                <td>${m.concepto}</td>
                <td>${m.plataforma}</td>
                <td style="color:red">${m.gasto > 0 ? '-' + m.gasto.toFixed(2) + '€' : ''}</td>
                <td style="color:green">${m.ingreso > 0 ? '+' + m.ingreso.toFixed(2) + '€' : ''}</td>
                <td><button onclick="borrarDato(${m.id})" style="color:red; cursor:pointer">X</button></td>
            </tr>
        `;
    });

    // Actualizar cabecera
    document.getElementById('total-inversion').innerText = totalG.toFixed(2) + "€";
    document.getElementById('total-recuperado').innerText = totalI.toFixed(2) + "€";
    
    const balance = totalI - totalG;
    const elBalance = document.getElementById('estado-beneficio');
    elBalance.innerText = balance.toFixed(2) + "€";
    elBalance.style.color = balance >= 0 ? "#16a34a" : "#dc2626";
}
