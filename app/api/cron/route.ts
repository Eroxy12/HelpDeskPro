import { NextResponse } from 'next/server';
import { initCronJobs } from '@/lib/cronJobs';

let cronInitialized = false;

export async function GET() {
    try {
        if (!cronInitialized) {
            initCronJobs();
            cronInitialized = true;
            return NextResponse.json(
                { message: 'Cron jobs inicializados exitosamente' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: 'Cron jobs ya están activos' },
                { status: 200 }
            );
        }
    } catch (error: any) {
        console.error('Error initializing cron jobs:', error);
        return NextResponse.json(
            { error: 'Error al inicializar cron jobs' },
            { status: 500 }
        );
    }
}
