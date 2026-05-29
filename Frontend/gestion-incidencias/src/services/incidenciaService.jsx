import api from '../api/axios';

export const getIncidencias = async () => {
    const response = await api.get('incidencias');
    return response.data;

};

//Método para crear una nueva incidencia
export const createIncidencia = async (incidencia) => {
    const response = await api.post('/incidencias', incidencia);
    return response.data;
};

//Métofo para eliminar incidencia
export const deleteIncidencia = async (id) => {
    await api.delete (`/incidencias/${id}`);

};

//Método para actualizar una incidencia
export const updateIncidencia = async (id, incidencia) => {
    const response = await api.put(`/incidencias/${id}`, incidencia);
    return response.data;
};