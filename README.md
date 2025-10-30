# TicketBoss - Event Ticketing API

A real-time event ticketing API with optimistic concurrency control for seat reservations. Built for a Node.js Meet-up with 500 seats, providing instant accept/deny responses for external partners.

## Features

- ✅ Real-time seat reservations with instant responses
- ✅ Optimistic concurrency control to prevent over-selling
- ✅ RESTful API design with proper HTTP status codes
- ✅ Input validation and comprehensive error handling
- ✅ SQLite database with Drizzle ORM
- ✅ Automatic database seeding on startup

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TicketBoss
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Access the API**
   - Base URL: `http://localhost:3000`
   - API endpoints: `http://localhost:3000/api/demo/reservations`

The database will be automatically created and seeded with the Node.js Meet-up event on first startup.

## API Documentation

### Base URL
```
http://localhost:3000/api/demo
```

### Endpoints

#### 1. Create Reservation
**POST** `/reservations/`

Reserve seats for a partner.

**Request Body:**
```json
{
  "partnerId": "abc-corp",
  "seats": 3
}
```

**Responses:**

**201 Created** - Reservation successful
```json
{
  "reservationId": "res_1698765432_abc123def",
  "seats": 3,
  "status": "confirmed"
}
```

**400 Bad Request** - Invalid input
```json
{
  "error": "Seats must be at least 1"
}
```

**409 Conflict** - Not enough seats available
```json
{
  "error": "Not enough seats left"
}
```

**Validation Rules:**
- `partnerId`: Required, non-empty string
- `seats`: Integer between 1 and 10 (maximum per request)

---

#### 2. Get Event Summary
**GET** `/reservations/`

Get current event status and availability.

**Response:**

**200 OK**
```json
{
  "eventId": "node-meetup-2025",
  "name": "Node.js Meet-up",
  "totalSeats": 500,
  "availableSeats": 42,
  "reservationCount": 458,
  "version": 14
}
```

---

#### 3. Cancel Reservation
**DELETE** `/reservations/:reservationId`

Cancel an existing reservation and return seats to the pool.

**Parameters:**
- `reservationId`: The unique reservation identifier

**Responses:**

**204 No Content** - Reservation cancelled successfully (no response body)

**404 Not Found** - Reservation not found or already cancelled
```json
{
  "error": "Reservation not found or already cancelled"
}
```

---

## Technical Decisions

### Architecture Choices

1. **Next.js App Router**: Chosen for its built-in API routes and modern React features
2. **SQLite + Drizzle ORM**: Lightweight database solution with type-safe queries
3. **Optimistic Concurrency Control**: Uses version numbers to prevent race conditions
4. **Zod Validation**: Runtime type checking and validation for API inputs

### Storage Method

- **Database**: SQLite for development (easily replaceable with PostgreSQL/MySQL for production)
- **Schema**: Two main tables - `events` and `reservations`
- **Seeding**: Automatic database initialization with required event data

### Concurrency Control

The API implements optimistic concurrency control using version numbers:

1. Each event has a `version` field that increments with every update
2. When updating seat availability, the query includes the current version
3. If another request modified the event (version changed), the operation fails
4. This prevents over-selling while maintaining high performance

### Error Handling

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Resource not found (event or reservation)
- **409 Conflict**: Business logic conflicts (not enough seats, version mismatch)
- **500 Internal Server Error**: Unexpected server errors

## Assumptions

1. **Single Event**: The system is designed for one event ("Node.js Meet-up")
2. **Partner Trust**: Partner IDs are accepted as provided (no authentication implemented)
3. **Seat Limits**: Maximum 10 seats per reservation to prevent bulk booking abuse
4. **Development Database**: SQLite is used for simplicity (production would use PostgreSQL)
5. **No Payment Integration**: Reservations are confirmed immediately without payment processing

## Database Schema

### Events Table
```sql
CREATE TABLE events (
  event_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
  reservation_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(event_id),
  partner_id TEXT NOT NULL,
  seats INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## Testing the API

### Example cURL Commands

**Create a reservation:**
```bash
curl -X POST http://localhost:3000/api/demo/reservations \
  -H "Content-Type: application/json" \
  -d '{"partnerId": "test-partner", "seats": 2}'
```

**Get event summary:**
```bash
curl http://localhost:3000/api/demo/reservations
```

**Cancel a reservation:**
```bash
curl -X DELETE http://localhost:3000/api/demo/reservations/res_1698765432_abc123def
```

