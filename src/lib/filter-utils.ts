/**
 * Normalizes attribute values for consistent filtering.
 * Handles Length, Color, Density, and general attributes.
 */

export function normalizeAttributeValue(attribute: string, value: string): string {
  const attr = attribute.toLowerCase();
  const val = value.trim();

  if (attr === "length") {
    // Extract numeric part
    const numericMatch = val.match(/(\d+)/);
    if (numericMatch) {
      return `${numericMatch[1]}"`;
    }
    return val;
  }

  if (attr === "color") {
    // Trim and capitalize first letter of each word
    return val
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  if (attr === "density") {
    // Ensure % is present and numeric is consistent
    const numericMatch = val.match(/(\d+)/);
    if (numericMatch) {
      return `${numericMatch[1]}%`;
    }
    return val;
  }

  // General normalization
  return val.charAt(0).toUpperCase() + val.slice(1);
}

/**
 * Sorts attribute values intelligently.
 * Lengths sort numerically, others alphabetically.
 */
export function sortAttributeValues(attribute: string, values: string[]): string[] {
  const attr = attribute.toLowerCase();

  if (attr === "length") {
    return [...values].sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.replace(/\D/g, "")) || 0;
      return numA - numB;
    });
  }

  return [...values].sort((a, b) => a.localeCompare(b));
}
