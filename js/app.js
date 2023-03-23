let cliente = {
    mesa: '',
    hora: '',
    platillos: []
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
        .then(resultado => console.log(resultado))
}