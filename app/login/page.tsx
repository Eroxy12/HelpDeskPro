'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { showSuccess, showError } from '@/lib/toastUtils';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Detect if coming from registration
    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            showSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);

            // Get user from localStorage to redirect based on role
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                showSuccess(`¡Bienvenido, ${user.name}!`);

                if (user.role === 'agent') {
                    router.push('/agent/dashboard');
                } else {
                    router.push('/client/dashboard');
                }
            }
        } catch (err: any) {
            showError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
            <div className="card-modern w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-gradient">HelpDeskPro</h1>
                    <p className="text-secondary">Sistema de Gestión de Tickets</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-border bg-background rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-secondary">
                    <p>
                        ¿No tienes cuenta?{' '}
                        <button
                            onClick={() => router.push('/register')}
                            className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline"
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
