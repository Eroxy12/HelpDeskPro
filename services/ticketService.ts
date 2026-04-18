import axios from 'axios';

function getApiBaseUrl() {
    const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

    // In deployed browsers, ignore localhost-style public API URLs and use same-origin requests.
    if (
        typeof window !== 'undefined' &&
        configuredUrl &&
        /localhost|127\.0\.0\.1/i.test(configuredUrl) &&
        !/localhost|127\.0\.0\.1/i.test(window.location.hostname)
    ) {
        return '';
    }

    return configuredUrl;
}

export interface Ticket {
    _id: string;
    title: string;
    description: string;
    cc: string;
    name: string;
    email: string;
    assignedTo?: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
}

export interface CreateTicketData {
    title: string;
    description: string;
    cc: string;
    name: string;
    email: string;
    priority: 'low' | 'medium' | 'high';
}

export interface UpdateTicketData {
    status?: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high';
    assignedTo?: string;
}

/**
 * Gets all tickets (with optional filters)
 */
export async function getTickets(filters?: {
    email?: string;
    status?: string;
    priority?: string;
}): Promise<Ticket[]> {
    try {
        const params = new URLSearchParams();
        if (filters?.email) params.append('email', filters.email);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);

        const query = params.toString();
        const apiBaseUrl = getApiBaseUrl();
        const response = await axios.get(`${apiBaseUrl}/api/tickets${query ? `?${query}` : ''}`);
        return response.data.tickets;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al obtener tickets');
    }
}

/**
 * Gets a ticket by ID
 */
export async function getTicketById(id: string): Promise<Ticket> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await axios.get(`${apiBaseUrl}/api/tickets/${id}`);
        return response.data.ticket;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al obtener el ticket');
    }
}

/**
 * Creates a new ticket
 */
export async function createTicket(data: CreateTicketData): Promise<Ticket> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await axios.post(`${apiBaseUrl}/api/tickets`, data);
        return response.data.ticket;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al crear el ticket');
    }
}

/**
 * Updates an existing ticket
 */
export async function updateTicket(id: string, data: UpdateTicketData): Promise<Ticket> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await axios.patch(`${apiBaseUrl}/api/tickets/${id}`, data);
        return response.data.ticket;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al actualizar el ticket');
    }
}

/**
 * Deletes a ticket
 */
export async function deleteTicket(id: string): Promise<void> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        await axios.delete(`${apiBaseUrl}/api/tickets/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al eliminar el ticket');
    }
}
