import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import BookPage from "./BookPage";
import AudioControl from "./AudioControl";
import { dogs, type Dog } from "../data/dogs";
import {
  gabColaborarLinks,
  indiceEntries,
  sectionIntroAdoptados,
  sectionIntroAdoptar,
  sectionIntroHomenaje,
  sectionIntroQueEsGab,
  templateAdoptedDog,
  templateMemorialDog,
} from "../data/bookStructure";
import { gabCoverIntro, gabIntroLeft, gabIntroRight } from "../data/gabIntro";
import { GAB_ADOPTION, GAB_INSTAGRAM, GAB_SITE } from "../data/constants";

const GAB_CONTACT_EMAIL = "info@grupoayudabodegueros.org";
const COVER_IMAGE_SRC = `${import.meta.env.BASE_URL}cover-familia-gabeira.png`;

const PAGES_BEFORE_DOGS = 6;
const PAGES_PER_DOG = 5;
const PAGES_SECTION_TAIL = 2 + PAGES_PER_DOG + 2 + PAGES_PER_DOG + 1;

function paragraphs(text: string): ReactNode {
  return text
    .trim()
    .split(/\n\n+/)
    .map((block, i) => <p key={i}>{block.trim()}</p>);
}

function paragraphsWithBoldEmail(text: string): ReactNode {
  const emailRe = new RegExp(`(${GAB_CONTACT_EMAIL.replace(/\./g, "\\.")})`, "g");
  return text
    .trim()
    .split(/\n\n+/)
    .map((block, i) => (
      <p key={i}>
        {block.trim().split(emailRe).map((part, j) =>
          part === GAB_CONTACT_EMAIL ? <strong key={j}>{part}</strong> : part,
        )}
      </p>
    ));
}

function dogPhotoUrl(slug: string): string {
  return `https://picsum.photos/seed/gab-${slug}/640/640`;
}

type FlipBookRef = {
  pageFlip: () =>
    | {
        flipNext: (corner?: "top" | "bottom") => void;
        flipPrev: (corner?: "top" | "bottom") => void;
        flip: (pageIndex: number, corner?: "top" | "bottom") => void;
        getCurrentPageIndex: () => number;
        getPageCount: () => number;
      }
    | null
    | undefined;
};

const MOBILE_LAYOUT_MQ = "(max-width: 768px)";

function computeBookLayout(): { w: number; h: number; isMobileLayout: boolean } {
  if (typeof window === "undefined") return { w: 380, h: 540, isMobileLayout: false };
  const isMobileLayout = window.matchMedia(MOBILE_LAYOUT_MQ).matches;
  const vw = window.innerWidth;
  const sidePadding = isMobileLayout ? 20 : 28;
  if (isMobileLayout) {
    const pageW = Math.min(620, Math.max(260, Math.min(vw - sidePadding, 479)));
    const h = Math.min(780, Math.max(440, Math.round(pageW * 1.38)));
    return { w: pageW, h, isMobileLayout: true };
  }
  const maxTotal = Math.min(vw - sidePadding, 1320);
  const singlePage = Math.floor(Math.max(260, maxTotal / 2 - 10));
  const w = Math.min(620, singlePage);
  const h = Math.min(780, Math.max(420, Math.round(w * 1.38)));
  return { w, h, isMobileLayout: false };
}

function useBookLayout() {
  const [state, setState] = useState(computeBookLayout);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_LAYOUT_MQ);
    const update = () => setState(computeBookLayout());
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}

function defaultDeliveryChecklist(dog: Dog): string[] {
  return [`${dog.age} · ${dog.size}`, "Condiciones y documentación: consulta su ficha en grupoayudabodegueros.org"];
}

function countFlipPages(nDogs: number): number {
  return PAGES_BEFORE_DOGS + nDogs * PAGES_PER_DOG + PAGES_SECTION_TAIL;
}

export default function GabBook() {
  const bookRef = useRef<FlipBookRef | null>(null);
  const { w, h, isMobileLayout } = useBookLayout();
  const [bookOpened, setBookOpened] = useState(false);
  const [page, setPage] = useState(0);

  const pageCount = useMemo(() => countFlipPages(dogs.length), []);

  const onFlip = useCallback((e: { data: number }) => {
    setPage(typeof e.data === "number" ? e.data : 0);
  }, []);

  const onInit = useCallback((e: { data: { page: number } }) => {
    setPage(e.data?.page ?? 0);
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipNext?.("bottom");
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flipPrev?.("bottom");
  }, []);

  const flipToStart = useCallback(() => {
    bookRef.current?.pageFlip?.()?.flip?.(0, "bottom");
  }, []);

  const openBook = useCallback(() => setBookOpened(true), []);

  const bookProps = useMemo(
    () => ({
      ref: bookRef,
      width: w,
      height: h,
      minWidth: 240,
      maxWidth: 620,
      minHeight: 400,
      maxHeight: 780,
      size: "stretch" as const,
      drawShadow: true,
      flippingTime: 900,
      usePortrait: isMobileLayout,
      startPage: 0,
      startZIndex: 0,
      autoSize: true,
      maxShadowOpacity: 0.45,
      showCover: false,
      mobileScrollSupport: true,
      clickEventForward: true,
      useMouseEvents: true,
      swipeDistance: 30,
      showPageCorners: true,
      disableFlipByClick: false,
      className: "gab-flipbook",
      style: {} as CSSProperties,
      onFlip,
      onInit,
    }),
    [w, h, isMobileLayout, onFlip, onInit],
  );

  const dogPages = useMemo(
    () =>
      dogs.flatMap((dog) => [
        <BookPage key={`${dog.slug}-h1`} side="left">
          <DogPageLeft dog={dog} />
        </BookPage>,
        <BookPage key={`${dog.slug}-h2`} side="right">
          <DogPageRight dog={dog} />
        </BookPage>,
        <BookPage key={`${dog.slug}-estado`} side="left">
          <DogEstadoActualBlank dog={dog} />
        </BookPage>,
        <BookPage key={`${dog.slug}-fotos`} side="right">
          <DogContinuaFotosBlank dog={dog} />
        </BookPage>,
        <BookPage key={`${dog.slug}-texto`} side="left">
          <DogContinuaTextoBlank dog={dog} />
        </BookPage>,
      ]),
    [],
  );

  const templateAdoptedPages = useMemo(
    () => [
      <BookPage key="tpl-adop-1" side="left">
        <DogPageLeft dog={templateAdoptedDog} />
      </BookPage>,
      <BookPage key="tpl-adop-2" side="right">
        <DogPageRight dog={templateAdoptedDog} />
      </BookPage>,
      <BookPage key="tpl-adop-3" side="left">
        <DogEstadoActualBlank dog={templateAdoptedDog} />
      </BookPage>,
      <BookPage key="tpl-adop-4" side="right">
        <DogContinuaFotosBlank dog={templateAdoptedDog} />
      </BookPage>,
      <BookPage key="tpl-adop-5" side="left">
        <DogContinuaTextoBlank dog={templateAdoptedDog} />
      </BookPage>,
    ],
    [],
  );

  const templateMemorialPages = useMemo(
    () => [
      <BookPage key="tpl-mem-1" side="left">
        <DogPageLeft dog={templateMemorialDog} />
      </BookPage>,
      <BookPage key="tpl-mem-2" side="right">
        <DogPageRight dog={templateMemorialDog} />
      </BookPage>,
      <BookPage key="tpl-mem-3" side="left">
        <DogEstadoActualBlank dog={templateMemorialDog} />
      </BookPage>,
      <BookPage key="tpl-mem-4" side="right">
        <DogContinuaFotosBlank dog={templateMemorialDog} />
      </BookPage>,
      <BookPage key="tpl-mem-5" side="left">
        <DogContinuaTextoBlank dog={templateMemorialDog} />
      </BookPage>,
    ],
    [],
  );

  return (
    <div className={`gab-book-wrap${isMobileLayout ? " gab-book-wrap--mobile" : ""}`}>
      <div className={`gab-book-stage${!bookOpened ? " gab-book-stage--closed" : ""}`}>
        {!bookOpened ? (
          <button type="button" className="gab-book-closed" onClick={openBook} aria-label="Abrir el libro Familia Gabeira">
            <img
              className="gab-book-closed__cover"
              src={COVER_IMAGE_SRC}
              width={720}
              height={1280}
              alt="Familia Gabeira — Esta es nuestra historia. Toca para abrir el libro."
              decoding="async"
            />
            <span className="gab-book-closed__hint">Pulsa para abrir el libro</span>
          </button>
        ) : (
          <HTMLFlipBook {...bookProps}>
            <BookPage side="left">
              <header className="page-brand">G.A.B</header>
              <h3 className="section-title">Nuestra historia</h3>
              <div className="story-block">
                {paragraphs(gabCoverIntro)}
                {paragraphs(gabIntroLeft)}
              </div>
            </BookPage>

            <BookPage side="right">
              <header className="page-brand">G.A.B</header>
              <div className="story-block">{paragraphs(gabIntroRight)}</div>
              <Link className="cta-inline" to="/reserva">
                Reserva tu libro
              </Link>
            </BookPage>

            <BookPage side="left">
              <IndicePage />
            </BookPage>

            <BookPage side="right">
              <SectionIntroPage title="¿Qué es GAB y cómo puedo colaborar?" body={sectionIntroQueEsGab} links={gabColaborarLinks} />
            </BookPage>

            <BookPage side="left">
              <SectionIntroPage title="Cachorros para adoptar" body={sectionIntroAdoptar} />
            </BookPage>

            <BookPage side="right">
              <div className="section-bridge">
                <p className="section-bridge__kicker">A continuación</p>
                <p className="section-bridge__text">Historias de perros que buscan familia. Pasa la página para comenzar.</p>
              </div>
            </BookPage>

            {dogPages}

            <BookPage side="left">
              <SectionIntroPage title="Cachorros adoptados" body={sectionIntroAdoptados} />
            </BookPage>

            <BookPage side="right">
              <div className="section-bridge">
                <p className="section-bridge__kicker">Plantilla</p>
                <p className="section-bridge__text">La siguiente página es un ejemplo con huecos para foto y notas a mano.</p>
              </div>
            </BookPage>

            {templateAdoptedPages}

            <BookPage side="left">
              <SectionIntroPage title="Homenaje" body={sectionIntroHomenaje} />
            </BookPage>

            <BookPage side="right">
              <div className="section-bridge">
                <p className="section-bridge__kicker">Plantilla</p>
                <p className="section-bridge__text">Espacio respetuoso para recordar a quienes ya no están.</p>
              </div>
            </BookPage>

            {templateMemorialPages}

            <BookPage side="left">
              <div className="cover cover--back">
                <h2 className="cover__title cover__title--small">Gracias por leernos</h2>
                <p className="cover__subtitle">
                  Sigue el trabajo de GAB en la web y ayuda a que estos perros dejen de ser invisibles.
                </p>
                <a className="cover__link" href={GAB_SITE} target="_blank" rel="noreferrer">
                  grupoayudabodegueros.org
                </a>
                <a className="cover__link" href={GAB_ADOPTION} target="_blank" rel="noreferrer">
                  Perros en adopción
                </a>
              </div>
            </BookPage>
          </HTMLFlipBook>
        )}
      </div>

      <nav className="gab-book-nav" aria-label="Páginas del libro">
        <button
          type="button"
          className="nav-fab nav-fab--prev"
          onClick={flipPrev}
          disabled={!bookOpened}
          aria-label="Página anterior"
        >
          <span className="nav-fab__arc" aria-hidden />
          ‹
        </button>
        <button
          type="button"
          className="gab-book-nav__start"
          onClick={bookOpened ? flipToStart : openBook}
          disabled={bookOpened && page === 0}
          aria-label={bookOpened ? "Volver al inicio del libro" : "Abrir el libro"}
        >
          {bookOpened ? "Inicio" : "Abrir"}
        </button>
        <span className="gab-book-nav__status" aria-live="polite">
          {bookOpened ? (
            <>
              Página {page + 1} / {pageCount}
            </>
          ) : (
            <>Portada · pulsa la imagen o Abrir</>
          )}
        </span>
        <button
          type="button"
          className="nav-fab nav-fab--next"
          onClick={bookOpened ? flipNext : openBook}
          aria-label={bookOpened ? "Página siguiente" : "Abrir el libro"}
        >
          ›
          <span className="nav-fab__arc nav-fab--mirror" aria-hidden />
        </button>
      </nav>
      <p className="gab-book-follow">
        <a className="gab-book-follow__link" href={GAB_INSTAGRAM} target="_blank" rel="noreferrer">
          Síguenos en Instagram — @gab_grupo.ayuda.bodegueros
        </a>
      </p>
    </div>
  );
}

