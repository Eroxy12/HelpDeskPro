import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';

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
        const response = await axios.get(`${API_BASE_URL}/api/comments/${ticketId}`);
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
        const response = await axios.post(`${API_BASE_URL}/api/comments`, data);
        return response.data.comment;
    } catch (error: any) {
        throw new Error(error.response?.data?.error || 'Error al crear el comentario');
    }
}
