/** Couleurs des espaces, reprises de la maquette HTML. */
const COLORS: Record<string, string> = {
  bourse: "#007aff",
  economie: "#3d5a80",
  epargne: "#34c759",
  "assurance-vie": "#30b0c7",
  immobilier: "#ff9500",
  impots: "#5856d6",
  retraite: "#ff2d55",
  transmission: "#af52de",
  alternatifs: "#00c7be",
  budget: "#8e8e93",
  cafe: "#a2845e",
};

export const categoryColor = (slug: string) => COLORS[slug] ?? "#6e6e73";
