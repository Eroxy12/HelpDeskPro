'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTicketById, updateTicket, deleteTicket, Ticket } from '@/services/ticketService';
import { getComments, createComment, Comment } from '@/services/commentService';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { showSuccess, showError } from '@/lib/toastUtils';
import { Ticket as TicketIcon, FileText, MessageCircle, User, CreditCard, Mail, Calendar, BarChart3, Send, Settings, Info, Save, AlertTriangle, MessageSquare, Trash2 } from 'lucide-react';

export default function AgentTicketDetailPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Editable states
    const [editStatus, setEditStatus] = useState('');
    const [editPriority, setEditPriority] = useState('');

    useEffect(() => {
        loadTicketData();
    }, [ticketId]);

    const loadTicketData = async () => {
        try {
            setLoading(true);
            const [ticketData, commentsData] = await Promise.all([
                getTicketById(ticketId),
                getComments(ticketId),
            ]);
            setTicket(ticketData);
            setEditStatus(ticketData.status);
            setEditPriority(ticketData.priority);
            setComments(commentsData);
        } catch (err: any) {
            showError(err.message || 'Error al cargar el ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTicket = async () => {
        if (!ticket) return;

        try {
            setUpdating(true);
            await updateTicket(ticketId, {
                status: editStatus as any,
                priority: editPriority as any,
            });
            await loadTicketData();
            showSuccess('Ticket actualizado exitosamente');
        } catch (err: any) {
            showError(err.message || 'Error al actualizar el ticket');
        } finally {
            setUpdating(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        try {
            setSubmitting(true);
            await createComment({
                ticketId,
                authorId: user._id,
                message: newComment,
            });
            setNewComment('');
            showSuccess('Respuesta enviada exitosamente');
            await loadTicketData();
        } catch (err: any) {
            showError(err.message || 'Error al enviar respuesta');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTicket = async () => {
        try {
            setDeleting(true);
            await deleteTicket(ticketId);
            showSuccess('Ticket eliminado exitosamente');
            router.push('/agent/dashboard');
        } catch (err: any) {
            showError(err.message || 'Error al eliminar el ticket');
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-secondary">Ticket no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Unique Hero Header with Better Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-surface via-surface-highlight to-surface border-b-2 border-primary/30">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(176, 254, 118, 0.3) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}></div>
                </div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push('/agent/dashboard')}
                        className="mb-6"
                    >
                        ← Volver
                    </Button>

                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                                    <TicketIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-primary">{ticket.title}</h1>
                                    <p className="text-secondary text-sm mt-1">
                                        Ticket #{ticket._id.slice(-6).toUpperCase()} • Cliente: {ticket.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Badge type="status" value={ticket.status} />
                            <Badge type="priority" value={ticket.priority} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Sidebar Layout */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Main Content (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description Card */}
                        <div className="bg-surface rounded-xl shadow-lg p-6 border border-primary/20">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold text-primary">Descripción del Problema</h2>
                            </div>
                            <p className="text-secondary whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                        </div>

                        {/* Timeline Comments */}
                        <div className="bg-surface rounded-xl shadow-lg p-6 border border-primary/20">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-semibold text-primary">Conversación</h2>
                                <span className="ml-auto text-sm text-muted">{comments.length} mensajes</span>
                            </div>

                            {/* Timeline */}
                            <div className="relative">
                                {comments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-highlight flex items-center justify-center">
                                            <MessageSquare className="w-8 h-8 text-muted" />
                                        </div>
                                        <p className="text-muted">Aún no hay comentarios</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Timeline Line */}
                                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

                                        {comments.map((comment, index) => (
                                            <div key={comment._id} className="relative pl-16">
                                                {/* Timeline Dot */}
                                                <div className={`absolute left-4 top-2 w-4 h-4 rounded-full border-2 ${comment.author.role === 'agent'
                                                    ? 'bg-info border-info'
                                                    : 'bg-primary border-primary'
                                                    }`}></div>

                                                {/* Comment Card */}
                                                <div className={`rounded-lg p-4 ${comment.author.role === 'agent'
                                                    ? 'bg-info/5 border-l-4 border-info'
                                                    : 'bg-primary/5 border-l-4 border-primary'
                                                    }`}>
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-primary">
                                                                {comment.author.name}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${comment.author.role === 'agent'
                                                                ? 'bg-info/20 text-info'
                                                                : 'bg-primary/20 text-primary'
                                                                }`}>
                                                                {comment.author.role === 'agent' ? 'Agente' : 'Cliente'}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-muted">
                                                            {new Date(comment.createdAt).toLocaleString('es-ES')}
                                                        </span>
                                                    </div>
                                                    <p className="text-secondary whitespace-pre-wrap">{comment.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* New Comment Form */}
                            <div className="mt-8 pt-6 border-t border-border">
                                <form onSubmit={handleSubmitComment} className="space-y-4">
                                    <div className="relative">
                                        <textarea
                                            id="comment"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                                            rows={4}
                                            placeholder="Escribe tu respuesta al cliente..."
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" variant="primary" disabled={submitting} className="btn-primary flex items-center gap-2">
                                            <Send className="w-4 h-4" />
                                            {submitting ? 'Enviando...' : 'Enviar Respuesta'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Info Card */}
                            <div className="bg-surface rounded-xl shadow-lg p-5 border border-primary/20">
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Información del Cliente
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-muted min-w-[70px] flex items-center gap-1"><User className="w-3 h-3" /> Nombre:</span>
                                        <span className="text-secondary font-medium">{ticket.name}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-muted min-w-[70px] flex items-center gap-1"><CreditCard className="w-3 h-3" /> Cédula:</span>
                                        <span className="text-secondary font-medium">{ticket.cc}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-muted min-w-[70px] flex items-center gap-1"><Mail className="w-3 h-3" /> Email:</span>
                                        <span className="text-secondary font-medium break-all">{ticket.email}</span>
                                    </div>
                                    <div className="pt-3 border-t border-border">
                                        <div className="flex items-start gap-2">
                                            <span className="text-muted min-w-[70px] flex items-center gap-1"><Calendar className="w-3 h-3" /> Creado:</span>
                                            <span className="text-secondary font-medium">
                                                {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Management Card */}
                            <div className="bg-surface rounded-xl shadow-lg p-5 border-2 border-warning/30">
                                <h3 className="font-semibold text-warning mb-4 flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Gestionar Ticket
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">
                                            Estado
                                        </label>
                                        <select
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="open">Abierto</option>
                                            <option value="in_progress">En Progreso</option>
                                            <option value="resolved">Resuelto</option>
                                            <option value="closed">Cerrado</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary mb-2">
                                            Prioridad
                                        </label>
                                        <select
                                            value={editPriority}
                                            onChange={(e) => setEditPriority(e.target.value)}
                                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="low">Baja</option>
                                            <option value="medium">Media</option>
                                            <option value="high">Alta</option>
                                        </select>
                                    </div>

                                    <Button
                                        variant="success"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={handleUpdateTicket}
                                        disabled={updating}
                                    >
                                        <Save className="w-4 h-4" />
                                        {updating ? 'Actualizando...' : 'Guardar Cambios'}
                                    </Button>

                                    {editStatus === 'closed' && (
                                        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm text-warning flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>Al cerrar el ticket, se enviará un email al cliente.</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delete Ticket Card */}
                            <div className="bg-surface rounded-xl shadow-lg p-5 border-2 border-danger/30">
                                <h3 className="font-semibold text-danger mb-3 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Zona Peligrosa
                                </h3>
                                <p className="text-sm text-secondary mb-4">
                                    Eliminar este ticket es una acción permanente y no se puede deshacer.
                                </p>
                                <Button
                                    variant="danger"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar Ticket
                                </Button>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-surface rounded-xl shadow-lg p-5 border-2 border-primary/30">
                                <h3 className="font-semibold mb-3 text-primary flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    Estadísticas
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-secondary">Comentarios:</span>
                                        <span className="font-bold text-primary">{comments.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-secondary">Última actividad:</span>
                                        <span className="font-bold text-primary">
                                            {comments.length > 0
                                                ? new Date(comments[comments.length - 1].createdAt).toLocaleDateString('es-ES')
                                                : 'Sin actividad'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface rounded-2xl shadow-2xl max-w-md w-full border-2 border-danger/30 animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-danger" />
                            </div>
                            <h3 className="text-xl font-bold text-primary text-center mb-2">
                                ¿Eliminar este ticket?
                            </h3>
                            <p className="text-secondary text-center mb-6">
                                Esta acción no se puede deshacer. El ticket y todos sus comentarios serán eliminados permanentemente.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex-1 flex items-center justify-center gap-2"
                                    onClick={handleDeleteTicket}
                                    disabled={deleting}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {deleting ? 'Eliminando...' : 'Eliminar'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
