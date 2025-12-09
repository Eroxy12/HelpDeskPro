import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { sendTicketClosedEmail } from '@/lib/emailService';

/**
 * GET /api/tickets/[id]
 * Gets a ticket by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        const ticket = await Ticket.findById(id).populate('assignedTo', 'name email');

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { ticket },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error getting ticket:', error);
        return NextResponse.json(
            { error: 'Error al obtener el ticket' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/tickets/[id]
 * Updates a ticket (agents only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { status, priority, assignedTo } = await request.json();

        // Build update object
        const updateData: any = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo || null;

        // Update ticket
        const ticket = await Ticket.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        // If ticket was closed, send email
        if (status === 'closed') {
            await sendTicketClosedEmail(ticket);
        }

        return NextResponse.json(
            {
                message: 'Ticket actualizado exitosamente',
                ticket,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error updating ticket:', error);
        return NextResponse.json(
            { error: 'Error al actualizar el ticket' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/tickets/[id]
 * Deletes a ticket (agents only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        // Delete the ticket
        const ticket = await Ticket.findByIdAndDelete(id);

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Ticket eliminado exitosamente' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error deleting ticket:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el ticket' },
            { status: 500 }
        );
    }
}
