"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cancelClientBooking, ClientBookingError } from "@/lib/booking/client";
import { useLanguage } from "@/components/providers/language-provider";

type State = "prompt" | "pending" | "success" | "error";

export function CancelDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dictionary } = useLanguage();
  const token = searchParams.get("cancel");
  const [tokenSeen, setTokenSeen] = useState<string | null>(null);
  const [state, setState] = useState<State>("prompt");
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (token && token !== tokenSeen) {
    setTokenSeen(token);
    setState("prompt");
    setErrorMessage("");
  }

  if (!token) {
    return null;
  }

  function closeDialog() {
    setState("prompt");
    setErrorMessage("");
    router.replace("/booking");
  }

  async function handleConfirm() {
    if (!token) {
      return;
    }

    setState("pending");
    setErrorMessage("");

    try {
      await cancelClientBooking(token);
      setState("success");
    } catch (error) {
      let message: string = dictionary.booking.cancelErrorGeneric;

      if (error instanceof ClientBookingError) {
        if (error.code === "ALREADY_CANCELLED") {
          message = dictionary.booking.cancelErrorAlready;
        } else if (error.code === "CANCEL_WINDOW") {
          message = dictionary.booking.cancelErrorWindow;
        } else if (error.code === "NOT_FOUND" || error.code === "INVALID_REQUEST") {
          message = dictionary.booking.cancelErrorInvalid;
        }
      }

      setErrorMessage(message);
      setState("error");
    }
  }

  return (
    <section className="premium-card mb-5 p-5 sm:p-6" aria-live="polite">
      {state === "success" ? (
        <>
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.cancelSuccessTitle}</p>
          <p className="mt-3 text-sm leading-7 text-white/80">{dictionary.booking.cancelSuccessBody}</p>
          <button type="button" onClick={closeDialog} className="btn-primary mt-5 w-fit">
            {dictionary.booking.bookAnother}
          </button>
        </>
      ) : (
        <>
          <p className="eyebrow text-[var(--color-accent)]">{dictionary.booking.cancelTitle}</p>
          <p className="mt-3 text-sm leading-7 text-white/80">{dictionary.booking.cancelPromptBody}</p>

          {state === "error" ? (
            <p className="mt-3 text-sm leading-6 text-rose-200/90">{errorMessage}</p>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={state === "pending"}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {dictionary.booking.cancelConfirm}
            </button>
            <button type="button" onClick={closeDialog} className="btn-secondary">
              {dictionary.booking.cancelDismiss}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
