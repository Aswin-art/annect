import { user_events } from './../../../../../node_modules/.prisma/client/index.d';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const q = await prisma.events.findUnique({
        where: {
            id: id
        },
        include: {
            user_events: true
        }
    });

    if (!q) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const totalTickets = q.user_events.length;
    const totalIncome = (q.price ?? 0) * totalTickets;

    const user_events = q.user_events.reduce((acc: { [key: string]: number }, user_event: user_events) => {
        const date = user_event.created_at.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date]++;
        return acc;
    }, {});
    const groupedUserEvents = Object.keys(user_events).map(date => ({
        date,
        count: user_events[date]
    }));

    const lastUserTrx = q.user_events.slice(0, 5);
    const eventName = q.name;
    return NextResponse.json({
        totalTickets,
        totalIncome,
        user_events,
        groupedUserEvents,
        // lastUserTrx,
        eventName
    });
}
