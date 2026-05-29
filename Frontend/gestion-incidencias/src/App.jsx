import { useEffect, useState } from 'react';
import { getIncidencias, deleteIncidencia, updateIncidencia } from './services/incidenciaService';
import ListaIncidencias from './components/ListaIncidencia';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormularioIncidencia from './components/FormularioIncidencia';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState('login');

    const [incidencias, setIncidencias] = useState([]);
    const [filtro, setFiltro] = useState('TODAS');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(token) {
            setIsAuthenticated(true);
        }
    }, []);
    


    const cargarDatos = async () => {
        try {
            const data = await getIncidencias();
            setIncidencias(data);
        } catch(error) {
            console.error("Error al cargar los datos", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            cargarDatos();
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
   localStorage.removeItem('accessToken');
        localStorage.removeItem('tenantId');
        setIncidencias([]); // Limpiamos el estado
        setIsAuthenticated(false);
        setCurrentView('login');
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que quieres borrar esta incidencia?")) {
            await deleteIncidencia(id);
            cargarDatos(); // se refresca la lista tras borrar
        }
    };

    const handleSiguienteEstado = async (incidencia) => {
        const estados = ['PENDIENTE', 'EN_PROCESO', 'RESUELTA'];
        const indiceActual = estados.indexOf(incidencia.estado);

        //si no es el ultimo estado, avanzamos
        if(indiceActual<estados.length - 1) {
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
    const incidenciasFiltradas = incidencias.filter(inc => {
        const coincideEstado = filtro === 'TODAS' ? true : inc.estado === filtro;
        const coincideTexto = inc.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                              inc.descripcion.toLowerCase().includes(busqueda.toLowerCase());
        return coincideEstado && coincideTexto;
                            

    });

    const totales = {
        total: incidencias.length,
        pendientes: incidencias.filter(i => i.estado === 'PENDIENTE').length,
        enProceso: incidencias.filter(i => i.estado === 'EN_PROCESO').length,
        resueltas: incidencias.filter(i => i.estado === 'RESUELTA').length
    }

// ==========================================
    // RENDERS CONDICIONALES (Login / Register)
    // ==========================================
    if (!isAuthenticated) {
        return (
            <div className="bg-gray-50 min-h-screen">
                {currentView === 'login' ? (
                    <div className="flex flex-col justify-center">
                        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
                        <p className="text-center text-sm text-gray-600 -mt-8 pb-8">
                            ¿No tienes cuenta en tu empresa?{' '}
                            <button onClick={() => setCurrentView('register')} className="text-blue-600 font-semibold hover:underline bg-transparent border-0 p-0">
                                Regístrate aquí
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center">
                        <Register onRegisterSuccess={() => setCurrentView('login')} />
                        <p className="text-center text-sm text-gray-600 -mt-8 pb-8">
                            ¿Ya tienes un usuario creado?{' '}
                            <button onClick={() => setCurrentView('login')} className="text-blue-600 font-semibold hover:underline bg-transparent border-0 p-0">
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // ==========================================
    // RENDER PRINCIPAL (Panel de Control Protegido)
    // ==========================================
    return (
        <div className="bg-gray-50 min-h-screen pb-5">
            {/* Navbar superior estilo Tailwind */}
            <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center mb-5 border-b border-gray-200">
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-gray-800 m-0">Gestión de Partes e Incidencias</h1>
                    <span className="text-xs text-blue-600 font-medium">
                        🏢 Empresa activa: {localStorage.getItem('tenantId')}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border-0"
                >
                    Cerrar Sesión
                </button>
            </nav>

            <div className="container">
                {/* Dashboard de estadísticas */}
                <Dashboard stats={totales} />
                
                <div className="row mt-4">
                    {/* Lado izquierdo: Formulario */}
                    <div className="col-md-4">
                        <FormularioIncidencia alGuardar={cargarDatos} />
                    </div> 

                    {/* Lado derecho: Buscador y Lista */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0 p-3 mb-4 bg-light">
                            <div className="row g-2">
                                <div className="col-12 mb-2">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="🔍 Buscar por título o descripción..."
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                    />
                                </div>
                                <div className="col-12 d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 text-secondary">Filtros:</h6>
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
                            </div>
                        </div>

                        <ListaIncidencias
                            incidencias={incidenciasFiltradas}
                            alEliminar={handleEliminar}
                            alCambiarEstado={handleSiguienteEstado}
                        />

                        <div className="text-muted mt-3 small text-end">
                            Mostrando <strong>{incidenciasFiltradas.length}</strong> de {incidencias.length} incidencias.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;