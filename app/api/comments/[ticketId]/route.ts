import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import User from '@/models/User';

/**
 * GET /api/comments/[ticketId]
 * Gets all comments for a ticket
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ ticketId: string }> }
) {
    try {
        await connectDB();
        void User;

        const { ticketId } = await params;

        const comments = await Comment.find({ ticketId })
            .populate('author', 'name role')
            .sort({ createdAt: 1 }); // Ascending chronological order

        return NextResponse.json(
            { comments },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error getting comments:', error);
        return NextResponse.json(
            { error: 'Error al obtener comentarios' },
            { status: 500 }
        );
    }
}
