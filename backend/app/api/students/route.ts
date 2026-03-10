/**
 * app/api/students/route.ts
 * Handles collection-level operations:
 *   GET  /api/students  — list with search, pagination, sort, age filter
 *   POST /api/students  — create a new student
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { listStudents, createStudent } from '../../../services/studentService';
import { createStudentSchema } from '../../../validators/studentSchema';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Parse a query-string integer; returns undefined if absent or not a valid int */
function parseIntParam(value: string | null): number | undefined {
  if (value === null || value === '') return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
}

/** Build a standard error JSON response */
function errorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

// ── GET /api/students ────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const params = {
      search: searchParams.get('search') ?? undefined,
      page: parseIntParam(searchParams.get('page')) ?? 1,
      limit: parseIntParam(searchParams.get('limit')) ?? 8,
      sortBy: (searchParams.get('sortBy') as 'name' | 'email' | 'age' | 'createdAt') ?? 'name',
      sortDir: (searchParams.get('sortDir') as 'asc' | 'desc') ?? 'asc',
      ageMin: parseIntParam(searchParams.get('ageMin')),
      ageMax: parseIntParam(searchParams.get('ageMax')),
    };

    // Validate sortBy to prevent injection
    const allowedSortFields = ['name', 'email', 'age', 'createdAt'];
    if (!allowedSortFields.includes(params.sortBy)) {
      params.sortBy = 'name';
    }
    if (!['asc', 'desc'].includes(params.sortDir)) {
      params.sortDir = 'asc';
    }

    const result = await listStudents(params);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('[GET /api/students]', err);
    return errorResponse('Failed to fetch students', 500);
  }
}

// ── POST /api/students ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod (coerce age to number in case it arrives as a string)
    const parsed = createStudentSchema.safeParse({
      ...body,
      age: typeof body.age === 'string' ? parseInt(body.age, 10) : body.age,
    });

    if (!parsed.success) {
      return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors);
    }

    const student = await createStudent(parsed.data);
    return NextResponse.json(student, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/students]', err);

    // Prisma unique constraint violation (email already exists)
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return errorResponse('A student with this email already exists', 409);
    }

    if (err instanceof z.ZodError) {
      return errorResponse('Validation failed', 422, err.flatten().fieldErrors);
    }

    return errorResponse('Failed to create student', 500);
  }
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
