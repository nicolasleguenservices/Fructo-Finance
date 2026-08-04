import { format } from "date-fns";

const dateFormat = (
  date: Date | string,
  pattern: string = "dd MMM, yyyy",
): string => {
  const dateObj = new Date(date);
  // Les dates de frontmatter ("2026-07-30") sont coercées en UTC minuit ; on
  // compense le décalage du fuseau local pour éviter d'afficher la veille.
  const utcSafeDate = new Date(
    dateObj.getTime() + dateObj.getTimezoneOffset() * 60000,
  );
  const output = format(utcSafeDate, pattern);
  return output;
};

export default dateFormat;
