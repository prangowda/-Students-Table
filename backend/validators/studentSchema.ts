/**
 * validators/studentSchema.ts
 * Zod schemas for validating request bodies for student CRUD operations.
 */

import { z } from 'zod';

/** Schema for POST /api/students — all fields required */
export const createStudentSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(255, 'Email too long'),

  age: z
    .number({ required_error: 'Age is required', invalid_type_error: 'Age must be a number' })
    .int('Age must be a whole number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be 120 or below'),
});

/** Schema for PUT /api/students/:id — all fields optional but at least one must be provided */
export const updateStudentSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z.string().trim().email().max(255).optional(),
    age: z.number().int().min(1).max(120).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

/** TypeScript types inferred from schemas */
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
