export function formatNum(num: number | string | undefined): string {
  if (num === undefined || num === null) return "0";

  num = Number(num); // Convert to a number

  if (isNaN(num)) return "0"; // Handle invalid numbers

  if (num >= 1_000_000_000) {
    return formatWithSuffix(num, 1_000_000_000, "b"); // Billion
  } else if (num >= 1_000_000) {
    return formatWithSuffix(num, 1_000_000, "m"); // Million
  } else if (num >= 10_000) {
    return formatWithSuffix(num, 1_000, "k"); // Thousand
  } else {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas for thousands
  }
}

// Helper function to format with a suffix and remove unnecessary ".0"
function formatWithSuffix(
  num: number,
  divisor: number,
  suffix: string
): string {
  const formattedNum = (num / divisor).toFixed(1);
  return formattedNum.endsWith(".0")
    ? formattedNum.slice(0, -2) + suffix // Remove ".0" if present
    : formattedNum + suffix;
}
