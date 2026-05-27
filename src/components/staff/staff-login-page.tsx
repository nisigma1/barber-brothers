"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ACTIVE_BARBERS } from "@/lib/constants";
import { ClientBookingError, getStaffSession, staffLogin } from "@/lib/booking/client";
import type { BarberId } from "@/lib/booking/types";
import { useLanguage } from "@/components/providers/language-provider";

export function StaffLoginPage() {
  const router = useRouter();
  const { dictionary } = useLanguage();
  const [barberId, setBarberId] = useState<BarberId | "">("");
  const [pin, setPin] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function checkExistingSession() {
      try {
        await getStaffSession();
        if (!ignore) {
          router.replace("/staff/bookings");
        }
      } catch {
        if (!ignore) {
          setCheckingSession(false);
        }
      }
    }

    void checkExistingSession();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsPending(true);
    setError("");

    try {
      if (!barberId) {
        setError(dictionary.staff.invalidCredentials);
        setIsPending(false);
        return;
      }

      await staffLogin(barberId, pin);
      router.replace("/staff/bookings");
    } catch (error) {
      const code = error instanceof ClientBookingError ? error.code : "UNAUTHORIZED";
      setError(code === "CONFIGURATION_ERROR" ? dictionary.common.configuredRequired : dictionary.staff.invalidCredentials);
      setIsPending(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-8">
        <div className="premium-card p-5 text-sm text-white/62">{dictionary.staff.loading}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
      <section className="premium-card overflow-hidden">
        <div className="staff-login-hero relative min-h-[22rem] rounded-none border-0 p-6">
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.staff.eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(3.2rem,8vw,6rem)] uppercase leading-[0.85] tracking-[0.05em]">
            {dictionary.staff.loginTitle}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7">{dictionary.staff.loginBody}</p>
        </div>
        <div className="staff-note p-5 text-sm">{dictionary.staff.loginCardNote}</div>
      </section>

      <section className="premium-card p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {ACTIVE_BARBERS.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.displayName}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            {dictionary.staff.pin}
            <input
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]*"
              className="field-input"
              required
              minLength={4}
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
