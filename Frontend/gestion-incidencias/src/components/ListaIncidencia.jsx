import React from 'react';

const ListaIncidencias = ({ incidencias, alEliminar}) => {
    return (
        <div className="card shadow-sm p-4">
            <h2 className="mb-4">Panel de control</h2>
            <table className="table table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {incidencias.map(inc => (
                        <tr key={inc.id}>
                            <td>{inc.titulo}</td>
                            <td>{inc.descripcion}</td>
                            <td>
                                <span className={`badge ${inc.estado === 'PENDIENTE' ? 'bg-warning' : 'bg-success'}`}>
                                    {inc.estado}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={()=> alEliminar(inc.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ListaIncidencias;