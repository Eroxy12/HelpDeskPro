import React from 'react';

interface BadgeProps {
    type: 'status' | 'priority';
    value: string;
}

export default function Badge({ type, value }: BadgeProps) {
    const statusColors = {
        open: 'bg-info/20 text-info border-info/30 ring-1 ring-info/30',
        in_progress: 'bg-warning/20 text-warning-foreground border-warning/50 ring-1 ring-warning/50',
        resolved: 'bg-success/20 text-success-foreground border-success/30 ring-1 ring-success/30',
        closed: 'bg-secondary/20 text-secondary border-secondary/30 ring-1 ring-secondary/30',
    };

    const priorityColors = {
        low: 'bg-secondary/10 text-secondary border-secondary/20 ring-1 ring-secondary/20',
        medium: 'bg-warning/20 text-warning-foreground border-warning/50 ring-1 ring-warning/50',
        high: 'bg-danger/20 text-danger border-danger/30 ring-1 ring-danger/30',
    };

    const statusLabels = {
        open: 'Abierto',
        in_progress: 'En Progreso',
        resolved: 'Resuelto',
        closed: 'Cerrado',
    };

    const priorityLabels = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
    };

    let colorClass = '';
    let label = value;

    if (type === 'status') {
        colorClass = statusColors[value as keyof typeof statusColors] || 'bg-slate-100 text-slate-700 border-slate-200';
        label = statusLabels[value as keyof typeof statusLabels] || value;
    } else if (type === 'priority') {
        colorClass = priorityColors[value as keyof typeof priorityColors] || 'bg-slate-100 text-slate-700 border-slate-200';
        label = priorityLabels[value as keyof typeof priorityLabels] || value;
    }

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} shadow-sm`}>
            {label}
        </span>
    );
}
