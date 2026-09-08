import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date en français québécois pour l'affichage éditorial.
 * Les dates de frontmatter ("2026-08-27") sont coercées en UTC minuit ;
 * on compense le décalage du fuseau local pour éviter d'afficher la veille.
 *
 * @param pattern  jeton date-fns — ex. "d MMMM yyyy" → « 27 août 2026 »,
 *                 "MMMM yyyy" → « août 2026 ».
 */
const frenchDate = (
  date: Date | string,
  pattern: string = "d MMMM yyyy",
): string => {
  const dateObj = new Date(date);
  const utcSafe = new Date(
    dateObj.getTime() + dateObj.getTimezoneOffset() * 60000,
  );
  return format(utcSafe, pattern, { locale: fr });
};

export default frenchDate;
