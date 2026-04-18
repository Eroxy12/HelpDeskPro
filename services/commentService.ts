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

export interface Comment {
    _id: string;
    ticketId: string;
    author: {
        _id: string;
        name: string;
        role: 'client' | 'agent';
    };
    message: string;
    createdAt: string;
}

export interface CreateCommentData {
    ticketId: string;
    authorId: string;
    message: string;
}

/**
 * Gets all comments for a ticket
 */
export async function getComments(ticketId: string): Promise<Comment[]> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await axios.get(`${apiBaseUrl}/api/comments/${ticketId}`);
        return response.data.comments;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al obtener comentarios');
    }
}

/**
 * Creates a new comment
 */
export async function createComment(data: CreateCommentData): Promise<Comment> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await axios.post(`${apiBaseUrl}/api/comments`, data);
        return response.data.comment;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al crear el comentario');
    }
}
