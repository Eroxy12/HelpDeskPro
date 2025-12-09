'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import axios from 'axios';
import { showSuccess, showError } from '@/lib/toastUtils';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client',
        cc: '',
    });
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            // Call API directly without using AuthContext
            await axios.post('/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                cc: formData.cc,
            });

            showSuccess('¡Cuenta creada exitosamente!');

            // Redirect to login after successful registration
            setTimeout(() => {
                router.push('/login?registered=true');
            }, 1000);
        } catch (err: any) {
            showError(err.response?.data?.error || 'Error al registrarse');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
            <div className="card-modern w-full max-w-md shadow-2xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gradient">Crear Cuenta</h1>
                    <p className="text-secondary">Únete a HelpDeskPro</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="Juan Pérez"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="cc" className="block text-sm font-medium text-secondary mb-1">
                            Cédula
                        </label>
                        <input
                            id="cc"
                            type="text"
                            value={formData.cc}
                            onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                            className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="123456789"
                            required={formData.role === 'client'}
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-secondary mb-1">
                            Tipo de Cuenta
                        </label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        >
                            <option value="client">Cliente</option>
                            <option value="agent">Agente (Soporte)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-secondary mb-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-1">
                                Confirmar
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-secondary">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <button
                            onClick={() => router.push('/login')}
                            className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline"
                        >
                            Iniciar Sesión
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
