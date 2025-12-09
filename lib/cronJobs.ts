import cron from 'node-cron';
import connectDB from './mongodb';
import Ticket from '@/models/Ticket';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { sendReminderEmail } from './emailService';

/**
 * Initializes cron jobs
 */
export function initCronJobs() {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running cron job: Pending tickets reminders');
        await checkPendingTickets();
    });

    console.log('Cron jobs initialized');
}

/**
 * Checks pending tickets and sends reminders
 */
async function checkPendingTickets() {
    try {
        await connectDB();

        // Date from 24 hours ago
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        // Search for open or in_progress tickets
        const pendingTickets = await Ticket.find({
            status: { $in: ['open', 'in_progress'] },
            createdAt: { $lt: yesterday },
        }).populate('assignedTo');

        // Group tickets by agent
        const ticketsByAgent = new Map<string, any[]>();

        for (const ticket of pendingTickets) {
            // Verify if it has recent comments
            const recentComments = await Comment.find({
                ticketId: ticket._id,
                createdAt: { $gt: yesterday },
            });

            // If no recent comments, add to list
            if (recentComments.length === 0) {
                const agentId = ticket.assignedTo?._id?.toString() || 'unassigned';

                if (!ticketsByAgent.has(agentId)) {
                    ticketsByAgent.set(agentId, []);
                }
                ticketsByAgent.get(agentId)!.push(ticket);
            }
        }

        // Send emails to each agent
        for (const [agentId, tickets] of ticketsByAgent.entries()) {
            if (agentId === 'unassigned') {
                // Send to all agents if unassigned
                const agents = await User.find({ role: 'agent' });
                for (const agent of agents) {
                    await sendReminderEmail(agent.email, agent.name, tickets.length);
                }
            } else {
                const agent = tickets[0].assignedTo;
                if (agent) {
                    await sendReminderEmail(agent.email, agent.name, tickets.length);
                }
            }
        }

        console.log(`Reminders sent for ${pendingTickets.length} tickets`);
    } catch (error) {
        console.error('Error in reminder cron job:', error);
    }
}

// For manual testing
export { checkPendingTickets };
