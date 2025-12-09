import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import User from '@/models/User'; // Importar User para registrar el modelo
import { sendTicketCreatedEmail } from '@/lib/emailService';

/**
 * GET /api/tickets
 * Gets tickets with optional filters
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');

        // Build filter
        const filter: any = {};
        if (email) filter.email = email;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        // Get tickets and populate assigned agent
        const tickets = await Ticket.find(filter)
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(
            { tickets },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error getting tickets:', error);
        return NextResponse.json(
            { error: 'Error al obtener tickets' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/tickets
 * Creates a new ticket
 */
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { title, description, cc, name, email, priority } = await request.json();

        // Validate required fields
        if (!title || !description || !cc || !name || !email) {
            return NextResponse.json(
                { error: 'Todos los campos son obligatorios' },
                { status: 400 }
            );
        }

        // Create ticket
        const ticket = await Ticket.create({
            title,
            description,
            cc,
            name,
            email: email.toLowerCase(),
            priority: priority || 'medium',
            status: 'open',
        });

        // Send notification email
        await sendTicketCreatedEmail(ticket);

        return NextResponse.json(
            {
                message: 'Ticket creado exitosamente',
                ticket,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating ticket:', error);
        return NextResponse.json(
            { error: 'Error al crear el ticket' },
            { status: 500 }
        );
    }
}
