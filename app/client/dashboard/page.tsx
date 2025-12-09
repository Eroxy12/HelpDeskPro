'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTickets, Ticket } from '@/services/ticketService';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ClientDashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'client') {
            router.push('/login');
            return;
        }

        loadTickets();
    }, [isAuthenticated, user, router]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await getTickets({ email: user?.email });
            setTickets(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="shadow-md border-b border-border glass-panel sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gradient">HelpDeskPro</h1>
                        <p className="text-sm text-secondary">Panel de Cliente</p>
                    </div>

                    {/* User Info Card */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium text-primary">{user?.name}</span>
                            <span className="text-xs text-muted">{user?.email}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                            <span className="text-primary font-bold text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <Button variant="secondary" size="sm" onClick={handleLogout}>
                            Salir
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-primary">Mis Tickets</h2>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/client/tickets/new')}
                    >
                        + Crear Ticket
                    </Button>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {tickets.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-secondary mb-4">No tienes tickets creados</p>
                        <Button variant="primary" onClick={() => router.push('/client/tickets/new')}>
                            Crear tu primer ticket
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <Card
                                key={ticket._id}
                                onClick={() => router.push(`/client/tickets/${ticket._id}`)}
                                className="card-modern"
                            >
                                <CardHeader className="border-border">
                                    <h3 className="font-semibold text-lg text-primary truncate">
                                        {ticket.title}
                                    </h3>
                                    <div className="flex gap-2 mt-2">
                                        <Badge type="status" value={ticket.status} />
                                        <Badge type="priority" value={ticket.priority} />
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-secondary text-sm line-clamp-3">
                                        {ticket.description}
                                    </p>
                                </CardBody>
                                <CardFooter className="bg-surface-highlight border-border">
                                    <p className="text-xs text-muted">
                                        Creado: {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                                    </p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
