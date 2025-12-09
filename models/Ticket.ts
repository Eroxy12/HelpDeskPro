import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface ITicket extends Document {
    title: string;
    description: string;
    cc: string; // Cédula del solicitante
    name: string; // Nombre del solicitante
    email: string; // Email del solicitante
    assignedTo?: mongoose.Types.ObjectId; // Agente asignado (opcional)
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}

// Schema de Mongoose
const TicketSchema = new Schema<ITicket>(
    {
        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
        },
        cc: {
            type: String,
            required: [true, 'La cédula es obligatoria'],
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            lowercase: true,
            trim: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
    },
    {
        timestamps: true,
    }
);

// Índices para mejorar búsquedas
TicketSchema.index({ email: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });

const Ticket: Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
