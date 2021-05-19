let tagNombre = document.getElementById('nombre-perfil');

tagNombre.addEventListener('click',onClick);

function onClick(e) {
    let nombre;
    nombre = 'Adry Salgado';

    e.target.innerText = nombre;
}