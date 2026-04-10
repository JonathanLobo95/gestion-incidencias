import { useEffect, useState } from 'react';
import { getIncidencias, deleteIncidencia } from './services/incidenciaService';
import ListaIncidencias from './components/ListaIncidencia';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormularioIncidencia from './components/FormularioIncidencia';

function App() {
    const [incidencias, setIncidencias] = useState([]);

    const cargarDatos = async () => {
        try {
            const data = await getIncidencias();
            setIncidencias(data);
        } catch(error) {
            console.error(error);
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

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">Gestión de partes e Incidencias</h1>
            <div className="row">
               {/* Lado izquierdo: El Formulario */}
               <div className="col-md-4">
                    <FormularioIncidencia alGuardar={cargarDatos} />
                </div> 

                {/* Lado derecho: La Tabla */}
                <div className="col-md-8">
                    <ListaIncidencias
                        incidencias={incidencias}
                        alEliminar={handleEliminar}
            />

                </div>
            </div>
            
        </div>

    );
}
export default App;