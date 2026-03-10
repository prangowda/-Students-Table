# Students Table Manager — Full-Stack

A production-ready full-stack Students Management System built with **React (Vite)**, **Next.js API**, and **PostgreSQL via Prisma**.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)

---

## Project Structure

```
students-table-manager/
├── frontend/               ← React 18 + Vite (served on :5173)
│   ├── src/
│   │   ├── components/     ← UI components (Table, Form, Dialog, etc.)
│   │   ├── pages/          ← Home.jsx (main orchestrator page)
│   │   ├── services/       ← api.js  ← Axios service layer
│   │   └── utils/          ← validation.js, excelExport.js
│   ├── .env.example
│   └── package.json
│
├── backend/                ← Next.js 14 App Router API (served on :3000)
│   ├── app/api/students/   ← GET + POST endpoint
│   │   └── [id]/           ← PUT + DELETE endpoint
│   ├── lib/                ← Prisma client singleton
│   ├── services/           ← studentService.ts (DB queries)
│   ├── validators/         ← Zod schemas
│   ├── prisma/
│   │   ├── schema.prisma   ← Student model
│   │   └── seed.ts         ← Sample data seeder
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 6, Tailwind CSS 3, Axios, xlsx |
| Backend | Next.js 14 (App Router), TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Validation | Zod |
| Notifications | react-hot-toast |
| Deployment | Vercel (frontend + backend), Neon/Railway (DB) |

---

## Getting Started

### 1. Database Setup

Provision a free PostgreSQL database:
- **[Neon](https://neon.tech)** (recommended, serverless, free tier)
- **[Railway](https://railway.app)** (free trial)
- **[Supabase](https://supabase.com)** (generous free tier)

Copy your connection string — you'll need it in the next step.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma migrate dev --name init

# (Optional) Seed with sample data
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# Start the API server
npm run dev
# Runs at http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# .env already contains: VITE_API_URL=http://localhost:3000/api

# Start the dev server
npm run dev
# Runs at http://localhost:5173
```

---

## API Reference

Base URL: `http://localhost:3000/api`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/students` | List students (paginated, filtered, sorted) |
| `POST` | `/students` | Create a new student |
| `PUT` | `/students/:id` | Update a student |
| `DELETE` | `/students/:id` | Delete a student |

### GET `/api/students`

Query parameters:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Filter by name or email (case-insensitive) |
| `page` | int | 1 | Page number |
| `limit` | int | 8 | Items per page (max 200) |
| `sortBy` | string | `name` | Field: `name`, `email`, `age`, `createdAt` |
| `sortDir` | string | `asc` | Direction: `asc` or `desc` |
| `ageMin` | int | — | Minimum age (inclusive) |
| `ageMax` | int | — | Maximum age (inclusive) |

**Response**:
```json
{
  "data": [{ "id": 1, "name": "Alice", "email": "alice@example.com", "age": 21 }],
  "total": 10,
  "page": 1,
  "totalPages": 2
}
```

### POST `/api/students`

**Body**:
```json
{ "name": "Alice Johnson", "email": "alice@example.com", "age": 21 }
```

**Validation rules**: name (2-100 chars), valid email, age (1-120, integer).  
**Response**: `201 Created` with the new student object.

### PUT `/api/students/:id`

Same body as POST (all fields optional). **Response**: `200 OK` with updated student.

### DELETE `/api/students/:id`

No body required. **Response**: `200 OK` with `{ "message": "..." }`.

### Error Responses

```json
{ "error": "Validation failed", "details": { "email": ["Invalid email"] } }
{ "error": "Student not found" }
{ "error": "A student with this email already exists" }
```

---

## Features

| Feature | Details |
|---------|---------|
| **CRUD** | Add, Edit (pre-filled modal), Delete (confirm dialog) |
| **Search** | Live search by name or email |
| **Filter** | Age min/max range filter |
| **Sort** | Click any column header to sort asc/desc |
| **Pagination** | Server-side, 8 per page with ellipsis controls |
| **Excel Export** | Download all students or filtered subset as `.xlsx` |
| **Toast Notifications** | Success/error feedback on every action |
| **Loading Spinner** | 2.5s loading screen on initial page load |
| **Responsive** | Mobile-first dark-theme layout |

---

## Deployment

### Frontend → Vercel / Netlify

```bash
cd frontend
npm run build
```

**Vercel**: Import repo → set `VITE_API_URL` to your deployed backend URL → Deploy.  
**Netlify**: Build command `npm run build`, publish dir `dist`. Add env var `VITE_API_URL`.

### Backend → Vercel (Serverless)

```bash
cd backend
# Ensure DATABASE_URL is set in Vercel project env vars
vercel deploy
```

Add environment variables in the Vercel dashboard:
- `DATABASE_URL` — your production Neon/Railway connection string

### Database → Neon (Recommended)

1. Create project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Run migration: `npx prisma migrate deploy`

---

## Database Schema

```sql
CREATE TABLE students (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR NOT NULL,
  email      VARCHAR UNIQUE NOT NULL,
  age        INTEGER NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);
```

---

## License

MIT
