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
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow')

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

    resumen.appendChild(heading)
    resumen.appendChild(mesa)
    resumen.appendChild(hora)
    resumen.appendChild(grupo)
    contenido.appendChild(resumen)

    // mostrar propinas
    mostrarPropinas()
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

function mostrarPropinas(){
    const contenido = document.querySelector('#resumen .contenido')
    const formulario = document.createElement('div')
    formulario.classList.add('col-md-6', 'formulario')

    const divFormulario = document.createElement('div')
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow')

    const heading = document.createElement('h3')
    heading.classList.add('my-4', 'text-center')
    heading.textContent = 'Propina'

    // radio 10%
    const radio10 = document.createElement('input')
    radio10.type = 'radio'
    radio10.name = 'propina'
    radio10.value = '10'
    radio10.classList.add('form-check-input')

    const radio10Label = document.createElement('label')
    radio10Label.textContent = '10%'
    radio10Label.classList.add('form-check-label')

    const radio10Div = document.createElement('div')
    radio10Div.classList.add('form-check')
    radio10Div.appendChild(radio10Label)
    radio10Div.appendChild(radio10)
    radio10.onclick = calcularPropina

    // radio 20%
    const radio20 = document.createElement('input')
    radio20.type = 'radio'
    radio20.name = 'propina'
    radio20.value = '20'
    radio20.classList.add('form-check-input')

    const radio20Label = document.createElement('label')
    radio20Label.textContent = '20%'
    radio20Label.classList.add('form-check-label')

    const radio20Div = document.createElement('div')
    radio20Div.classList.add('form-check')
    radio20Div.appendChild(radio20Label)
    radio20Div.appendChild(radio20)
    radio20.onclick = calcularPropina

    // radio 50%
    const radio50 = document.createElement('input')
    radio50.type = 'radio'
    radio50.name = 'propina'
    radio50.value = '50'
    radio50.classList.add('form-check-input')

    const radio50Label = document.createElement('label')
    radio50Label.textContent = '50%'
    radio50Label.classList.add('form-check-label')

    const radio50Div = document.createElement('div')
    radio50Div.classList.add('form-check')
    radio50Div.appendChild(radio50Label)
    radio50Div.appendChild(radio50)
    radio50.onclick = calcularPropina

    divFormulario.appendChild(heading)
    formulario.appendChild(divFormulario)
    divFormulario.appendChild(radio10Div)
    divFormulario.appendChild(radio20Div)
    divFormulario.appendChild(radio50Div)

    contenido.appendChild(formulario)
}

function calcularPropina(){
    const {pedido} = cliente
    let subTotal = 0

    pedido.forEach(articulo => {
        subTotal += articulo.cantidad * articulo.precio
    })
    
    const propinaSeleccionada = document.querySelector('[name=propina]:checked').value

    const propina = ((subTotal * parseInt(propinaSeleccionada)) / 100)

    const totalPagar = subTotal + propina

    mostrarTotalHtml(subTotal, totalPagar, propina)
}

function mostrarTotalHtml(subTotal, totalPagar, propina){
    const divTotales = document.createElement('div')
    divTotales.classList.add('total-pagar')

    // subtotal
    const subTotalParrafo = document.createElement('p')
    subTotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2')
    subTotalParrafo.textContent = 'Subtotal Consumo: '

    const subTotalSpan = document.createElement('span')
    subTotalSpan.classList.add('fw-normal')
    subTotalSpan.textContent = `$${subTotal}`

    subTotalParrafo.appendChild(subTotalSpan)

    // propina
    const propinaParrafo = document.createElement('p')
    propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-2')
    propinaParrafo.textContent = 'Propina: '

    const propinaSpan = document.createElement('span')
    propinaSpan.classList.add('fw-normal')
    propinaSpan.textContent = `$${propina}`

    propinaParrafo.appendChild(propinaSpan)

    // propina
    const totalParrafo = document.createElement('p')
    totalParrafo.classList.add('fs-3', 'fw-bold', 'mt-2')
    totalParrafo.textContent = 'Total: '

    const totalSpan = document.createElement('span')
    totalSpan.classList.add('fw-normal')
    totalSpan.textContent = `$${totalPagar}`

    totalParrafo.appendChild(totalSpan)

    // eliminar ultimo resultado
    const totalPagarDiv = document.querySelector('.total-pagar')
    if(totalPagarDiv){
        totalPagarDiv.remove()
    }

    divTotales.appendChild(subTotalParrafo)
    divTotales.appendChild(propinaParrafo)
    divTotales.appendChild(totalParrafo)

    const formulario = document.querySelector('.formulario > div')
    formulario.appendChild(divTotales)
}