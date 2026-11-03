import { useState } from "react";
import { Mail } from "lucide-react";

export function EmailGate({ onSubmit }: { onSubmit: (email: string, name: string) => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) && email.length <= 255;

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-stone-200 bg-background p-8 text-center shadow-[var(--shadow-deep)] sm:p-10">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-violet-soft text-oxblood">
        <Mail className="size-6" />
      </div>
      <h2 className="mt-5 text-2xl text-stone-900 sm:text-3xl">Your profile is ready!</h2>
      <p className="mt-3 text-sm leading-relaxed text-stone-500">
        Enter your email to get your Marriage Readiness Profile and your 30-day preparation plan.
      </p>
      <form
        className="mt-6 space-y-3 text-left"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid && consent) onSubmit(email.trim(), name.trim().slice(0, 100));
        }}
      >
        <input
          type="text"
          placeholder="First name (optional)"
          value={name}
          maxLength={100}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-stone-300 bg-background px-4 py-3 text-sm outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/30"
        />
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          maxLength={255}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-stone-300 bg-background px-4 py-3 text-sm outline-none focus:border-oxblood focus:ring-2 focus:ring-oxblood/30"
        />
        <label className="flex items-start gap-2 text-xs text-stone-500">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 accent-[var(--oxblood)]"
          />
          I agree to receive my results by email.
        </label>
        <button
          type="submit"
          disabled={!valid || !consent}
          className="w-full rounded-xl bg-oxblood px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-oxblood-600 disabled:opacity-50"
        >
          Get my results
        </button>
      </form>
      <p className="mt-4 text-[11px] text-stone-400">We respect your privacy. No spam, ever.</p>
    </div>
  );
}
