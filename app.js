import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBphY_jaOOOVOzwzfoXE78_iDVOQYRhA2o",
  authDomain: "control-de-gastos-39154.firebaseapp.com",
  projectId: "control-de-gastos-39154",
  storageBucket: "control-de-gastos-39154.firebasestorage.app",
  messagingSenderId: "845236944662",
  appId: "1:845236944662:web:897201644eaf708afd5a37"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.guardarVenta = async function(){

let producto = document.getElementById("producto").value
let coste = Number(document.getElementById("coste").value)
let venta = Number(document.getElementById("venta").value)
let envio = Number(document.getElementById("envio").value)

let beneficio = venta - coste - envio

await addDoc(collection(db,"ventas"),{
producto,
coste,
venta,
envio,
beneficio,
fecha: new Date()
})

cargarVentas()

}

async function cargarVentas(){

let tabla = document.getElementById("tabla")
tabla.innerHTML=""

let total=0

const querySnapshot = await getDocs(collection(db,"ventas"))

querySnapshot.forEach((doc)=>{

let v = doc.data()

total += v.beneficio

tabla.innerHTML+=`
<tr>
<td>${v.producto}</td>
<td>${v.coste}€</td>
<td>${v.venta}€</td>
<td>${v.beneficio}€</td>
</tr>
`

})

document.getElementById("beneficio").innerText = total+"€"

}

cargarVentas()