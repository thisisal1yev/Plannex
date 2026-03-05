import { compare, genSalt, hash } from 'bcrypt';

/**
 * Hashes a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10);
  return hash(password, salt);
}

/**
 * Compares a plain password with a hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return compare(password, hashedPassword);
}
