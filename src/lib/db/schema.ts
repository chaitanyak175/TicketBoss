import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const events = sqliteTable('events', {
  eventId: text('event_id').primaryKey(),
  name: text('name').notNull(),
  totalSeats: integer('total_seats').notNull(),
  availableSeats: integer('available_seats').notNull(),
  version: integer('version').notNull().default(0),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

export const reservations = sqliteTable('reservations', {
  reservationId: text('reservation_id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.eventId),
  partnerId: text('partner_id').notNull(),
  seats: integer('seats').notNull(),
  status: text('status', { enum: ['confirmed', 'cancelled'] }).notNull().default('confirmed'),
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
