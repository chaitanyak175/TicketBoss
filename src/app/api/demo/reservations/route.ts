import { NextRequest, NextResponse } from "next/server";
import { db, events, reservations } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { seedDatabase } from "@/lib/db/seed";
import { z } from "zod";

const createReservationSchema = z.object({
  partnerId: z.string().min(1, "Partner ID is required"),
  seats: z.number().int().min(1, "Seats must be at least 1").max(10, "Maximum 10 seats per request"),
});

let isInitialized = false;

async function initializeDatabase() {
  if (!isInitialized) {
    try {
      await seedDatabase();
      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    
    const validation = createReservationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { partnerId, seats } = validation.data;

    const [event] = await db.select().from(events).where(eq(events.eventId, 'node-meetup-2025')).limit(1);
    
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (event.availableSeats < seats) {
      return NextResponse.json(
        { error: "Not enough seats left" },
        { status: 409 }
      );
    }

    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const updateResult = await db.update(events)
        .set({
          availableSeats: event.availableSeats - seats,
          version: event.version + 1,
          updatedAt: new Date().toISOString(),
        })
        .where(and(
          eq(events.eventId, 'node-meetup-2025'),
          eq(events.version, event.version)
        ));

      await db.insert(reservations).values({
        reservationId,
        eventId: 'node-meetup-2025',
        partnerId,
        seats,
        status: 'confirmed',
      });

      return NextResponse.json(
        {
          reservationId,
          seats,
          status: "confirmed"
        },
        { status: 201 }
      );

    } catch (error) {
      return NextResponse.json(
        { error: "Reservation conflict, please try again" },
        { status: 409 }
      );
    }

  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initializeDatabase();

    const [event] = await db.select().from(events).where(eq(events.eventId, 'node-meetup-2025')).limit(1);
    
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const activeReservations = await db.select().from(reservations)
      .where(and(
        eq(reservations.eventId, 'node-meetup-2025'),
        eq(reservations.status, 'confirmed')
      ));

    const reservationCount = activeReservations.reduce((total: number, reservation) => total + reservation.seats, 0);

    return NextResponse.json({
      eventId: event.eventId,
      name: event.name,
      totalSeats: event.totalSeats,
      availableSeats: event.availableSeats,
      reservationCount,
      version: event.version
    });

  } catch (error) {
    console.error("Error getting event summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
