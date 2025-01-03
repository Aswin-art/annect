import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    const now = new Date();

    const eventsToUpdate = await db.events.findMany({
      where: {
        status: "ONGOING",
      },
    });

    const updatedEvents = [];
    for (const event of eventsToUpdate) {
      const deadline = new Date(event.created_at);
      deadline.setDate(deadline.getDate() + event.post_duration);

      if (deadline <= now) {
        const updatedEvent = await db.events.update({
          where: { id: event.id },
          data: { status: "DONE" },
        });
        updatedEvents.push(updatedEvent);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Event statuses updated successfully!",
        updatedCount: updatedEvents.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.log(err);
    return Response.json(
      {
        message: "Failed to execute task!",
      },
      { status: 500 }
    );
  }
}
