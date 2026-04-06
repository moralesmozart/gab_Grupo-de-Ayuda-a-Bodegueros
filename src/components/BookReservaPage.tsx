import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DEFAULT_BOOK_PRICE_EUR,
  GAB_DONATE,
  GAB_EMAIL,
  GAB_INSTAGRAM,
  GAB_INSTAGRAM_DM,
  GAB_SITE,
  GAB_WHATSAPP_E164,
} from "../data/constants";

const BOOK_PRODUCT_IMG = `${import.meta.env.BASE_URL}book-product.png`;

function buildWhatsAppUrl(amount: string): string {
  const text = encodeURIComponent(
    `Hola, escribo por el libro de GAB. Me interesa colaborar con una aportación de ${amount}€ (precio orientativo).`,
  );
  if (GAB_WHATSAPP_E164) return `https://wa.me/${GAB_WHATSAPP_E164}?text=${text}`;
  const body = encodeURIComponent(
    `Hola,\n\nMe interesa el libro de GAB con una aportación orientativa de ${amount}€.\n\nGracias.`,
  );
  return `mailto:info@grupoayudabodegueros.org?subject=${encodeURIComponent("Libro GAB — consulta")}&body=${body}`;
}

export default function BookReservaPage() {
  const [priceInput, setPriceInput] = useState(String(DEFAULT_BOOK_PRICE_EUR));

  const amountLabel = useMemo(() => {
    const n = parseFloat(priceInput.replace(",", "."));
    if (Number.isFinite(n) && n >= 0) return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return priceInput || "—";
  }, [priceInput]);

  const waHref = useMemo(() => buildWhatsAppUrl(amountLabel), [amountLabel]);

  return (
    <div className="book-landing">
      <header className="book-landing__top">
        <Link to="/" className="book-landing__back">
          ← Volver al libro
        </Link>
        <a className="book-landing__site" href={GAB_SITE} target="_blank" rel="noreferrer">
          grupoayudabodegueros.org
        </a>
      </header>

      <div className="book-landing__grid">
        <div className="book-landing__visual">
          <figure className="book-landing__figure">
            <img
              src={BOOK_PRODUCT_IMG}
              width={720}
              height={960}
              alt="Ejemplar del libro solidario de GAB, con portada y texto de presentación del grupo"
              className="book-landing__photo"
              decoding="async"
            />
            <figcaption className="book-landing__caption">Libro solidario · edición GAB</figcaption>
          </figure>
        </div>

        <div className="book-landing__detail">
          <h1 className="book-landing__title">Libro «Papás» — historias de bodegueros</h1>
          <p className="book-landing__lead">
            Publicación del <strong>Grupo de Ayuda a Bodegueros</strong> con relatos reales de perros rescatados. Al hojearlo
            conoces su pasado difícil y el trabajo del voluntariado que lucha por una vida digna para el bodeguero en España.
          </p>
          <p className="book-landing__body">
            Tu aportación ayuda a cubrir impresión, envíos y el día a día del refugio. <strong>El 100&nbsp;% de lo que elijas
            aportar va íntegramente a GAB</strong>: no hay intermediarios ni margen comercial en esta página.
          </p>

          <div className="book-landing__price-block">
            <label className="book-landing__price-label" htmlFor="book-price">
              Precio orientativo (editable)
            </label>
            <div className="book-landing__price-row">
              <input
                id="book-price"
                className="book-landing__price-input"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                aria-describedby="book-price-hint"
              />
              <span className="book-landing__currency">€</span>
            </div>
            <p id="book-price-hint" className="book-landing__price-hint">
              Sugerimos <strong>{DEFAULT_BOOK_PRICE_EUR} €</strong> como referencia; puedes cambiar la cifra según tu
              capacidad. En el paso de pago o al escribirnos indica la aportación que prefieres.
            </p>
          </div>

          <div className="book-landing__ctas">
            <a className="btn btn--primary book-landing__btn-pay" href={GAB_DONATE} target="_blank" rel="noreferrer">
              Pagar / donar en la web GAB
            </a>
            <a className="btn btn--secondary book-landing__btn-wa" href={waHref} target="_blank" rel="noreferrer">
              {GAB_WHATSAPP_E164 ? "Hablar por WhatsApp" : "Escribir por email"}
            </a>
            <a className="btn btn--instagram book-landing__btn-ig" href={GAB_INSTAGRAM_DM} target="_blank" rel="noreferrer">
              Hablar por Instagram
            </a>
          </div>
          <p className="book-landing__fineprint">
            Si prefieres email:{" "}
            <a href={GAB_EMAIL} className="book-landing__inline-link">
              info@grupoayudabodegueros.org
            </a>
            {" · "}
            <a href={GAB_INSTAGRAM} target="_blank" rel="noreferrer" className="book-landing__inline-link">
              Instagram @gab_grupo.ayuda.bodegueros
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
