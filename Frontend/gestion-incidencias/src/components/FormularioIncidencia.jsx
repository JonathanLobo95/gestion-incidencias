import React, {useState} from 'react';
import { createIncidencia } from '../services/incidenciaService';

const FormularioIncidencia = ({alGuardar}) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
    });

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await createIncidencia(formData);
        setFormData({titulo:'', descripcion:''});
        alGuardar();
        } catch(error) {
            alert("Error al guardar la incidencia" + error.message);
        }
    };

return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 max-w-lg mx-auto mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Nueva incidencia</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Campo: Título */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Título</label>
                    <input
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        required
                        placeholder="Ej: Caída del servidor de BBDD"
                        value={formData.titulo}
                        // 🛠️ CORREGIDO: Ahora actualiza 'titulo'
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    />
                </div>

                {/* Campo: Descripción */}
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Descripción</label>
                    <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                        rows="3" 
                        required
                        placeholder="Detalla qué está ocurriendo..."
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    ></textarea>
                </div>

                {/* Botón de envío */}
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-black font-medium py-2.5 px-4 rounded-lg shadow transition duration-200"
                >
                    Enviar a análisis IA 🤖
                </button>
            </form>
        </div>
    );
};
export default FormularioIncidencia;