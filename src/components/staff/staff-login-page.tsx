"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BRAND_ASSETS } from "@/lib/constants";
import { ClientBookingError, staffLogin } from "@/lib/booking/client";
import { useLanguage } from "@/components/providers/language-provider";
import { BrandImage } from "@/components/ui/brand-image";

export function StaffLoginPage() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setError("");

    try {
      await staffLogin(email, password);
      router.replace("/staff/bookings");
    } catch (error) {
      const code = error instanceof ClientBookingError ? error.code : "UNAUTHORIZED";
      setError(code === "CONFIGURATION_ERROR" ? dictionary.common.configuredRequired : dictionary.staff.invalidCredentials);
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
      <section className="premium-card overflow-hidden">
        <div className="image-panel min-h-[22rem] rounded-none border-0">
          <BrandImage
            src={BRAND_ASSETS.gallery[1]}
            alt="Barber Brothers staff visual"
            className="h-full w-full"
            imgClassName="image-fill"
            fallbackLabel="Staff"
            loading="eager"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 p-6">
            <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.eyebrow}</p>
            <h1 className="mt-4 font-display text-[clamp(3.2rem,8vw,6rem)] uppercase leading-[0.85] tracking-[0.05em] text-white">
              {dictionary.staff.loginTitle}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/68">{dictionary.staff.loginBody}</p>
          </div>
        </div>
        <div className="p-5 text-sm text-white/60">{dictionary.staff.loginCardNote}</div>
      </section>

      <section className="premium-card p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="field-label">
            {dictionary.staff.email}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="field-input"
              required
            />
          </label>
          <label className="field-label">
            {dictionary.staff.password}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="field-input"
              required
            />
          </label>

          {error ? (
            <div className="rounded-[1rem] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={isPending} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-45">
            {isPending ? dictionary.staff.pending : dictionary.staff.submit}
          </button>
        </form>
      </section>
    </div>
  );
}
