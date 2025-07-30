import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Recursively remove all properties with `undefined` values from an object.
export function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => removeUndefinedFields(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = removeUndefinedFields(value as any);
    }
  });
  return result as T;
}
