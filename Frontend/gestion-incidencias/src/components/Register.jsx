import React, { useState } from 'react';
import api from '../api/axios';

const Register = ({ onRegisterSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        tenantId: ''
    });

const [error, setError] = useState('');
const [success, setSuccess] = useState(false);

const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        try {
            await api.post('/auth/register', {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password
            }, {
                headers: { 'X-Tenant-ID': formData.tenantId }
            });

            setSuccess(true);
            
            // Después de 2 segundos redirigimos al login
            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al registrar el usuario. Comprueba los datos.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        ¡Registro completado con éxito! Redirigiendo...
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Juan Pérez"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
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
                            placeholder="juan@empresa.com"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;