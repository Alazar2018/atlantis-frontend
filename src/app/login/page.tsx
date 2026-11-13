"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) localStorage.setItem("authToken", data.token);
        toast.success("Signed in", { position: "top-right", autoClose: 1500 });
        router.replace("/admin");
        return;
      }

      setError(data.error || "That email or password is not right.");
    } catch {
      setError("Sign-in could not be reached. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 pb-16 pt-24">
      <div className="w-full max-w-md">
        <p className="text-[11px] uppercase tracking-[0.28em] text-carmine">Staff</p>
        <h1 className="mt-2 font-display text-5xl text-ink">Sign in</h1>
        <p className="mt-3 text-sm text-ink/65">
          Products, orders, stock, and categories.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 border border-ink/10 bg-white p-6 sm:p-8" noValidate>
          {error && (
            <p role="alert" className="border border-carmine/30 bg-carmine/5 px-3 py-2 text-sm text-carmine">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
              className="mt-2 block w-full border border-ink/15 bg-ivory px-3 py-3 text-ink outline-none transition-colors focus:border-carmine"
              placeholder="name@atlanticleather.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-ink">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                className="block w-full border border-ink/15 bg-ivory px-3 py-3 pr-12 text-ink outline-none transition-colors focus:border-carmine"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink/50 hover:text-ink"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="flex min-h-12 w-full items-center justify-center bg-carmine text-[11px] uppercase tracking-[0.22em] text-ivory transition-colors duration-200 hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink/30"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
