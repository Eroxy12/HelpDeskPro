import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface IComment extends Document {
    ticketId: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId; // Usuario que comenta
    message: string;
    createdAt: Date;
}

// Schema de Mongoose
const CommentSchema = new Schema<IComment>(
    {
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
            required: [true, 'El ID del ticket es obligatorio'],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'El autor es obligatorio'],
        },
        message: {
            type: String,
            required: [true, 'El mensaje es obligatorio'],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Solo createdAt
    }
);

// Índice para búsquedas rápidas por ticket
CommentSchema.index({ ticketId: 1, createdAt: 1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
