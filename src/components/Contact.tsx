import { useRef, useState } from "react";
import Icon from "./Icon";
import { LEAD_WEBHOOK_URL } from "../config";

const ACCESS_KEY = "7142b5c3-09f0-4888-a63a-c95a7accb443";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
};

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [form, setForm] = useState({ ...emptyForm });
  const successRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const data = new FormData();
    data.append("access_key", ACCESS_KEY);
    data.append(
      "subject",
      `Nowe zapytanie CzasKlimy.pl — ${form.name || "Strona"}`
    );
    data.append("from_name", "CzasKlimy.pl");
    data.append("Imię", form.name);
    data.append("Telefon", form.phone);
    data.append("Email", form.email);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        // Dodatkowy webhook Pabbly (np. SMS przez Twilio / automatyzacje)
        if (LEAD_WEBHOOK_URL) {
          try {
            const webhookData = new URLSearchParams();
            webhookData.append("name", form.name);
            webhookData.append("phone", form.phone);
            webhookData.append("email", form.email);
            webhookData.append("source", "CzasKlimy.pl");
            await fetch(LEAD_WEBHOOK_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
              },
              body: webhookData,
            });
          } catch {
            // Nie blokujemy sukcesu formularza, jeśli Pabbly/Twilio nie odpowie
          }
        }

        setStatus("sent");
        setForm({ ...emptyForm });

        setTimeout(() => {
          successRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 50);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
  };

  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-slate-950 py-20 text-white lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-500/30 via-cyan-400/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Wolne terminy w tym tygodniu
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Zostaw kontakt — oddzwonimy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Omówimy potrzeby i podamy wycenę — najczęściej w ciągu kilku
            godzin. Bezpłatnie i bez zobowiązań.
          </p>
        </div>

        <div ref={successRef} className="mx-auto mt-10 max-w-xl">
          {status === "sent" ? (
            <SuccessBox onReset={reset} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-xl sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Imię">
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="input"
                    placeholder="Jan"
                  />
                </Field>
                <Field label="Telefon">
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="input"
                    placeholder="+48 ..."
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="input"
                    placeholder="jan@domena.pl"
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 px-7 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-sky-500/30 transition hover:brightness-110 disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 0 1 8-8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Wysyłanie...
                  </>
                ) : status === "error" ? (
                  <>Błąd wysyłania — spróbuj ponownie lub zadzwoń</>
                ) : (
                  <>
                    Wyślij zapytanie
                    <Icon name="arrow" className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-white/50">
                Pracujemy w dni powszednie 8:00–18:00. Wysyłając formularz
                akceptujesz <a href="#/polityka-prywatnosci" className="underline hover:text-white">politykę prywatności</a>.
              </p>
            </form>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-4">
          <a
            href="tel:+48788304845"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 transition hover:border-sky-400/40 hover:bg-white/10"
          >
            <Icon name="phone" className="h-5 w-5 text-sky-400" />
            <span className="font-semibold">+48 788 304 845</span>
          </a>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <Icon name="map" className="h-5 w-5 text-sky-400" />
            <span className="font-semibold">Jachranka 45, k. Serocka</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
            <Icon name="award" className="h-5 w-5 text-sky-400" />
            <span className="font-semibold">5/5 na Google</span>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-xs text-white/40">
          Administratorem danych i wykonawcą usług jest RoboGaz Sp. z o.o.
        </p>
      </div>
    </section>
  );
}

function SuccessBox({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8 text-center backdrop-blur-xl sm:p-12">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/20">
        <Icon name="check" className="h-10 w-10 text-emerald-300" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white sm:text-3xl">
          Dziękujemy! Wiadomość wysłana.
        </h3>
        <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
          Skontaktujemy się z Tobą w ciągu najbliższych kilku godzin.
          <br />
          Pracujemy w dni powszednie <strong>8:00–18:00</strong>.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href="tel:+48788304845"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          <Icon name="phone" className="h-4 w-4" />
          Albo zadzwoń teraz: +48 788 304 845
        </a>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
        >
          Wyślij kolejne zapytanie
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
