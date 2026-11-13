"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/public/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "The note could not be sent");
      }
      setSent(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The note could not be sent");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return <p className="mt-8 text-ink">The note is with the house. We will reply from Tatek.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-6">
      {error && <p className="text-sm text-carmine">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-[11px] uppercase tracking-[0.22em] text-ink/60">
          Name
        </label>
        <input id="name" name="name" required className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-carmine" />
      </div>
      <div>
        <label htmlFor="email" className="block text-[11px] uppercase tracking-[0.22em] text-ink/60">
          Email
        </label>
        <input id="email" name="email" type="email" required className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-carmine" />
      </div>
      <div>
        <label htmlFor="subject" className="block text-[11px] uppercase tracking-[0.22em] text-ink/60">
          Subject
        </label>
        <input id="subject" name="subject" className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-carmine" />
      </div>
      <div>
        <label htmlFor="message" className="block text-[11px] uppercase tracking-[0.22em] text-ink/60">
          Message
        </label>
        <textarea id="message" name="message" rows={6} required className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-carmine" />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-carmine px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors duration-200 hover:bg-ink disabled:bg-ink/30"
      >
        {sending ? "Sending…" : "Send the letter"}
      </button>
    </form>
  );
}
