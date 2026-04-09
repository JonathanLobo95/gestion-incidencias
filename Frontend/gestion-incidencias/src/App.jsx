import { useEffect, useState } from 'react';
import { getIncidencia, deleteIncidencia } from './services/incidenciaService';
import ListaIncidencia from './components/ListaIncidencia';
import ListaIncidencias from './components/ListaIncidencia';

function App() {
    const [incidencias, setIncidencias] = useState([]);

    const cargarDatos = async () => {
        try {
            const data = await getIncidencias();
            setIncidencias(data);
        } catch(error) {
            console.error(err);
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
            <ListaIncidencias
                incidencias={incidencias}
                alEliminar={handleEliminar}
            />
        </div>

    );
}
export default App;