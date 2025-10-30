import { NextRequest, NextResponse } from "next/server";
import { db, events, reservations } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [reservation] = await db.select().from(reservations)
      .where(and(
        eq(reservations.reservationId, id),
        eq(reservations.status, 'confirmed')
      ))
      .limit(1);

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found or already cancelled" },
        { status: 404 }
      );
    }

    const [event] = await db.select().from(events)
      .where(eq(events.eventId, reservation.eventId))
      .limit(1);

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    try {
      await db.update(reservations)
        .set({
          status: 'cancelled',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(reservations.reservationId, id));

      await db.update(events)
        .set({
          availableSeats: event.availableSeats + reservation.seats,
          version: event.version + 1,
          updatedAt: new Date().toISOString(),
        })
        .where(and(
          eq(events.eventId, reservation.eventId),
          eq(events.version, event.version)
        ));

      return new NextResponse(null, { status: 204 });

    } catch (error) {
      console.error("Error cancelling reservation:", error);
      return NextResponse.json(
        { error: "Failed to cancel reservation" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error processing cancellation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
