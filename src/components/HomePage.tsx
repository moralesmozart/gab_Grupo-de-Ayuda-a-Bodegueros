import { Link } from "react-router-dom";
import GabBook from "./GabBook";
import { GAB_DONATE, GAB_INSTAGRAM, GAB_LOGO_URL, GAB_SITE } from "../data/constants";

export default function HomePage() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a
          className="site-header__logo-link"
          href={GAB_SITE}
          target="_blank"
          rel="noreferrer"
          aria-label="Grupo de Ayuda a Bodegueros — ir a la web"
        >
          <img
            className="site-header__logo"
            src={GAB_LOGO_URL}
            width={280}
            height={300}
            alt="Logo — Grupo de Ayuda a Bodegueros"
            decoding="async"
          />
        </a>
        <p className="site-header__eyebrow">Grupo de Ayuda a Bodegueros</p>
        <h1 className="site-header__title">Preview del libro</h1>
        <p className="site-header__tagline">Historias de bodegueros rescatados · hojea el ejemplar digital</p>
      </header>

      <main className="site-main">
        <GabBook />
      </main>

      <footer className="site-footer" id="pedido">
        <div className="cta-row">
          <a className="btn btn--primary" href={GAB_DONATE} target="_blank" rel="noreferrer">
            Ayuda a GAB
          </a>
          <Link className="btn btn--secondary" to="/reserva">
            Reserva tu libro
          </Link>
          <a className="btn btn--instagram" href={GAB_INSTAGRAM} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
        <p className="footer-note">
          Más información en{" "}
          <a href={GAB_SITE} target="_blank" rel="noreferrer">
            grupoayudabodegueros.org
          </a>{" "}
          · listado de adopción en{" "}
          <a href="https://grupoayudabodegueros.org/en-adopcion/" target="_blank" rel="noreferrer">
            En adopción
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
