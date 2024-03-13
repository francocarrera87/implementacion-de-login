let socket;

document.addEventListener('DOMContentLoaded', () => {
    socket = io();

    const itemNombre = document.getElementById('itemNombre');
    const itemApellido = document.getElementById('itemApellido');
    const itemCorreo = document.getElementById('itemCorreo');
    const itemGenero = document.getElementById('itemGenero');
    const createItemButton = document.getElementById('createItemButton');
    const tbodyId = document.getElementById('tbodyId');

    createItemButton.addEventListener('click', () => {
        socket.emit('new item', {
            nombre: itemNombre.value,
            apellido: itemApellido.value,
            correo: itemCorreo.value,
            genero: itemGenero.value
        });

        itemNombre.value = '';
        itemApellido.value = '';
        itemCorreo.value = '';
        itemGenero.value = '';
    });

    socket.on('list updated', (items) => {
        updateTable(items);
    });
});

function updateTable(items) {
    const tbodyId = document.getElementById('tbodyId');
    tbodyId.innerHTML = "";

    if (Array.isArray(items)) {
        items.forEach(item => {
            tbodyId.innerHTML += `
                <tr>
                    <td>${item._id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.apellido}</td>
                    <td>${item.correo}</td>
                    <td>${item.genero}</td>
                    <td><button onclick="deleteItem('${item._id}')">delete</button></td>
                </tr>
            `;
        });
    }
}

// Función para eliminar un ítem por su ID
function deleteItem(id) {
    socket.emit('delete item', { id: id });
}