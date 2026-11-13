"use client";

import { FormEvent, useEffect, useState } from "react";

interface StaffAccount {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffAccount[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch("/api/staff", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    if (response.ok) setStaff(await response.json());
  };

  useEffect(() => {
    load();
  }, []);

  const createMaker = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const token = localStorage.getItem("authToken");
    const response = await fetch("/api/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ email, name, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not create the login");
      return;
    }
    setEmail("");
    setName("");
    setPassword("");
    load();
  };

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-carmine">Access</p>
      <h1 className="mt-2 font-display text-4xl">Staff</h1>
      <p className="mt-2 max-w-xl text-sm text-ink/65">
        A maker can update stock and move orders. They cannot delete products, manage API keys, or add other logins.
      </p>

      <form onSubmit={createMaker} className="mt-8 grid max-w-xl gap-4 border border-ink/10 bg-white p-5">
        {error && <p className="text-sm text-carmine">{error}</p>}
        <label className="text-sm">
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 block w-full border border-ink/15 px-3 py-2" />
        </label>
        <label className="text-sm">
          Email
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 block w-full border border-ink/15 px-3 py-2" />
        </label>
        <label className="text-sm">
          Password
          <input type="text" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 block w-full border border-ink/15 px-3 py-2" />
        </label>
        <button type="submit" className="bg-carmine px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-ivory">
          Add maker
        </button>
      </form>

      <ul className="mt-8 divide-y divide-ink/10 border border-ink/10 bg-white">
        {staff.map((account) => (
          <li key={account.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium">{account.name || account.email}</p>
              <p className="text-sm text-ink/60">{account.email}</p>
            </div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-carmine">{account.role || "admin"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
