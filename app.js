
let URL_AJAX ='./productos.json'

let stockProductos = []
$.get(URL_AJAX, function(data, status){
    if (status ==="success") {

        
        stockProductos = data
        mostrarProductos(stockProductos)
    }
        else {
            throw new Error ("Error de Intento de GET")
        }
        })

let carritoDeCompras = JSON.parse(localStorage.getItem('carrito'))   || []

        
// obtengo elementos del dom
const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');
const DOMbotonVaciar = document.getElementById('boton-vaciar');
const selectProductos = document.getElementById('selectProductos');

selectProductos.addEventListener('change',()=>{
    console.log(selectProductos.value)
    if(selectProductos.value == 'all'){
        mostrarProductos(stockProductos)
    }else{
        mostrarProductos(stockProductos.filter(el => el.detalle == selectProductos.value))
    }
})


function mostrarProductos(array){
    contenedorProductos.innerHTML ='';
    for (const producto of array) {
        let div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML += `<div class="card">
                            <div class="card-image">
                                <img src= ${producto.imagen} >
                            </div>
                            <div>
                            <span class="card-title">${producto.nombre}</span>
                            </div>
                            <div class="card-content">
                                <p>${producto.descripcion}</p>
                                <p> $${producto.precio}</p>
                            </div>
                            <div class="card__actions">
                                <a id="boton${producto.id}" class="waves-effect waves-light btn">Agregar al carrito</a>
                                </div>
                        </div> `
        contenedorProductos.appendChild(div);
        
        let boton = document.getElementById(`boton${producto.id}`)
        actualizarCarrito()
        renderizar()
        
        boton.addEventListener('click', ()=>{
            
            agregarAlCarrito(producto.id)
        })
    }

}


function agregarAlCarrito(id) {
    
    let repetido = carritoDeCompras.find(productoR => productoR.id == id); 
    if(repetido){ /*si el producto está repetido sumalo*/
        repetido.cantidad = repetido.cantidad + 1;
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
        renderizar()
    }else{/*si no está, agregalo*/
        let productoAgregar = stockProductos.find(producto => producto.id == id); /*encuentro un objeto y lo devuelvo*/
        carritoDeCompras.push(productoAgregar);
        productoAgregar.cantidad = 1;
        actualizarCarrito()
        renderizar()
    }
    guardarCarritoEnLocalStorage();
}

const renderizar = () =>{
    contenedorCarrito.innerHTML =""
    for (stock of carritoDeCompras){
        
    let div = document.createElement('div')
    div.classList.add('productoEnCarrito')
    div.innerHTML = `<p class="colorProd">${stock.nombre}</p>
                    <p class="colorProd">Precio: ${stock.precio}</p>
                    <p class="colorProd" id="cantidad${stock.id}">cantidad: ${stock.cantidad}</p>
     <button id="eliminar${stock.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>`
    contenedorCarrito.appendChild(div)
    
    let botonEliminar = document.getElementById(`eliminar${stock.id}`)

    botonEliminar.addEventListener('click', ()=>{
        botonEliminar.parentElement.remove()
        carritoDeCompras = carritoDeCompras.filter(productoEliminado => productoEliminado.id != stock.id)
        actualizarCarrito()
        renderizar();
        guardarCarritoEnLocalStorage();
        })
    }
}

function guardarCarritoEnLocalStorage(){
localStorage.setItem('carrito', JSON.stringify(carritoDeCompras));
}


function cargarCarritoDeLocalStorage(){
    if (localStorage.getItem('carrito') !== null){
        carritoDeCompras = JSON.parse(localStorage.getItem('carrito'));
    }
}

function actualizarCarrito() {
    contadorCarrito.innerText = carritoDeCompras.reduce((acumulador, elemento)=> acumulador + elemento.cantidad,0);
    precioTotal.innerText = carritoDeCompras.reduce((acumulador,elemento)=> acumulador + (elemento.precio * elemento.cantidad),0)
}

function vaciarCarrito() {
    carritoDeCompras = [];
    renderizar();
    actualizarCarrito();
    // borrolocalstorage
    localStorage.clear(); 
}

DOMbotonVaciar.addEventListener('click', vaciarCarrito);


