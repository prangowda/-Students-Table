/**
 * validation.js
 * Client-side validation helpers for student form fields.
 */

/**
 * Validates required student fields.
 * @param {{ name: string, email: string, age: string|number }} data
 * @returns {{ valid: boolean, errors: { name?: string, email?: string, age?: string } }}
 */
export function validateStudent(data) {
  const errors = {};

  // --- Name ---
  if (!data.name || String(data.name).trim() === '') {
    errors.name = 'Name is required.';
  } else if (String(data.name).trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (String(data.name).trim().length > 100) {
    errors.name = 'Name must be under 100 characters.';
  }

  // --- Email ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || String(data.email).trim() === '') {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(String(data.email).trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  // --- Age ---
  const ageVal = data.age === '' || data.age === undefined || data.age === null ? null : Number(data.age);
  if (ageVal === null || data.age === '') {
    errors.age = 'Age is required.';
  } else if (!Number.isInteger(ageVal)) {
    errors.age = 'Age must be a whole number.';
  } else if (ageVal < 1 || ageVal > 120) {
    errors.age = 'Age must be between 1 and 120.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
