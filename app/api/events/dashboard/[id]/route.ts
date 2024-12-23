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
            id: parseInt(id)
        },
        include: {
            user_events: true
        }
    });

    if (!q) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const totalTickets = q.user_events.reduce((acc, user_event) => {
        return acc + (user_event.qty ?? 0);
    }, 0);
    const totalIncome = (q.price ?? 0) * totalTickets;
    const totalFollower = q.user_events.length;

    const user_events = q.user_events.reduce((acc: { [key: string]: number }, user_event: user_events) => {
        const date = user_event.created_at.toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date]++;
        return acc;
    }, {});
    const totalEvent = Object.keys(user_events).map(date => ({
        date,
        count: user_events[date]
    }));

    const lastUserTrx = q.user_events.slice(0, 5);
    const eventName = q.name;
    const data = {
        eventName,
        totalTickets,
        totalIncome,
        totalFollower,
        totalEvent,
    };
    return NextResponse.json({data});
}
