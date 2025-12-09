import { NextResponse } from 'next/server';
import { checkPendingTickets } from '@/lib/cronJobs';

/**
 * GET /api/cron/test
 * Endpoint to manually test the cron jobs function
 */
export async function GET() {
    try {
        console.log('Running manual cron job test...');
        await checkPendingTickets();
        return NextResponse.json(
            {
                message: 'Cron job test executed successfully',
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in cron job test:', error);
        return NextResponse.json(
            { error: 'Error executing cron job test' },
            { status: 500 }
        );
    }
}
