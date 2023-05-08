export default function validateUsername(
  input: string
): { valid: true } | { valid: false; msg: string } {
  if (input.length < 3) {
    return { valid: false, msg: 'Username must be at least 3 characters' };
  }

  if (input.length > 16) {
    return { valid: false, msg: "Username can't be longer than 16 characters" };
  }

  if (input.match(/[^A-Za-z0-9]/)) {
    return {
      valid: false,
      msg: 'Username can only include latin letters and numbers',
    };
  }

  return { valid: true };
}