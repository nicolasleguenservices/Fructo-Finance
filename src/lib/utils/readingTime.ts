/**
 * Estime le temps de lecture d'un contenu Markdown/MDX.
 * Base : ~200 mots/minute (lecture FR courante), minimum 1 minute.
 */
const readingTime = (content: string): string => {
  const text = content
    .replace(/```[\s\S]*?```/g, " ") // blocs de code
    .replace(/<[^>]+>/g, " ") // balises
    .replace(/[#*_>`~\-|]/g, " "); // ponctuation Markdown
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min de lecture`;
};

export default readingTime;
