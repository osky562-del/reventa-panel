// Base de datos local
let movimientos = JSON.parse(localStorage.getItem('vrixo_data')) || [];

// Al iniciar
window.onload = () => {
    document.getElementById('fecha').valueAsDate = new Date();
    actualizarInterfaz();
};

// Guardar nuevo dato
function agregarMovimiento() {
    const fecha = document.getElementById('fecha').value;
    const concepto = document.getElementById('concepto').value;
    const importe = parseFloat(document.getElementById('importe').value);
    const plataforma = document.getElementById('plataforma').value;
    const tipo = document.getElementById('tipo').value;

    if (!fecha || !concepto || isNaN(importe)) {
        alert("⚠️ Por favor, rellena todos los campos correctamente.");
        return;
    }

    const nuevo = { id: Date.now(), fecha, concepto, plataforma, importe, tipo };
    movimientos.push(nuevo);
    
    guardarYActualizar();
    
    // Limpiar formulario
    document.getElementById('concepto').value = "";
    document.getElementById('importe').value = "";
}

// Borrar dato único
function borrarMovimiento(id) {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
        movimientos = movimientos.filter(m => m.id !== id);
        guardarYActualizar();
    }
}

// Guardar en Navegador y Refrescar vista
function guardarYActualizar() {
    localStorage.setItem('vrixo_data', JSON.stringify(movimientos));
    actualizarInterfaz();
}

// Dibujar tabla y calcular totales
function actualizarInterfaz() {
    const tabla = document.getElementById('tabla-cuerpo');
    let totalGastos = 0;
    let totalIngresos = 0;
    
    tabla.innerHTML = "";

    // Ordenar por fecha (más reciente arriba)
    const datosOrdenados = [...movimientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    datosOrdenados.forEach(m => {
        if (m.tipo === 'gasto') totalGastos += m.importe;
        else totalIngresos += m.importe;

        tabla.innerHTML += `
            <tr>
                <td>${new Date(m.fecha).toLocaleDateString()}</td>
                <td>${m.concepto}</td>
                <td><small>${m.plataforma}</small></td>
                <td class="txt-${m.tipo}">${m.importe.toFixed(2)}€</td>
                <td>${m.tipo === 'gasto' ? '📉 GASTO' : '📈 VENTA'}</td>
                <td><button class="btn-del" onclick="borrarMovimiento(${m.id})">Borrar</button></td>
            </tr>
        `;
    });

    document.getElementById('total-gastos').innerText = totalGastos.toFixed(2) + "€";
    document.getElementById('total-ingresos').innerText = totalIngresos.toFixed(2) + "€";
    document.getElementById('beneficio-total').innerText = (totalIngresos - totalGastos).toFixed(2) + "€";
}

// Exportar a CSV compatible con Excel
function exportarExcel() {
    if (movimientos.length === 0) return alert("No hay datos");

    let csvContent = "Fecha;Concepto;Plataforma;Importe;Tipo\ufeff\n"; 
    movimientos.forEach(m => {
        csvContent += `${m.fecha};${m.concepto};${m.plataforma};${m.importe.toFixed(2).replace('.', ',')};${m.tipo}\n`;
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vrixo_Contabilidad_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
}
