'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getTicketById, Ticket } from '@/services/ticketService';
import { getComments, createComment, Comment } from '@/services/commentService';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { showSuccess, showError } from '@/lib/toastUtils';
import { Ticket as TicketIcon, FileText, MessageCircle, User, CreditCard, Mail, Calendar, BarChart3, Send, Lock, MessageSquare } from 'lucide-react';

export default function ClientTicketDetailPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
            setComments(commentsData);
        } catch (err: any) {
            showError(err.message || 'Error al cargar el ticket');
        } finally {
            setLoading(false);
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
            showSuccess('Comentario agregado exitosamente');
            await loadTicketData(); // Recargar comentarios
        } catch (err: any) {
            showError(err.message || 'Error al agregar comentario');
        } finally {
            setSubmitting(false);
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
                        onClick={() => router.push('/client/dashboard')}
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
                                        Ticket #{ticket._id.slice(-6).toUpperCase()}
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
                                <h2 className="text-xl font-semibold text-primary">Descripción</h2>
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
                            {ticket.status !== 'closed' && (
                                <div className="mt-8 pt-6 border-t border-border">
                                    <form onSubmit={handleSubmitComment} className="space-y-4">
                                        <div className="relative">
                                            <textarea
                                                id="comment"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                                                rows={4}
                                                placeholder="Escribe tu comentario aquí..."
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit" variant="primary" disabled={submitting} className="btn-primary flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                {submitting ? 'Enviando...' : 'Enviar Comentario'}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {ticket.status === 'closed' && (
                                <div className="mt-6 bg-surface-highlight border-2 border-border rounded-xl p-4 text-center">
                                    <p className="text-secondary flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Este ticket está cerrado
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Sidebar Info (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Info Card */}
                            <div className="bg-surface rounded-xl shadow-lg p-5 border border-primary/20">
                                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                                    <TicketIcon className="w-4 h-4" />
                                    Información del Ticket
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
        </div>
    );
}
