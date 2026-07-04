import { formatInTimeZone } from "date-fns-tz";

export const parseSLDate = (val: any): Date => {
  if (!val) return new Date();

  // If Firestore Timestamp (duck typing)
  if (val && typeof val.toDate === "function") {
    return val.toDate();
  }

  // If Firestore Timestamp raw object
  if (val && typeof val === "object" && ("_seconds" in val || "seconds" in val)) {
    const s = val._seconds ?? val.seconds;
    const ns = val._nanoseconds ?? val.nanoseconds ?? 0;
    return new Date(s * 1000 + ns / 1000000);
  }

  if (typeof val === "string") {
    // Matches DD/MM/YYYY, hh:mm:ss a or DD/MM/YYYY, h:mm:ss a
    const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm|AM|PM)$/i);
    if (match) {
      const [_, day, month, year, hoursStr, minutes, seconds, ampm] = match;
      let hours = parseInt(hoursStr, 10);
      if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
      return new Date(`${year}-${month}-${day}T${hours.toString().padStart(2, '0')}:${minutes}:${seconds}+05:30`);
    }
  }

  return new Date(val);
};

export const toSafeLocaleString = (val: any) => {
  if (!val) {
    console.log(
      "[UtilService] toSafeLocaleString → value is null or undefined"
    );
    return null;
  }

  try {
    const date = parseSLDate(val);

    if (isNaN(date.getTime())) {
      console.warn(
        "[UtilService] Invalid date, returning original value:",
        val
      );
      return String(val);
    }

    const timeZone = "Asia/Colombo";
    const format = "dd/MM/yyyy, hh:mm:ss a";
    const formatted = formatInTimeZone(date, timeZone, format);

    console.log("[UtilService] Formatted date:", formatted);
    return formatted;
  } catch (error) {
    console.error("[UtilService] Error in toSafeLocaleString:", error, val);
    return String(val);
  }
};

export const formatSLDate = (val: any, formatStr: string = "MMM dd, yyyy h:mm a") => {
  if (!val) return "";
  try {
    const date = parseSLDate(val);
    if (isNaN(date.getTime())) {
      return String(val);
    }
    return formatInTimeZone(date, "Asia/Colombo", formatStr);
  } catch (error) {
    console.error("[UtilService] Error in formatSLDate:", error, val);
    return String(val);
  }
};

