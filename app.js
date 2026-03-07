let compras = JSON.parse(localStorage.getItem('vrixo_compras')) || [];
let ventas = JSON.parse(localStorage.getItem('vrixo_ventas')) || [];

window.onload = () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('g-fecha').value = hoy;
    document.getElementById('v-fecha').value = hoy;
    actualizarInterfaz();
};

function registrarCompra() {
    const fecha = document.getElementById('g-fecha').value;
    const nombre = document.getElementById('g-concepto').value;
    const coste = parseFloat(document.getElementById('g-coste').value) || 0;
    const envio = parseFloat(document.getElementById('g-envio').value) || 0;

    if (!nombre || (coste + envio) <= 0) return alert("Datos de compra incompletos");

    compras.push({
        id: Date.now().toString(),
        fecha,
        nombre,
        totalInvertido: coste + envio
    });

    guardarYRefrescar();
    document.getElementById('g-concepto').value = "";
    document.getElementById('g-coste').value = "";
    document.getElementById('g-envio').value = "";
}

function registrarVenta() {
    const fecha = document.getElementById('v-fecha').value;
    const nombre = document.getElementById('v-producto').value;
    const precio = parseFloat(document.getElementById('v-precio').value) || 0;
    const vinculo = document.getElementById('v-vinculo').value; // ID de la compra o "suelto"

    if (!nombre || precio <= 0) return alert("Datos de venta incompletos");

    ventas.push({
        id: Date.now().toString(),
        fecha,
        nombre,
        precio,
        vinculo // Aquí guardamos si es de un lote específico
    });

    guardarYRefrescar();
    document.getElementById('v-producto').value = "";
    document.getElementById('v-precio').value = "";
}

function borrarDato(tipo, id) {
    if (confirm("¿Borrar registro?")) {
        if (tipo === 'c') compras = compras.filter(c => c.id !== id);
        else ventas = ventas.filter(v => v.id !== id);
        guardarYRefrescar();
    }
}

function guardarYRefrescar() {
    localStorage.setItem('vrixo_compras', JSON.stringify(compras));
    localStorage.setItem('vrixo_ventas', JSON.stringify(ventas));
    actualizarInterfaz();
}

function actualizarInterfaz() {
    const tabla = document.getElementById('tabla-cuerpo');
    const selector = document.getElementById('v-vinculo');
    tabla.innerHTML = "";
    
    // Limpiar y rellenar el selector de lotes
    selector.innerHTML = '<option value="suelto">Es una venta suelta (Sin lote)</option>';
    compras.forEach(c => {
        selector.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });

    let inversionTotal = 0;
    let ventasTotales = 0;

    // 1. Mostrar Compras/Lotes en la tabla
    compras.forEach(c => {
        inversionTotal += c.totalInvertido;
        // Calcular cuánto se ha recuperado DE ESTE LOTE
        const recuperadoLote = ventas.filter(v => v.vinculo === c.id).reduce((acc, curr) => acc + curr.precio, 0);
        const estadoLote = recuperadoLote - c.totalInvertido;

        tabla.innerHTML += `
            <tr style="background: #fef2f2">
                <td>${c.fecha}</td>
                <td><strong>📦 COMPRA: ${c.nombre}</strong></td>
                <td>-${c.totalInvertido.toFixed(2)}€</td>
                <td>Recuperado: ${recuperadoLote.toFixed(2)}€</td>
                <td style="color:${estadoLote >= 0 ? 'green' : 'red'}">${estadoLote.toFixed(2)}€</td>
                <td><button onclick="borrarDato('c', '${c.id}')">X</button></td>
            </tr>
        `;
    });

    // 2. Mostrar Ventas en la tabla
    ventas.forEach(v => {
        ventasTotales += v.precio;
        const esSuelto = v.vinculo === "suelto";
        
        tabla.innerHTML += `
            <tr>
                <td>${v.fecha}</td>
                <td>💰 VENTA: ${v.nombre} ${esSuelto ? '(Suelto)' : ''}</td>
                <td>---</td>
                <td style="color:green">+${v.precio.toFixed(2)}€</td>
                <td>---</td>
                <td><button onclick="borrarDato('v', '${v.id}')">X</button></td>
            </tr>
        `;
    });

    // Actualizar Header
    document.getElementById('total-inversion').innerText = inversionTotal.toFixed(2) + "€";
    document.getElementById('total-recuperado').innerText = ventasTotales.toFixed(2) + "€";
    const balance = ventasTotales - inversionTotal;
    const elBeneficio = document.getElementById('estado-beneficio');
    elBeneficio.innerText = balance.toFixed(2) + "€";
    elBeneficio.style.color = balance >= 0 ? "green" : "red";
}
