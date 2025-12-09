import nodemailer from 'nodemailer';
import { ITicket } from '@/models/Ticket';
import { IComment } from '@/models/Comment';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends email when a new ticket is created
 */
export async function sendTicketCreatedEmail(ticket: ITicket) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.email,
      subject: `Ticket #${ticket._id} creado - ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Ticket Creado Exitosamente</h2>
          <p>Hola <strong>${ticket.name}</strong>,</p>
          <p>Tu ticket ha sido creado exitosamente. Aquí están los detalles:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> #${ticket._id}</p>
            <p><strong>Título:</strong> ${ticket.title}</p>
            <p><strong>Descripción:</strong> ${ticket.description}</p>
            <p><strong>Prioridad:</strong> ${ticket.priority}</p>
            <p><strong>Estado:</strong> ${ticket.status}</p>
          </div>
          
          <p>Nuestro equipo de soporte revisará tu solicitud pronto.</p>
          <p style="color: #6b7280; font-size: 14px;">Gracias por contactarnos,<br>Equipo de HelpDeskPro</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Creation email sent to ${ticket.email}`);
  } catch (error) {
    console.error('Error sending creation email:', error);
  }
}

/**
 * Sends email when a comment is added
 */
export async function sendCommentAddedEmail(
  ticket: ITicket,
  comment: IComment,
  authorName: string
) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.email,
      subject: `Nueva respuesta en tu ticket #${ticket._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nueva Respuesta en tu Ticket</h2>
          <p>Hola <strong>${ticket.name}</strong>,</p>
          <p>Se ha agregado una nueva respuesta a tu ticket:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket:</strong> ${ticket.title}</p>
            <p><strong>Respuesta de:</strong> ${authorName}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: white; padding: 15px; border-left: 4px solid #2563eb;">
              ${comment.message}
            </p>
          </div>
          
          <p>Puedes ver el ticket completo iniciando sesión en HelpDeskPro.</p>
          <p style="color: #6b7280; font-size: 14px;">Gracias,<br>Equipo de HelpDeskPro</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Comment email sent to ${ticket.email}`);
  } catch (error) {
    console.error('Error sending comment email:', error);
  }
}

/**
 * Sends email when a ticket is closed
 */
export async function sendTicketClosedEmail(ticket: ITicket) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.email,
      subject: `Ticket #${ticket._id} cerrado - ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Ticket Cerrado</h2>
          <p>Hola <strong>${ticket.name}</strong>,</p>
          <p>Tu ticket ha sido cerrado:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> #${ticket._id}</p>
            <p><strong>Título:</strong> ${ticket.title}</p>
            <p><strong>Estado final:</strong> ${ticket.status}</p>
          </div>
          
          <p>Si tienes alguna pregunta adicional, no dudes en crear un nuevo ticket.</p>
          <p style="color: #6b7280; font-size: 14px;">Gracias por usar HelpDeskPro,<br>Equipo de Soporte</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Closing email sent to ${ticket.email}`);
  } catch (error) {
    console.error('Error sending closing email:', error);
  }
}

/**
 * Sends reminder email to agents
 */
export async function sendReminderEmail(agentEmail: string, agentName: string, ticketCount: number) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: agentEmail,
      subject: `Recordatorio: ${ticketCount} ticket(s) pendiente(s)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Recordatorio de Tickets Pendientes</h2>
          <p>Hola <strong>${agentName}</strong>,</p>
          <p>Tienes <strong>${ticketCount}</strong> ticket(s) sin respuesta que requieren tu atención.</p>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p>Por favor, revisa estos tickets y proporciona una respuesta lo antes posible.</p>
          </div>
          
          <p>Inicia sesión en HelpDeskPro para ver los detalles.</p>
          <p style="color: #6b7280; font-size: 14px;">Sistema HelpDeskPro</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${agentEmail}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
}
