import { DateTime } from "luxon";

const dateStr = `03/06/2026 13:45:00`;
const date = DateTime.fromFormat(dateStr, "dd/MM/yyyy HH:mm:ss");
console.log (date.toFormat ("dd-MM-yyyy HH:mm:ss"));