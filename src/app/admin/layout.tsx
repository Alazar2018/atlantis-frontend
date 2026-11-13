"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Boxes,
  LogOut,
  Menu,
  X,
  User,
  Key,
  Mail,
  UserPlus,
} from "lucide-react";
import { StaffRole, StaffRoleContext } from "@/components/StaffRole";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/stock", label: "Stock", icon: Boxes },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/staff", label: "Staff", icon: UserPlus, adminOnly: true },
  { href: "/admin/api-keys", label: "API keys", icon: Key, adminOnly: true },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<StaffRole>("admin");
  const visibleItems = menuItems.filter((item) => !item.adminOnly || role === "admin");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const headers: HeadersInit = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch("/api/auth/check", {
          headers,
          credentials: "include",
        });
        const data = await response.json();

        if (!data.authenticated) {
          router.replace("/login");
          return;
        }
        setRole(data.user?.role === "maker" ? "maker" : "admin");
        setReady(true);
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // The local session is cleared either way.
    }
    if (typeof window !== "undefined") localStorage.removeItem("authToken");
    router.replace("/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === path;
    return pathname.startsWith(path);
  };

  const navLink = (item: (typeof menuItems)[number], onNavigate?: () => void) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-11 items-center gap-3 px-3 text-sm transition-colors duration-200 ${
          active ? "bg-carmine text-ivory" : "text-ivory/75 hover:bg-white/10 hover:text-ivory"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span>{item.label}</span>
      </Link>
    );
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory pt-16 text-sm text-ink/60">
        Checking access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-60 flex-col border-r border-white/10 bg-ink text-ivory md:flex">
        <div className="px-5 py-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-carmine">Staff</p>
          <p className="mt-1 font-display text-3xl leading-none">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {visibleItems.map((item) => navLink(item))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-ivory/75 transition-colors duration-200 hover:bg-white/10 hover:text-ivory"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </aside>

      <button
        type="button"
        className="fixed right-3 top-3 z-[110] flex h-10 w-10 items-center justify-center border border-ink/10 bg-white text-ink md:hidden"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open staff menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[120] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Close staff menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute bottom-0 left-0 top-0 flex w-72 max-w-[85vw] flex-col bg-ink text-ivory">
            <div className="flex items-center justify-between px-5 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-carmine">Staff</p>
                <p className="mt-1 font-display text-3xl leading-none">Admin</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-ivory"
                aria-label="Close staff menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3">
              {visibleItems.map((item) => navLink(item, () => setIsMenuOpen(false)))}
            </nav>
            <div className="border-t border-white/10 p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-11 w-full items-center gap-3 px-3 text-sm text-ivory/75"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <StaffRoleContext.Provider value={role}>
        <div className="px-4 pb-12 pt-20 md:ml-60 md:px-8 md:pt-24">{children}</div>
      </StaffRoleContext.Provider>
    </div>
  );
}
