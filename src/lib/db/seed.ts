import { db, events, reservations } from './index';
import { eq, sql } from 'drizzle-orm';

export async function seedDatabase() {
  try {
    console.log('🔧 Initializing database tables...');
    
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS events (
        event_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        total_seats INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        version INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS reservations (
        reservation_id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL REFERENCES events(event_id),
        partner_id TEXT NOT NULL,
        seats INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'confirmed',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    console.log('✅ Database tables created successfully');

    const existingEvent = await db.select().from(events).where(eq(events.eventId, 'node-meetup-2025')).limit(1);
    
    if (existingEvent.length === 0) {
      await db.insert(events).values({
        eventId: 'node-meetup-2025',
        name: 'Node.js Meet-up',
        totalSeats: 500,
        availableSeats: 500,
        version: 0,
      });
      
      console.log('✅ Database seeded successfully with Node.js Meet-up event');
    } else {
      console.log('✅ Event already exists, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
