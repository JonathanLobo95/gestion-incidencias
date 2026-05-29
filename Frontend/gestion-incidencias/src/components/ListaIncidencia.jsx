import React from 'react';

const ListaIncidencia = ({ incidencias, alEliminar, alCambiarEstado }) => {
    
    // Función para asignar color según el estado (¡Actualizada con los estados de la IA!)
    const getBadgeClass = (estado) => {
        switch (estado) {
            case 'PENDIENTE': return 'bg-danger text-white';
            case 'URGENTE': return 'bg-danger font-weight-bold text-white animate-pulse'; // Por si la IA detecta criticidad
            case 'EN_PROCESO': case 'PROCESADA_POR_IA': return 'bg-warning text-dark';
            case 'RESUELTA': return 'bg-success text-white';
            default: return 'bg-secondary text-white';
        }
    };

    if (incidencias.length === 0) {
        return (
            <div className="alert alert-info text-center shadow-sm">
                No hay incidencias registradas para esta empresa.
            </div>
        );
    }

    return (
        <div className="row row-cols-1 row-cols-md-2 g-3">
            {incidencias.map(inc => (
                <div className="col" key={inc.id}>
                    <div className="card h-100 shadow-sm border-0">
                        
                        {/* Cabecera de la Tarjeta */}
                        <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0 pt-3">
                            <span className={`badge rounded-pill ${getBadgeClass(inc.estado)}`}>
                                {inc.estado ? inc.estado.replace('_', ' ') : 'PENDIENTE'}
                            </span>
                            <small className="text-muted">ID: #{inc.id}</small>
                        </div>
                        
                        {/* Cuerpo */}
                        <div className="card-body">
                            <h5 className="card-title fw-bold text-dark text-capitalize">{inc.titulo}</h5>
                            <p className="card-text text-secondary" style={{ fontSize: '0.9rem' }}>
                                {inc.descripcion}
                            </p>
                        </div>
                        
                        {/* Pie de Tarjeta con Acciones */}
                        <div className="card-footer bg-white border-top-0 pb-3 d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                📅 {inc.fechaCreacion ? new Date(inc.fechaCreacion).toLocaleDateString() : 'Reciente'}
                            </small>
                            
                            <div className="d-flex gap-2">
                                {/* Botón de cambio de estado dinámico */}
                                {inc.estado !== 'RESUELTA' && (
                                    <button
                                        // 🛠️ CORREGIDO: Sintaxis de strings limpios para Bootstrap
                                        className={`btn btn-sm shadow-sm ${inc.estado === 'PENDIENTE' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                        // 🛠️ CORREGIDO: Ahora le envía al padre el ID y el estado actual para calcular el siguiente
                                        onClick={() => alCambiarEstado(inc.id, inc.estado)}
                                    >
                                        {inc.estado === 'PENDIENTE' ? 'Atender' : '✅ Resolver'}
                                    </button>
                                )}

                                {/* Botón de eliminación */}
                                <button 
                                    className="btn btn-outline-danger btn-sm border-0"
                                    onClick={() => alEliminar(inc.id)}
                                    title="Eliminar incidencia"
                                >
                                    🗑️ Borrar
                                </button>
                            </div>
                        </div>
                        {/* 🛠️ CORREGIDO: Se eliminó el bloque duplicado y roto que colgaba aquí abajo */}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListaIncidencia;