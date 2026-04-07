import type { Dog } from "./dogs";
import { GAB_ADOPTION, GAB_DONATE, GAB_SITE, GAB_VOLUNTEER } from "./constants";

/** Entradas del índice (orden del libro) */
export const indiceEntries = [
  "¿Qué es GAB y cómo puedo colaborar?",
  "Cachorros para adoptar",
  "Cachorros adoptados",
  "Homenaje — cachorros que fueron parte de la familia y ahora son un recuerdo eterno",
] as const;

export const sectionIntroQueEsGab = `Somos voluntarios por el bodeguero andaluz. En la web encontrarás quiénes somos, cómo ayudamos y cómo sumarte.

Puedes colaborar con un donativo, haciéndote voluntario o difundiendo adopciones y eventos.`;

export const sectionIntroAdoptar = `En las páginas que siguen encontrarás historias reales de perros que buscan familia. Cada relato es una invitación a conocerlos y, si encajáis, a iniciar el proceso de adopción en la web de GAB.`;

export const sectionIntroAdoptados = `Este apartado está pensado para las familias que ya han adoptado: un hueco en el libro impreso para celebrar a quienes ya tienen hogar y seguir escribiendo su historia a mano.`;

export const sectionIntroHomenaje = `Aquí recordamos con cariño a los compañeros que ya no están. En papel podréis añadir nombre, fechas y unas palabras; en esta preview mostramos una plantilla vacía respetuosa.`;

/** Plantilla: cachorro adoptado (sin foto, emoji en el círculo) */
export const templateAdoptedDog: Dog = {
  slug: "plantilla-adoptados",
  name: "Tu adoptado",
  age: "—",
  size: "—",
  tagline: "Plantilla para el libro en papel",
  emojiAvatar: "🐕",
  storyLeft:
    "Espacio reservado para un cachorro ya adoptado. En la edición impresa podrás pegar una foto en el círculo y escribir su nombre.\n\nEsta vista muestra solo una plantilla: el círculo lleva un emoji como marcador de posición.",
  storyRight:
    "Continúa aquí su historia en familia: primeros días, rutinas, cariño… Las páginas siguientes son huecos punteados para fotos y relato a mano, igual que en el resto del libro.",
  profileUrl: GAB_SITE,
  deliveryChecklist: ["Plantilla · sin datos reales en la preview digital"],
};

/** Plantilla: homenaje */
export const templateMemorialDog: Dog = {
  slug: "plantilla-homenaje",
  name: "En memoria",
  age: "—",
  size: "—",
  tagline: "Recuerdo eterno",
  emojiAvatar: "🕯️",
  storyLeft:
    "Hueco para honrar a un compañero que fue parte de la familia GAB y que ya no está. En papel: nombre, fechas breves y lo que quieras recordar.",
  storyRight:
    "Las páginas que siguen son plantillas vacías (estado, fotos, relato) para que en la edición impresa completes a mano con respeto y cariño.",
  profileUrl: `${GAB_SITE}`,
  deliveryChecklist: ["Plantilla conmemorativa"],
};

export const gabColaborarLinks = [
  { label: "Web GAB", href: GAB_SITE },
  { label: "Donativos", href: GAB_DONATE },
  { label: "Voluntariado", href: GAB_VOLUNTEER },
  { label: "En adopción", href: GAB_ADOPTION },
] as const;
