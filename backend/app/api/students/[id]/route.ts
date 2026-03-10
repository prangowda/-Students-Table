/**
 * app/api/students/[id]/route.ts
 * Handles individual student operations:
 *   PUT    /api/students/:id  — update a student
 *   DELETE /api/students/:id  — delete a student
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateStudent, deleteStudent } from '../../../../services/studentService';
import { updateStudentSchema } from '../../../../validators/studentSchema';

// ── Helpers ───────────────────────────────────────────────────────────────────

function errorResponse(message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

/** Extract and validate the :id segment */
function parseId(params: { id: string }): number | null {
  const id = parseInt(params.id, 10);
  return isNaN(id) || id < 1 ? null : id;
}

// ── PUT /api/students/:id ────────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params);
    if (id === null) {
      return errorResponse('Invalid student ID', 400);
    }

    const body = await request.json();

    const parsed = updateStudentSchema.safeParse({
      ...body,
      age: body.age !== undefined
        ? (typeof body.age === 'string' ? parseInt(body.age, 10) : body.age)
        : undefined,
    });

    if (!parsed.success) {
      return errorResponse('Validation failed', 422, parsed.error.flatten().fieldErrors);
    }

    const student = await updateStudent(id, parsed.data);
    if (!student) {
      return errorResponse('Student not found', 404);
    }

    return NextResponse.json(student, { status: 200 });
  } catch (err: unknown) {
    console.error(`[PUT /api/students/${params.id}]`, err);

    // Prisma unique constraint (email conflict)
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

    return errorResponse('Failed to update student', 500);
  }
}

// ── DELETE /api/students/:id ──────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseId(params);
    if (id === null) {
      return errorResponse('Invalid student ID', 400);
    }

    const deleted = await deleteStudent(id);
    if (!deleted) {
      return errorResponse('Student not found', 404);
    }

    return NextResponse.json(
      { message: `Student "${deleted.name}" deleted successfully` },
      { status: 200 }
    );
  } catch (err) {
    console.error(`[DELETE /api/students/${params.id}]`, err);
    return errorResponse('Failed to delete student', 500);
  }
}

// Handle preflight OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
