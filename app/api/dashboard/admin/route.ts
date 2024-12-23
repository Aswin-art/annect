import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: NextRequest, res: NextResponse) {
    const events = await prisma.events.findMany({
        take: 10,
        orderBy: {
            created_at: "desc",
        },
    });
    const eventTotal = await prisma.events.count();
    const eventByDate = await prisma.events.groupBy({
        by: ["event_date"],
        _count: {
            id: true,
        },
    });
    const eventCount = eventByDate.map(event => ({
        // date: event.event_date ? new Date(event.event_date).toLocaleDateString('id-ID') : null, 
        date: event.event_date, 
        count: event._count.id,
    }));

    const user = await prisma.users.findMany({
        take: 10,
        orderBy: {
            created_at: "desc",
        },
    });
    const userTotal = await prisma.users.count();

    const chanelTotal = await prisma.channels.count();
    const channels = await prisma.channels.findMany({
        take: 10,
        orderBy: {
            created_at: "desc",
        },
    });

    const eventData = await prisma.events.findMany({
        include: {
            user_events: true,
        },
    });
    const eventsWithTotalPrice = eventData.map(event => {
        const totalPrice = event.user_events.reduce((sum, userEvent) => {
            return sum + ((event.price ?? 0) * userEvent.qty);
        }, 0);
    
        return {
            ...event,
            totalPrice,
        };
    });
    const totalIncome = eventsWithTotalPrice.reduce((sum, event) => sum + event.totalPrice, 0);
    
    const countEventRunning = await prisma.events.count({
        where: {
            event_date: {
                gte: new Date(),
            },
        },
    });
    const eventRunning = await prisma.events.findMany({
        where: {
            event_date: {
                gte: new Date(),
            },
        },
        take: 10,
    });

    const transaction = await prisma.user_events.findMany({
        take: 5,
        orderBy: {
            created_at: "desc",
        },
        include: {
            events: true,
            users: true,
        },
    });
    console.log("transaction", transaction);

    const data = {
        // events : events,
        transaction : transaction,
        eventCount : eventCount,
        eventTotal : eventTotal,
        user : user,
        userTotal : userTotal,
        chanelTotal : chanelTotal,
        channels : channels,
        totalIncome : totalIncome,
        countEventRunning : countEventRunning,
        eventRunning : eventRunning,
    };

    return NextResponse.json({ data });
}