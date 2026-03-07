let movimientos = JSON.parse(localStorage.getItem('vrixo_data')) || [];
let miChart = null;

window.onload = () => {
    document.getElementById('fecha').valueAsDate = new Date();
    // Seleccionar mes actual por defecto
    document.getElementById('filtro-mes').value = new Date().getMonth();
    actualizarInterfaz();
};

function agregarMovimiento() {
    const f = document.getElementById('fecha').value;
    const c = document.getElementById('concepto').value;
    const i = parseFloat(document.getElementById('importe').value);
    const p = document.getElementById('plataforma').value;
    const t = document.getElementById('tipo').value;

    if (!f || !c || isNaN(i)) return alert("Datos incompletos");

    movimientos.push({ id: Date.now(), fecha: f, concepto: c, plataforma: p, importe: i, tipo: t });
    localStorage.setItem('vrixo_data', JSON.stringify(movimientos));
    
    document.getElementById('concepto').value = "";
    document.getElementById('importe').value = "";
    actualizarInterfaz();
}

function borrarMovimiento(id) {
    if (confirm("¿Borrar?")) {
        movimientos = movimientos.filter(m => m.id !== id);
        localStorage.setItem('vrixo_data', JSON.stringify(movimientos));
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    const tabla = document.getElementById('tabla-cuerpo');
    const filtroMes = document.getElementById('filtro-mes').value;
    const busqueda = document.getElementById('buscador').value.toLowerCase();
    
    let tGastos = 0, tIngresos = 0;
    tabla.innerHTML = "";

    // Filtrar datos
    const filtrados = movimientos.filter(m => {
        const fechaM = new Date(m.fecha);
        const coincideMes = (filtroMes === "todos" || fechaM.getMonth() == filtroMes);
        const coincideBusqueda = m.concepto.toLowerCase().includes(busqueda) || m.plataforma.toLowerCase().includes(busqueda);
        return coincideMes && coincideBusqueda;
    });

    filtrados.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).forEach(m => {
        m.tipo === 'gasto' ? tGastos += m.importe : tIngresos += m.importe;
        tabla.innerHTML += `
            <tr>
                <td>${new Date(m.fecha).toLocaleDateString()}</td>
                <td>${m.concepto}</td>
                <td>${m.plataforma}</td>
                <td class="txt-${m.tipo}">${m.importe.toFixed(2)}€</td>
                <td>${m.tipo === 'gasto' ? '📉 GASTO' : '📈 VENTA'}</td>
                <td><button class="btn-del" onclick="borrarMovimiento(${m.id})">Borrar</button></td>
            </tr>`;
    });

    document.getElementById('total-gastos').innerText = tGastos.toFixed(2) + "€";
    document.getElementById('total-ingresos').innerText = tIngresos.toFixed(2) + "€";
    document.getElementById('beneficio-total').innerText = (tIngresos - tGastos).toFixed(2) + "€";

    renderizarGrafica(filtrados);
}

function renderizarGrafica(datos) {
    const ctx = document.getElementById('miGrafica').getContext('2d');
    const resumen = {};
    
    datos.sort((a,b) => new Date(a.fecha) - new Date(b.fecha)).forEach(m => {
        resumen[m.fecha] = (resumen[m.fecha] || 0) + (m.tipo === 'ingreso' ? m.importe : -m.importe);
    });

    if (miChart) miChart.destroy();
    miChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(resumen),
            datasets: [{
                label: 'Balance Diario (€)',
                data: Object.values(resumen),
                backgroundColor: Object.values(resumen).map(v => v >= 0 ? '#16a34a' : '#dc2626')
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function exportarExcel() {
    let csv = "Fecha;Concepto;Plataforma;Importe;Tipo\ufeff\n";
    movimientos.forEach(m => csv += `${m.fecha};${m.concepto};${m.plataforma};${m.importe};${m.tipo}\n`);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: 'text/csv' }));
    link.download = "Vrixo_Reporte.csv";
    link.click();
}
