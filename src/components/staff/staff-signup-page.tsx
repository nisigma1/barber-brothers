"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { BARBERS } from "@/lib/constants";
import { ClientBookingError, staffSignup } from "@/lib/booking/client";
import type { BarberId } from "@/lib/booking/types";
import { useLanguage } from "@/components/providers/language-provider";

export function StaffSignupPage() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [barberId, setBarberId] = useState<BarberId | "">("");
  const [password, setPassword] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError("");
    setMessage("");

    try {
      await staffSignup({ email, password, displayName, barberId, signupCode });
      setMessage(dictionary.staff.signupSuccess);
      router.replace("/staff/bookings");
    } catch (error) {
      const code = error instanceof ClientBookingError ? error.code : "INVALID_REQUEST";
      setError(code === "EMAIL_EXISTS" ? dictionary.booking.errors.EMAIL_EXISTS : dictionary.staff.signupInvalid);
      setIsPending(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
      <section className="premium-card overflow-hidden">
        <div className="relative min-h-[22rem] rounded-none border-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,173,114,0.16),transparent_18rem),linear-gradient(145deg,#15110c,#070605)] p-6">
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,7vw,5.6rem)] uppercase leading-[0.85] tracking-[0.05em] text-white">
            {dictionary.staff.signupTitle}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/68">{dictionary.staff.signupBody}</p>
        </div>
        <div className="p-5 text-sm text-white/60">{dictionary.staff.loginCardNote}</div>
      </section>

      <section className="premium-card p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="field-label">
            {dictionary.staff.displayName}
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="name"
              className="field-input"
              required
              minLength={2}
            />
          </label>

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
            {dictionary.staff.barberProfile}
            <select
              value={barberId}
              onChange={(event) => setBarberId(event.target.value as BarberId | "")}
              className="field-input"
              required
            >
              <option value="" disabled>
                {dictionary.booking.barberLabel}
              </option>
              {BARBERS.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            {dictionary.staff.password}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              className="field-input"
              required
              minLength={8}
            />
          </label>

          <label className="field-label">
            {dictionary.staff.signupCode}
            <input
              type="password"
              value={signupCode}
              onChange={(event) => setSignupCode(event.target.value)}
              autoComplete="one-time-code"
              className="field-input"
              required
            />
          </label>

          {message ? (
            <div className="rounded-[1rem] border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 px-4 py-3 text-sm text-white">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[1rem] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={isPending} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-45">
            {isPending ? dictionary.staff.signupPending : dictionary.staff.signupSubmit}
          </button>

          <Link href="/staff/login" className="btn-secondary w-full">
            {dictionary.staff.loginLink}
          </Link>
        </form>
      </section>
    </div>
  );
}
