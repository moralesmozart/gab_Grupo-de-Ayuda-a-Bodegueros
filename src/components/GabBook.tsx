import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import HTMLFlipBook from "react-pageflip";
import BookPage from "./BookPage";
import AudioControl from "./AudioControl";
import { dogs, type Dog } from "../data/dogs";
import { gabCoverIntro, gabIntroLeft, gabIntroRight } from "../data/gabIntro";
import { GAB_ADOPTION, GAB_INSTAGRAM, GAB_LOGO_URL, GAB_SITE } from "../data/constants";

const GAB_CONTACT_EMAIL = "info@grupoayudabodegueros.org";

function paragraphs(text: string): ReactNode {
  return text
    .trim()
    .split(/\n\n+/)
    .map((block, i) => <p key={i}>{block.trim()}</p>);
}

/** Justified story blocks; highlights the GAB contact email like the print layout */
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

function useBookDimensions() {
  const [dims, setDims] = useState({ w: 380, h: 540 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const sidePadding = 28;
      const maxTotal = Math.min(vw - sidePadding, 1320);
      const singlePage = Math.floor(Math.max(260, maxTotal / 2 - 10));
      const w = Math.min(620, singlePage);
      const h = Math.min(780, Math.max(420, Math.round(w * 1.38)));
      setDims({ w, h });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return dims;
}

function defaultDeliveryChecklist(dog: Dog): string[] {
  return [`${dog.age} · ${dog.size}`, "Condiciones y documentación: consulta su ficha en grupoayudabodegueros.org"];
}

export default function GabBook() {
  const bookRef = useRef<FlipBookRef | null>(null);
  const { w, h } = useBookDimensions();
  const [page, setPage] = useState(0);
  /** Cover + intro (2) + per dog: historia L/R + estado + fotos + diario + colofón */
  const pagesPerDog = 5;
  const pageCount = 1 + 2 + dogs.length * pagesPerDog + 1;

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
      usePortrait: false,
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
    [w, h, onFlip, onInit],
  );

  return (
    <div className="gab-book-wrap">
      <div className="gab-book-stage">
        <HTMLFlipBook {...bookProps}>
          <BookPage side="right" tone="white">
            <div className="cover cover--brochure">
              <div className="cover-brochure__logo-wrap">
                <img
                  className="cover-brochure__logo"
                  src={GAB_LOGO_URL}
                  width={200}
                  height={214}
                  alt="G.A.B — Grupo de Ayuda a Bodegueros"
                  decoding="async"
                />
              </div>
              <div className="cover-brochure__banner">Grupo de Ayuda a Bodegueros</div>
              <div className="cover-brochure__body">{paragraphs(gabCoverIntro)}</div>
              <p className="cover-brochure__hint">Pasa la página para continuar</p>
            </div>
          </BookPage>

          <BookPage side="left">
            <header className="page-brand">G.A.B</header>
            <h3 className="section-title">Nuestra historia</h3>
            <div className="story-block">{paragraphs(gabIntroLeft)}</div>
          </BookPage>

          <BookPage side="right">
            <header className="page-brand">G.A.B</header>
            <div className="story-block">{paragraphs(gabIntroRight)}</div>
            <a className="cta-inline" href="#pedido">
              Ver nuestro libro
            </a>
          </BookPage>

          {dogs.flatMap((dog) => [
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
          ])}

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
      </div>

      <nav className="gab-book-nav" aria-label="Páginas del libro">
        <button type="button" className="nav-fab nav-fab--prev" onClick={flipPrev} aria-label="Página anterior">
          <span className="nav-fab__arc" aria-hidden />
          ‹
        </button>
        <button
          type="button"
          className="gab-book-nav__start"
          onClick={flipToStart}
          disabled={page === 0}
          aria-label="Volver al inicio del libro"
        >
          Inicio
        </button>
        <span className="gab-book-nav__status" aria-live="polite">
          Página {page + 1} / {pageCount}
        </span>
        <button type="button" className="nav-fab nav-fab--next" onClick={flipNext} aria-label="Página siguiente">
          ›
          <span className="nav-fab__arc nav-fab__arc--mirror" aria-hidden />
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

function DogPageLeft({ dog }: { dog: Dog }) {
  const checklist = dog.deliveryChecklist ?? defaultDeliveryChecklist(dog);

  return (
    <div className="dog-mi-historia">
      <p className="dog-mi-historia__brand">G.A.B</p>

      <div className="dog-mi-historia__hero">
        <div className="dog-mi-historia__ring">
          <img
            src={dog.photoUrl ?? dogPhotoUrl(dog.slug)}
            alt={`Retrato de ${dog.name}`}
            width={280}
            height={280}
            loading="lazy"
          />
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

      <div className="dog-mi-historia__audio">
        <AudioControl label="Escuchar historia" src={dog.audioUrl} />
      </div>
    </div>
  );
}

function DogPageRight({ dog }: { dog: Dog }) {
  return (
    <div className="dog-continua">
      <p className="dog-continua__kicker">Continúa la historia de {dog.name}</p>
      <div className="dog-mi-historia__body dog-mi-historia__body--continues">
        {paragraphsWithBoldEmail(dog.storyRight)}
      </div>
      <a className="profile-link" href={dog.profileUrl} target="_blank" rel="noreferrer">
        Más info: {dog.name} en la web →
      </a>
    </div>
  );
}

/** Plantilla impresa: novedades / estado (pontilhado) */
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

/** Plantilla: huecos punteados para fotos (familias adoptivas) */
function DogContinuaFotosBlank({ dog }: { dog: Dog }) {
  return (
    <div className="dog-blank dog-blank--fotos">
      <p className="dog-blank__brand">G.A.B</p>
      <h3 className="dog-blank__title">Continúa su historia</h3>
      <p className="dog-blank__subtitle">Espacio para fotos</p>
      <p className="dog-blank__intro dog-blank__intro--compact">
        Si <span className="dog-blank__name">{dog.name}</span> forma parte de tu familia, pega o inserta aquí instantes de su nueva vida (impreso o álbum).
      </p>
      <div className="dog-blank__photo-grid" aria-hidden="true">
        <div className="dog-blank__photo-slot">
          <span>Foto 1</span>
        </div>
        <div className="dog-blank__photo-slot">
          <span>Foto 2</span>
        </div>
        <div className="dog-blank__photo-slot dog-blank__photo-slot--wide">
          <span>Foto 3</span>
        </div>
      </div>
    </div>
  );
}

/** Plantilla: líneas punteadas para texto (relato del adoptante) */
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
