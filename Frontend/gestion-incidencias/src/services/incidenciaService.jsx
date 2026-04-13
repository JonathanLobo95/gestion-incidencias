const API_URL = "http://localhost:8080/api/incidencias";

export const getIncidencias = async () => {
    const response = await fetch(API_URL);
    if(!response.ok) throw new Error ("Error al obtener incidencias");
    return await response.json();

};

export const createIncidencia = async (incidencia) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(incidencia)
    });
    if(!response.ok) throw new Error ("Error al crear la incidencia");
    return await response.json();
}

export const deleteIncidencia = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};

export const updateIncidencia = async (id, incidencia) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidencia)

    });
    if(!response.ok) throw new Error ("Error al actualizar la incidencia");
    return await response.json();
};