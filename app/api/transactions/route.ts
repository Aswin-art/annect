import { joinEvent } from "@/actions/userEventAction";
import snap from "@/lib/midtrans";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    body.transaction_details.order_id = orderId;

    const transaction = await snap.createTransaction(body);

    if (body.payment_type === "user_event") {
      await joinEvent(body.event.id, body.event.price, body.event.price);
    }

    return Response.json(
      {
        message: "Success",
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to create transaction",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