function IndicePage() {
  return (
    <div className="book-indice">
      <header className="page-brand">G.A.B</header>
      <h3 className="section-title book-indice__title">Índice</h3>
      <ol className="book-indice__list">
        {indiceEntries.map((line, i) => (
          <li key={i} className="book-indice__item">
            <span className="book-indice__num">{i + 1}.</span>
            <span className="book-indice__text">{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SectionIntroPage({
  title,
  body,
  links,
}: {
  title: string;
  body: string;
  links?: readonly { label: string; href: string }[];
}) {
  return (
    <div className="section-intro">
      <header className="page-brand">G.A.B</header>
      <h3 className="section-title section-intro__title">{title}</h3>
      <div className="story-block section-intro__body">{paragraphs(body)}</div>
      {links && links.length > 0 ? (
        <ul className="section-intro__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noreferrer" className="section-intro__link">
                {l.label} →
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DogPageLeft({ dog }: { dog: Dog }) {
  const checklist = dog.deliveryChecklist ?? defaultDeliveryChecklist(dog);

  return (
    <div className="dog-mi-historia">
      <p className="dog-mi-historia__brand">G.A.B</p>

      <div className="dog-mi-historia__hero">
        <div className={`dog-mi-historia__ring${dog.emojiAvatar ? " dog-mi-historia__ring--emoji" : ""}`}>
          {dog.emojiAvatar ? (
            <span className="dog-mi-historia__emoji" role="img" aria-hidden>
              {dog.emojiAvatar}
            </span>
          ) : (
            <img
              src={dog.photoUrl ?? dogPhotoUrl(dog.slug)}
              alt={`Retrato de ${dog.name}`}
              width={280}
              height={280}
              loading="lazy"
            />
          )}
        </div>
        <p className="dog-mi-historia__name">{dog.name}</p>
      </div>

      <h3 className="dog-mi-historia__title">Mi historia</h3>

      <div className="dog-mi-historia__body">{paragraphsWithBoldEmail(dog.storyLeft)}</div>

      <section className="dog-mi-historia__deliver" aria-label="Condiciones de entrega">
        <h4 className="dog-mi-historia__deliver-title">Se entrega…</h4>
        <ul className="dog-mi-historia__deliver-list">
          {checklist.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      {dog.audioUrl ? (
        <div className="dog-mi-historia__audio">
          <AudioControl label="Escuchar historia" src={dog.audioUrl} />
        </div>
      ) : null}
    </div>
  );
}

function DogPageRight({ dog }: { dog: Dog }) {
  const isPlantilla = dog.slug.startsWith("plantilla-");

  return (
    <div className="dog-continua">
      <p className="dog-continua__kicker">Continúa la historia de {dog.name}</p>
      <div className="dog-mi-historia__body dog-mi-historia__body--continues">
        {paragraphsWithBoldEmail(dog.storyRight)}
      </div>
      {!isPlantilla ? (
        <a className="profile-link" href={dog.profileUrl} target="_blank" rel="noreferrer">
          Más info: {dog.name} en la web →
        </a>
      ) : null}
    </div>
  );
}

function DogEstadoActualBlank({ dog }: { dog: Dog }) {
  return (
    <div className="dog-blank dog-blank--estado">
      <p className="dog-blank__brand">G.A.B</p>
      <h3 className="dog-blank__title">Estado actual</h3>
      <p className="dog-blank__subject">
        <span className="dog-blank__name">{dog.name}</span>
      </p>
      <p className="dog-blank__intro">
        Este espacio va pensado para el <strong>libro en papel</strong>. Añade aquí a mano las últimas novedades: adopción, acogida, visitas al veterinario, cambios de residencia…
      </p>
      <p className="dog-blank__intro">
        Consulta el Instagram de GAB para ver actualizaciones y <strong>traslada tú mismo</strong> lo más reciente a estas páginas.
      </p>
      <p className="dog-blank__cta-line">
        <a className="dog-blank__link" href={GAB_INSTAGRAM} target="_blank" rel="noreferrer">
          Instagram — @gab_grupo.ayuda.bodegueros
        </a>
      </p>
      <div className="dog-blank__meta-row" aria-hidden="true">
        <span>Fecha:</span>
        <span className="dog-blank__meta-dots" />
      </div>
      <div className="dog-blank__ruled dog-blank__ruled--tall" aria-hidden="true">
        <span className="dog-blank__ruled-label">Notas y estado</span>
      </div>
    </div>
  );
}

function DogContinuaFotosBlank({ dog }: { dog: Dog }) {
  return (
    <div className="dog-blank dog-blank--fotos">
      <p className="dog-blank__brand">G.A.B</p>
      <h3 className="dog-blank__title">Continúa su historia</h3>
      <p className="dog-blank__subtitle">Espacio para fotos</p>
      <p className="dog-blank__intro dog-blank__intro--compact">
        Si <span className="dog-blank__name">{dog.name}</span> forma parte de tu familia, pega o inserta aquí instantes de su nueva vida (impreso o álbum).
      </p>
      <div className="dog-blank__photo-flow" aria-hidden="true">
        <div className="dog-blank__photo-row">
          <div className="dog-blank__photo-slot">
            <span>Foto 1</span>
          </div>
          <div className="dog-blank__photo-note">
            <span className="dog-blank__photo-note__label">Notas</span>
          </div>
        </div>
        <div className="dog-blank__photo-row">
          <div className="dog-blank__photo-note">
            <span className="dog-blank__photo-note__label">Notas</span>
          </div>
          <div className="dog-blank__photo-slot">
            <span>Foto 2</span>
          </div>
        </div>
        <div className="dog-blank__photo-row">
          <div className="dog-blank__photo-slot">
            <span>Foto 3</span>
          </div>
          <div className="dog-blank__photo-note">
            <span className="dog-blank__photo-note__label">Notas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DogContinuaTextoBlank({ dog }: { dog: Dog }) {
  return (
    <div className="dog-blank dog-blank--texto">
      <p className="dog-blank__brand">G.A.B</p>
      <h3 className="dog-blank__title">Continúa su historia</h3>
      <p className="dog-blank__subtitle">Tu relato</p>
      <p className="dog-blank__intro dog-blank__intro--compact">
        Escribe con tu letra los siguientes capítulos de la vida de <span className="dog-blank__name">{dog.name}</span>: primeros días en casa, rutinas, juegos, paseos…
      </p>
      <div className="dog-blank__ruled dog-blank__ruled--full" aria-hidden="true" />
    </div>
  );
}
