import { TZDate } from "@date-fns/tz";
import { format, intlFormat } from "date-fns";

export type IndoZone = "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura";

export const getCurrentIndoDate = (zone: IndoZone = "Asia/Jakarta") => {
  return new TZDate(new Date(), zone);
};

export const getFormattedIndoDate = (
  formatStr: string = "EEEE, dd MMM yyyy, HH:mm:ss",
  zone: IndoZone = "Asia/Jakarta",
) => {
  const date = getCurrentIndoDate(zone);

  return format(date, formatStr);
};

export const formatIndoDate = (
  date: Date | string,
  formatOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  },
) => {
  const tzDate = new TZDate(new Date(date), formatOptions.timeZone as IndoZone);

  return intlFormat(tzDate, formatOptions, {
    locale: "id-ID",
  });
};
