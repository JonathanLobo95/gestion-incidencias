import React, {useState} from 'react';
import { createIncidencia } from '../services/incidenciaService';

const FormularioIncidencia = ({alGuardar}) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        estado: 'PENDIENTE'
    });

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await createIncidencia(formData);
        setFormData({titulo:'', descripcion:'', estado:'PENDIENTE'});// Limpiar
        alGuardar();// Avisar al padre para recargar la lista
        } catch(error) {
            alert("Error al guardar la incidencia" + error.message);
        }
    };

return (
    <div className="card shadow-sm p-4 mb-4">
        <h3>Nueva incidencia</h3>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Titulo</label>
                <input
                    type="text" className="form-control" required
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Descripcion</label>
                <textarea
                    className="form-control" rows="2" required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                ></textarea>
            </div>

            <div className="mb-3">
                <label className="form-label">Estado inicial</label>
                <select
                    className="form-select"
                    value={formData.estado}
                    onChange={(e)=> setFormData({...formData, estado: e.target.value})}
                >
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="EN_PROCESO">EN_PROCESO</option>
                    <option value="RESUELTA">RESUELTA</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">Registrar parte</button>
        </form>
    </div>
);

};
export default FormularioIncidencia;