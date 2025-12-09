'use client';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createTicket } from '@/services/ticketService';
import Button from '@/components/ui/Button';
import { showSuccess, showError } from '@/lib/toastUtils';
import { PlusCircle, ArrowLeft } from 'lucide-react';

export default function NewTicketPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cc: user?.cc || '',
        name: user?.name || '',
        email: user?.email || '',
        priority: 'medium' as 'low' | 'medium' | 'high',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createTicket(formData);
            showSuccess('¡Ticket creado exitosamente!');
            setTimeout(() => {
                router.push('/client/dashboard');
            }, 1000);
        } catch (err: any) {
            showError(err.message || 'Error al crear el ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="shadow-md border-b border-border glass-panel sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                            <PlusCircle className="w-6 h-6" />
                            Crear Nuevo Ticket
                        </h1>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push('/client/dashboard')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>
                    </div>
                </div>
            </header>

            {/* Form */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-surface rounded-xl shadow-lg p-6 border border-primary/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-secondary mb-2">
                                Título del Ticket *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Ej: Problema con el sistema de facturación"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-secondary mb-2">
                                Descripción *
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                rows={5}
                                placeholder="Describe detalladamente el problema..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="cc" className="block text-sm font-medium text-secondary mb-2">
                                    Cédula *
                                </label>
                                <input
                                    id="cc"
                                    type="text"
                                    value={formData.cc}
                                    onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="123456789"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Juan Pérez"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="juan@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-secondary mb-2">
                                    Prioridad *
                                </label>
                                <select
                                    id="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                                    required
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push('/client/dashboard')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                {loading ? 'Creando...' : 'Crear Ticket'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
