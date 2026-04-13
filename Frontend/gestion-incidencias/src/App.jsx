import { useEffect, useState } from 'react';
import { getIncidencias, deleteIncidencia, updateIncidencia } from './services/incidenciaService';
import ListaIncidencias from './components/ListaIncidencia';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormularioIncidencia from './components/FormularioIncidencia';

function App() {
    const [incidencias, setIncidencias] = useState([]);
    const [filtro, setFiltro] = useState('TODAS');


    const cargarDatos = async () => {
        try {
            const data = await getIncidencias();
            setIncidencias(data);
        } catch(error) {
            console.error("Error al cargar los datos", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que quieres borrar esta incidencia?")) {
            await deleteIncidencia(id);
            cargarDatos(); // se refresca la lista tras borrar
        }
    };

    const handleSiguienteEstado = async (incidencia) => {
        const estados = ['PENDIENTE', 'EN_PROCESO', 'RESUELTA'];
        const indiceActual = estados.indexOf(incidencia.estsdo);

        //si no es el ultimo estado, avanzamos
        if(indiceActual<estados.lenght - 1) {
            const nuevaIncidencia = {
                ...incidencia,
                estado: estados[indiceActual + 1]
            };
            try {
                await updateIncidencia(incidencia.id, nuevaIncidencia);
                cargarDatos();
            } catch (error) {
                console.error("Error al actualizar", error);
            }
        }
    };


    //logica de filtrado
    const incidenciasFiltradas = incidencias.filter(inc => 
        filtro === 'TODAS' ? true : inc.estado === filtro
    );

return (
        <div className="container mt-5">
            <h1 className="text-center mb-5 fw-bold text-primary">Gestión de Partes e Incidencias</h1>
            
            <div className="row">
                {/* Lado izquierdo: El Formulario */}
                <div className="col-md-4">
                    <FormularioIncidencia alGuardar={cargarDatos} />
                </div> 

                {/* Lado derecho: Filtros y Tabla */}
                <div className="col-md-8">
                    {/* Botonera de Filtros */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Listado</h5>
                        <div className="btn-group shadow-sm">
                            {['TODAS', 'PENDIENTE', 'EN_PROCESO', 'RESUELTA'].map(e => (
                                <button 
                                    key={e}
                                    className={`btn btn-sm ${filtro === e ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setFiltro(e)}
                                >
                                    {e.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    
                    <ListaIncidencias
                        incidencias={incidenciasFiltradas}
                        alEliminar={handleEliminar}
                        alCambiarEstado={handleSiguienteEstado}
                    />

                    {/* Contador  */}
                    <div className="text-muted mt-2 small">
                        Mostrando {incidenciasFiltradas.length} de {incidencias.length} incidencias.
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;