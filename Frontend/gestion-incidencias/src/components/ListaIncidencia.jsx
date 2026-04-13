import React from 'react';

const ListaIncidencia = ({ incidencias, alEliminar, alCambiarEstado }) => {
    
    // Función para asignar color según el estado
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'PENDIENTE': return 'bg-danger';   // Rojo
            case 'EN_PROCESO': return 'bg-warning text-dark'; // Amarillo
            case 'RESUELTA': return 'bg-success';  // Verde
            default: return 'bg-secondary';
        }
    };

    if (incidencias.length === 0) {
        return (
            <div className="alert alert-info text-center shadow-sm">
                No hay incidencias que coincidan con el filtro. 
            </div>
        );
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 g-3">
            {incidencias.map(inc => (
                <div className="col" key={inc.id}>
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0 pt-3">
                            <span className={`badge rounded-pill ${getBadgeClass(inc.estado)}`}>
                                {inc.estado.replace('_', ' ')}
                            </span>
                            <small className="text-muted">ID: #{inc.id}</small>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title fw-bold text-dark">{inc.titulo}</h5>
                            <p className="card-text text-secondary" style={{ fontSize: '0.9rem' }}>
                                {inc.descripcion}
                            </p>
                        </div>
                        <div className="card-footer bg-white border-top-0 pb-3 d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                📅 {new Date(inc.fechaCreacion).toLocaleDateString()}
                            </small>
                            <button 
                                className="btn btn-outline-danger btn-sm border-0"
                                onClick={() => alEliminar(inc.id)}
                                title="Eliminar incidencia"
                            >
                                🗑️ Borrar
                            </button>
                            {/* BOTÓN DE CAMBIO DE ESTADO */}
                                {inc.estado !== 'RESUELTA' && (
                                    <button
                                        className="className={`btn btn-sm shadow-sm ${inc.estado === 'PENDIENTE' ? 'btn-outline-warning' : 'btn-outline-success'}`}"
                                        onClick={() => alCambiarEstado}
                                    >
                                        {inc.estado === 'PENDIENTE' ? 'Atender' : '✅ Resolver'}
                                    </button>
                                )}
                        </div>
                        <small clasName="text-muted" style={{fontSize: 'o.75rem'}}>
                            📅 {new Date(inc.fechaCreacion).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListaIncidencia;