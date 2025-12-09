'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTickets, Ticket } from '@/services/ticketService';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Inbox, ListChecks, Circle, AlertCircle, CheckCircle, XCircle, Flame, Zap } from 'lucide-react';

export default function AgentDashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'agent') {
            router.push('/login');
            return;
        }

        loadTickets();
    }, [isAuthenticated, user, router, statusFilter, priorityFilter]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (statusFilter) filters.status = statusFilter;
            if (priorityFilter) filters.priority = priorityFilter;

            const data = await getTickets(filters);
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

    const getStatusCount = (status: string) => {
        return tickets.filter(t => t.status === status).length;
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
            {/* Modern Header */}
            <header className="relative overflow-hidden bg-gradient-to-r from-surface via-surface-highlight to-surface border-b-2 border-primary/30">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(176, 254, 118, 0.3) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient mb-1">Dashboard del Agente</h1>
                            <p className="text-sm text-secondary">Gestiona todos los tickets de soporte</p>
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

                    {/* Visual Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-info/20 to-info/5 backdrop-blur-sm rounded-xl p-4 border-2 border-info/40 hover:border-info transition-all hover:scale-105">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-lg bg-info/30 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-info animate-pulse"></div>
                                </div>
                                <span className="text-3xl font-bold text-info">{getStatusCount('open')}</span>
                            </div>
                            <p className="text-sm font-medium text-info">Abiertos</p>
                            <div className="mt-2 h-1 bg-info/20 rounded-full overflow-hidden">
                                <div className="h-full bg-info rounded-full" style={{ width: `${(getStatusCount('open') / tickets.length) * 100 || 0}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-warning/20 to-warning/5 backdrop-blur-sm rounded-xl p-4 border-2 border-warning/40 hover:border-warning transition-all hover:scale-105">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-lg bg-warning/30 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-warning animate-pulse"></div>
                                </div>
                                <span className="text-3xl font-bold text-warning">{getStatusCount('in_progress')}</span>
                            </div>
                            <p className="text-sm font-medium text-warning">En Progreso</p>
                            <div className="mt-2 h-1 bg-warning/20 rounded-full overflow-hidden">
                                <div className="h-full bg-warning rounded-full" style={{ width: `${(getStatusCount('in_progress') / tickets.length) * 100 || 0}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-success/20 to-success/5 backdrop-blur-sm rounded-xl p-4 border-2 border-success/40 hover:border-success transition-all hover:scale-105">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-lg bg-success/30 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-success"></div>
                                </div>
                                <span className="text-3xl font-bold text-success">{getStatusCount('resolved')}</span>
                            </div>
                            <p className="text-sm font-medium text-success">Resueltos</p>
                            <div className="mt-2 h-1 bg-success/20 rounded-full overflow-hidden">
                                <div className="h-full bg-success rounded-full" style={{ width: `${(getStatusCount('resolved') / tickets.length) * 100 || 0}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur-sm rounded-xl p-4 border-2 border-secondary/40 hover:border-secondary transition-all hover:scale-105">
                            <div className="flex items-center justify-between mb-2">
                                <div className="w-10 h-10 rounded-lg bg-secondary/30 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                </div>
                                <span className="text-3xl font-bold text-secondary">{getStatusCount('closed')}</span>
                            </div>
                            <p className="text-sm font-medium text-secondary">Cerrados</p>
                            <div className="mt-2 h-1 bg-secondary/20 rounded-full overflow-hidden">
                                <div className="h-full bg-secondary rounded-full" style={{ width: `${(getStatusCount('closed') / tickets.length) * 100 || 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters Bar */}
                <div className="bg-surface rounded-xl shadow-lg p-4 mb-6 border border-primary/20">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <h3 className="font-semibold text-primary">Filtrar Tickets</h3>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            >
                                <option value="">Todos los estados</option>
                                <option value="open">Abierto</option>
                                <option value="in_progress">En Progreso</option>
                                <option value="resolved">Resuelto</option>
                                <option value="closed">Cerrado</option>
                            </select>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            >
                                <option value="">Todas las prioridades</option>
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Tickets Grid */}
                {tickets.length === 0 ? (
                    <div className="text-center py-16 bg-surface rounded-xl shadow border border-border">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surface-highlight flex items-center justify-center">
                            <Inbox className="w-10 h-10 text-muted" />
                        </div>
                        <p className="text-secondary text-lg">No hay tickets que coincidan con los filtros</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-primary">
                                Tickets Activos ({tickets.length})
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {tickets.map((ticket) => {
                                const statusColors = {
                                    open: 'border-info/50 hover:border-info bg-info/5',
                                    in_progress: 'border-warning/50 hover:border-warning bg-warning/5',
                                    resolved: 'border-success/50 hover:border-success bg-success/5',
                                    closed: 'border-secondary/50 hover:border-secondary bg-secondary/5'
                                };

                                const priorityIndicators = {
                                    high: 'bg-danger',
                                    medium: 'bg-warning',
                                    low: 'bg-success'
                                };

                                return (
                                    <div
                                        key={ticket._id}
                                        onClick={() => router.push(`/agent/tickets/${ticket._id}`)}
                                        className={`relative bg-surface rounded-xl p-4 border-2 ${statusColors[ticket.status]} cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02]`}
                                    >
                                        {/* Priority Indicator */}
                                        <div className={`absolute top-0 left-0 w-1 h-full ${priorityIndicators[ticket.priority]} rounded-l-xl`}></div>

                                        <div className="pl-3">
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <h3 className="font-semibold text-primary line-clamp-2 flex-1">
                                                    {ticket.title}
                                                </h3>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex gap-2 mb-3">
                                                <Badge type="status" value={ticket.status} />
                                                <Badge type="priority" value={ticket.priority} />
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-secondary line-clamp-2 mb-3">
                                                {ticket.description}
                                            </p>

                                            {/* Footer Info */}
                                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted">Cliente</span>
                                                    <span className="text-sm font-medium text-primary">{ticket.name}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-muted">Creado</span>
                                                    <span className="text-sm font-medium text-primary">
                                                        {new Date(ticket.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
