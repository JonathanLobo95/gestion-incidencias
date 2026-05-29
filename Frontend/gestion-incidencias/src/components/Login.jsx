import React, { useState } from 'react';
import api from '../api/axios';

const Login = ({onLoginSuccess}) => {
    const [formData, setFormData,] = useState({
        email: '',
        password: '',
        // este será el tenant por defecto
        tenantId: ''
    });

    const [error,setError] = useState('');
    const {loading, setLoading} = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            }, {
                headers: { 'X-Tenant-ID': formData.tenantId }
            });

            const token = response.data.token || response.data.accessToken;

            if(token) {
                //guardamos la sesion en local storage
                localStorage.setItem('accessToken', token);
                localStorage.setItem('tenantId', formData.tenantId);

                //avisamos de que el usuario ya está dentro de la sesion
                onLoginSuccess();
            } else {
                setError('Error en el formato de respuesta del servidor.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Credenciales incorrectas o empresa no válida.'); 
        } finally {
            setLoading(false);
        }
    };
return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Código de Empresa (Tenant ID)</label>
                        <input
                            type="text"
                            name="tenantId"
                            required
                            value={formData.tenantId}
                            onChange={handleChange}
                            placeholder="ej: empresa-test"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="usuario@empresa.com"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:target-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                    >
                        {loading ? 'Cargando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
