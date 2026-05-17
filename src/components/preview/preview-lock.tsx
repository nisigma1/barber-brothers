"use client";

import { useMemo } from "react";

export function PreviewLock() {
  const { error, nextPath } = useMemo(() => {
    if (typeof window === "undefined") {
      return { error: false, nextPath: "/" };
    }

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");

    return {
      error: params.get("error") === "1",
      nextPath: next && next.startsWith("/") && !next.startsWith("//") ? next : "/",
    };
  }, []);

  return (
    <main className="preview-lock">
      <section className="preview-lock-card">
        <p className="eyebrow text-[var(--color-accent)]">Barber Brothers</p>
        <h1>Private Preview</h1>
        <p>Faqja eshte e mbyllur perkohesisht per prezantim. Hyrja behet vetem me PIN.</p>

        <form action="/unlock" method="post" className="preview-lock-form">
          <input type="hidden" name="next" value={nextPath} />
          <label className="field-label">
            PIN
            <input
              className="field-input"
              inputMode="numeric"
              maxLength={8}
              name="pin"
              placeholder="Sheno PIN-in"
              required
              type="password"
            />
          </label>
          {error ? <p className="preview-lock-error">PIN-i nuk eshte i sakte.</p> : null}
          <button className="btn-primary w-full" type="submit">
            Hyr ne web
          </button>
        </form>
      </section>
    </main>
  );
}
