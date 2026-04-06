import { forwardRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  side?: "left" | "right";
  /** Solid paper (e.g. brochure-style opening page) */
  tone?: "paper" | "white";
};

const BookPage = forwardRef<HTMLDivElement, Props>(({ children, side = "left", tone = "paper" }, ref) => {
  const toneClass = tone === "white" ? " book-page--white" : "";
  return (
    <div ref={ref} className={`book-page book-page--${side}${toneClass}`} data-density="compact">
      <div className="book-page__inner">{children}</div>
    </div>
  );
});

BookPage.displayName = "BookPage";

export default BookPage;
