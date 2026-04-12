export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone);
}

export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function isFutureDate(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}
