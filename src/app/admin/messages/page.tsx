"use client";

import { useEffect, useState } from "react";

interface Note {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number | boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [notes, setNotes] = useState<Note[]>([]);

  const load = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch("/api/messages", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    if (response.ok) setNotes(await response.json());
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: number) => {
    const token = localStorage.getItem("authToken");
    await fetch(`/api/messages/${id}/read`, {
      method: "PATCH",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, is_read: true } : note)));
  };

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-carmine">Visit</p>
      <h1 className="mt-2 font-display text-4xl">Messages</h1>
      <div className="mt-8 space-y-4">
        {notes.length === 0 && <p className="text-sm text-ink/60">No notes yet.</p>}
        {notes.map((note) => (
          <article key={note.id} className="border border-ink/10 bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl">{note.subject || "Note"}</h2>
              <p className="text-xs uppercase tracking-[0.16em] text-ink/50">
                {note.is_read ? "Read" : "New"} · {new Date(note.created_at).toLocaleString()}
              </p>
            </div>
            <p className="mt-1 text-sm text-ink/70">
              {note.name} · {note.email}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{note.message}</p>
            {!note.is_read && (
              <button type="button" onClick={() => markRead(note.id)} className="mt-4 text-sm text-carmine">
                Mark as read
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
