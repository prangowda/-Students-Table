/**
 * services/studentService.ts
 * Database query functions for the Student entity using Prisma.
 * All business logic concerning data access lives here, keeping routes thin.
 */

import { prisma } from '../lib/prisma';
import type { CreateStudentInput, UpdateStudentInput } from '../validators/studentSchema';
import type { Prisma } from '@prisma/client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ListStudentsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'age' | 'createdAt';
  sortDir?: 'asc' | 'desc';
  ageMin?: number;
  ageMax?: number;
}

export interface ListStudentsResult {
  data: Awaited<ReturnType<typeof prisma.student.findMany>>;
  total: number;
  page: number;
  totalPages: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a Prisma WHERE clause from search/age params */
function buildWhere(params: ListStudentsParams): Prisma.StudentWhereInput {
  const where: Prisma.StudentWhereInput = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { email: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.ageMin !== undefined || params.ageMax !== undefined) {
    where.age = {};
    if (params.ageMin !== undefined) where.age.gte = params.ageMin;
    if (params.ageMax !== undefined) where.age.lte = params.ageMax;
  }

  return where;
}

// ── Service functions ─────────────────────────────────────────────────────────

/**
 * Fetch a paginated, filtered, sorted list of students.
 */
export async function listStudents(params: ListStudentsParams): Promise<ListStudentsResult> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(200, Math.max(1, params.limit ?? 8)); // cap at 200
  const skip = (page - 1) * limit;
  const sortBy = params.sortBy ?? 'name';
  const sortDir = params.sortDir ?? 'asc';

  const where = buildWhere(params);

  const [data, total] = await prisma.$transaction([
    prisma.student.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      skip,
      take: limit,
    }),
    prisma.student.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

/**
 * Find a single student by primary key. Returns null if not found.
 */
export async function findStudentById(id: number) {
  return prisma.student.findUnique({ where: { id } });
}

/**
 * Create a new student record.
 */
export async function createStudent(input: CreateStudentInput) {
  return prisma.student.create({ data: input });
}

/**
 * Update an existing student. Returns null if the student does not exist.
 */
export async function updateStudent(id: number, input: UpdateStudentInput) {
  // Check existence first to give a proper 404
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.student.update({ where: { id }, data: input });
}

/**
 * Delete a student by id. Returns null if the student does not exist.
 */
export async function deleteStudent(id: number) {
  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.student.delete({ where: { id } });
}
