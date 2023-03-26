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

function agregarPlatillo(platillo){
    console.log(platillo)
}