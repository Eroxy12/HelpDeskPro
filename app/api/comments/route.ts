import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { sendCommentAddedEmail } from '@/lib/emailService';

/**
 * POST /api/comments
 * Creates a new comment
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { ticketId, authorId, message } = await request.json();

        // Validate required fields
        if (!ticketId || !authorId || !message) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        // Verify that the ticket exists
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // Verify that the author exists
        const author = await User.findById(authorId);
        if (!author) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        // Create comment
        const comment = await Comment.create({
            ticketId,
            author: authorId,
            message,
        });

        // Populate author information
        await comment.populate('author', 'name role');

        // Send notification email
        await sendCommentAddedEmail(ticket, comment, author.name);

        return NextResponse.json(
            {
                message: 'Comentario agregado exitosamente',
                comment,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Error al crear el comentario' },
            { status: 500 }
        );
    }
}
