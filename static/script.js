document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crudForm');
    const entitySelect = document.getElementById('entity');
    const formFields = document.getElementById('formFields');
    const recordsDiv = document.getElementById('records');
    const submitBtn = document.getElementById('submitBtn');
    const editId = document.getElementById('editId');

    const fieldTemplates = {
        celulares: `
            <div>
                <label class="block text-gray-700">Marca</label>
                <input type="text" id="marca" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label class="block text-gray-700">Modelo</label>
                <input type="text" id="modelo" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label class="block text-gray-700">Precio</label>
                <input type="number" id="precio" step="0.01" class="w-full p-2 border rounded" required>
            </div>
        `,
        clientes: `
            <div>
                <label class="block text-gray-700">Nombre</label>
                <input type="text" id="nombre" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label class="block text-gray-700">Email</label>
                <input type="email" id="email" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label class="block text-gray-700">Teléfono</label>
                <input type="text" id="telefono" class="w-full p-2 border rounded" required>
            </div>
        `,
        proveedores: `
            <div>
                <label class="block text-gray-700">Nombre</label>
                <input type="text" id="nombre" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label class="block text-gray-700">Contacto</label>
                <input type="text" id="contacto" class="w-full p-2 border rounded" required>
            </div>
            <div>
                <label class="block text-gray-700">Dirección</label>
                <input type="text" id="direccion" class="w-full p-2 border rounded" required>
            </div>
        `
    };

    // Función para cargar y mostrar registros en tabla
    const loadRecords = async (entity) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/${entity}`);
            const data = await response.json();
            let html = `
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-blue-500 text-white">
                            <th class="p-2 border">ID</th>
                            <th class="p-2 border">Datos</th>
                            <th class="p-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.forEach(item => {
                html += `
                    <tr class="border">
                        <td class="p-2 border">${item.id}</td>
                        <td class="p-2 border">${Object.values(item).slice(1).join(', ')}</td>
                        <td class="p-2 border">
                            <button class="edit-btn bg-yellow-500 text-white p-1 rounded mr-2" data-id="${item.id}">Editar</button>
                            <button class="delete-btn bg-red-500 text-white p-1 rounded" data-id="${item.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
            recordsDiv.innerHTML = html;

            // Agregar eventos a los botones de edición y eliminación
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editRecord(entity, btn.dataset.id));
            });
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteRecord(entity, btn.dataset.id));
            });
        } catch (error) {
            console.error('Error al cargar registros:', error);
            recordsDiv.innerHTML = '<p class="text-red-500">Error al cargar los registros.</p>';
        }
    };

    // Función para editar registro
    const editRecord = async (entity, id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/${entity}/${id}`);
            const item = await response.json();
            formFields.innerHTML = fieldTemplates[entity];
            editId.value = id;
            switch (entity) {
                case 'celulares':
                    document.getElementById('marca').value = item.marca;
                    document.getElementById('modelo').value = item.modelo;
                    document.getElementById('precio').value = item.precio;
                    break;
                case 'clientes':
                    document.getElementById('nombre').value = item.nombre;
                    document.getElementById('email').value = item.email;
                    document.getElementById('telefono').value = item.telefono;
                    break;
                case 'proveedores':
                    document.getElementById('nombre').value = item.nombre;
                    document.getElementById('contacto').value = item.contacto;
                    document.getElementById('direccion').value = item.direccion;
                    break;
            }
            submitBtn.textContent = 'Actualizar';
        } catch (error) {
            console.error('Error al cargar registro para edición:', error);
            alert('Error al cargar el registro para edición');
        }
    };

    // Función para eliminar registro
    const deleteRecord = async (entity, id) => {
        if (confirm('¿Estás seguro de eliminar este registro?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/${entity}/${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                alert(result.message);
                loadRecords(entity); // Recargar la lista después de eliminar
            } catch (error) {
                console.error('Error al eliminar registro:', error);
                alert('Error al eliminar el registro');
            }
        }
    };

    // Cambiar campos según la entidad seleccionada
    entitySelect.addEventListener('change', () => {
        formFields.innerHTML = fieldTemplates[entitySelect.value];
        editId.value = '';
        submitBtn.textContent = 'Enviar';
        loadRecords(entitySelect.value);
    });

    // Manejar el envío del formulario (crear o actualizar)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const entity = entitySelect.value;
        let url = `http://127.0.0.1:8000/${entity}`;
        let method = editId.value ? 'PUT' : 'POST';
        if (editId.value) url += `/${editId.value}`;

        let params = new URLSearchParams();
        switch (entity) {
            case 'celulares':
                params.append('marca', document.getElementById('marca').value);
                params.append('modelo', document.getElementById('modelo').value);
                params.append('precio', document.getElementById('precio').value);
                break;
            case 'clientes':
                params.append('nombre', document.getElementById('nombre').value);
                params.append('email', document.getElementById('email').value);
                params.append('telefono', document.getElementById('telefono').value);
                break;
            case 'proveedores':
                params.append('nombre', document.getElementById('nombre').value);
                params.append('contacto', document.getElementById('contacto').value);
                params.append('direccion', document.getElementById('direccion').value);
                break;
        }

        // Construir la URL con parámetros de consulta
        url += '?' + params.toString();

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // Opcional, ya que usamos query params
            });
            const result = await response.json();
            alert(result.message);
            form.reset();
            formFields.innerHTML = '';
            editId.value = '';
            submitBtn.textContent = 'Enviar';
            loadRecords(entity);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar la solicitud');
        }
    });

    // Cargar campos y registros iniciales
    entitySelect.dispatchEvent(new Event('change'));
});