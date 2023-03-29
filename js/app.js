let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Pasteles'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente')
btnGuardarCliente.addEventListener('click', guardarCliente)

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value
    const camposVacios = [mesa, hora].some(e => e === '')

    if(camposVacios){
        const existeAlerta = document.querySelector('.invalid-feedback')
        if(!existeAlerta){
            const alerta = document.createElement('div')
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center')
            alerta.textContent = 'Todos los campos son obligatorios'
            document.querySelector('.modal-body').appendChild(alerta)

            setTimeout(() => {
                alerta.remove()
            }, 3000)
        }
        return;        
    }
    // Asignar datos del formulario
    cliente = {...cliente, mesa, hora}

    // ocultar modal
    const modalFormulario = document.querySelector('#formulario')
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario)
    modalBootstrap.hide()

    // mostrar secciones ocultas
    mostrarSecciones()

    obtenerPlatillos()
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none')
    seccionesOcultas.forEach(e => e.classList.remove('d-none'))
}

function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos'
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido')
    platillos.forEach(platillo => {
        const {nombre, precio, categoria, id} = platillo;
        const row = document.createElement('div')
        row.classList.add('row', 'py-3', 'border-top')

        const nombrePlatillo = document.createElement('div')
        nombrePlatillo.classList.add('col-md-4')
        nombrePlatillo.textContent = nombre

        const precioPlatillo = document.createElement('div')
        precioPlatillo.classList.add('col-md-3', 'fw-bold')
        precioPlatillo.textContent = `$${precio}`

        const categoriaPlatillo = document.createElement('div')
        categoriaPlatillo.classList.add('col-md-3')
        categoriaPlatillo.textContent = categorias[categoria]

        const inputCantidad = document.createElement('input')
        inputCantidad.type = 'number'
        inputCantidad.min = 0
        inputCantidad.id = `producto-${id}`
        inputCantidad.value = 0
        inputCantidad.classList.add('form-control')

        // detectar el cambio de número y asociarlo con el id del platillo que lo genero
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value)
            agregarPlatillo({...platillo, cantidad})
        }

        const agregar = document.createElement('div')
        agregar.classList.add('col-md-2')
        agregar.appendChild(inputCantidad)

        row.appendChild(nombrePlatillo)
        row.appendChild(precioPlatillo)
        row.appendChild(categoriaPlatillo)
        row.appendChild(agregar)

        contenido.appendChild(row)
    })
}

function agregarPlatillo(producto){
    let {pedido} = cliente

    //revisar que la cantidad sea mayor a 0
    if(producto.cantidad > 0){
        // comprueba si existe el array
        if(pedido.some(articulo => articulo.id === producto.id)){
            // como ya existe, actualizamos la cantidad
            const pedidoActualizado = pedido.map(articulo => {
                if(articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad
                }
                return articulo
            })
            // asignar el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado]
        }else{
            cliente.pedido = [...pedido, producto]
        }
    }else{
        // eliminar producto del pedido cuando sea 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id)
        cliente.pedido = [...resultado]
    }
    limpiarHtml()

    if(cliente.pedido.length){
        actualizarResumen()        
    }else{
        limpiarHtml()
        mensajePedidoVacio()
    }
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido')
    
    const resumen = document.createElement('div')
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow')

    const mesa = document.createElement('p')
    mesa.classList.add('fw-bold')
    mesa.textContent = 'Mesa: '

    const mesaSpan = document.createElement('span')
    mesaSpan.classList.add('fw-normal')
    mesaSpan.textContent = cliente.mesa

    const hora = document.createElement('p')
    hora.classList.add('fw-bold')
    hora.textContent = 'hora: '

    const horaSpan = document.createElement('span')
    horaSpan.classList.add('fw-normal')
    horaSpan.textContent = cliente.hora

    mesa.appendChild(mesaSpan)
    hora.appendChild(horaSpan)

    // titulo de la sección
    const heading = document.createElement('h3')
    heading.classList.add('my-4', 'text-center')
    heading.textContent = 'Platillos Consumidos'

    // iterar sobre array de pedidos
    const grupo = document.createElement('ul')
    grupo.classList.add('list-group')

    const {pedido} = cliente
    pedido.forEach(articulo => {
        const {nombre, precio, cantidad, id} = articulo
        const lista = document.createElement('li')
        lista.classList.add('list-group-item')

        const nombreElement = document.createElement('h4')
        nombreElement.classList.add('my-4')
        nombreElement.textContent = nombre

        // cantidad del articulo
        const cantidadElement = document.createElement('p')
        cantidadElement.classList.add('fw-bold')
        cantidadElement.textContent = 'Cantidad: '

        const cantidadValor = document.createElement('span')
        cantidadValor.classList.add('fw-normal')
        cantidadValor.textContent = cantidad
        cantidadElement.appendChild(cantidadValor)

        // precio del articulo
        const precioElement = document.createElement('p')
        precioElement.classList.add('fw-bold')
        precioElement.textContent = 'Precio: '

        const precioValor = document.createElement('span')
        precioValor.classList.add('fw-normal')
        precioValor.textContent = `$${precio}`
        precioElement.appendChild(precioValor)

        // subtotal
        const subTotalElement = document.createElement('p')
        subTotalElement.classList.add('fw-bold')
        subTotalElement.textContent = 'Sub-Total: '

        const subTotalValor = document.createElement('span')
        subTotalValor.classList.add('fw-normal')
        subTotalValor.textContent = calcularSubtotal(precio, cantidad)
        subTotalElement.appendChild(subTotalValor)

        // boton eliminar
        const btnEliminar = document.createElement('button')
        btnEliminar.classList.add('btn', 'btn-danger')
        btnEliminar.textContent = 'Eliminar del Pedido'

        // funcion para eliminar del pedido
        btnEliminar.onclick = function(){
            eliminarProoducto(id)
        }


        lista.appendChild(nombreElement)
        lista.appendChild(cantidadElement)
        lista.appendChild(precioElement)
        lista.appendChild(subTotalElement)
        lista.appendChild(btnEliminar)

        grupo.appendChild(lista)
    })


    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(heading)
    resumen.appendChild(grupo)
    contenido.appendChild(resumen)
}

function limpiarHtml(){
    const contenido = document.querySelector('#resumen .contenido')
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild)
    }
}

function calcularSubtotal(precio, cantidad){
    return `$${precio * cantidad}`
}

function eliminarProoducto(id){
    const {pedido} = cliente
    const resultado = pedido.filter(articulo => articulo.id !== id)
    cliente.pedido = [...resultado]
    limpiarHtml()
    if(cliente.pedido.length){
        actualizarResumen()        
    }else{
        limpiarHtml()
        mensajePedidoVacio()
    }

    // regresar cantidad a 0 en el form
    const productoEliminado = `#producto-${id}`
    const inputEliminado = document.querySelector(productoEliminado)
    inputEliminado.value = 0
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido')
    const texto = document.createElement('p')
    texto.classList.add('text-center')
    texto.textContent = 'Añade los elementos del pedido'
    contenido.appendChild(texto)
}