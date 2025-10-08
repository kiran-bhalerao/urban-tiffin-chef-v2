export function formateFullDate(
  date?: string,
  local: string = "en",
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
) {
  const locales = local === "en" ? "en-US" : `${local}-IN`;
  const _date = date ? new Date(date) : new Date();

  return _date.toLocaleDateString(locales, options);
}
