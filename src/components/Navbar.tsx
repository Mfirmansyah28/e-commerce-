"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());

  // Hindari hydration mismatch: localStorage cart cuma ada di client.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-2 bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-foreground">
          Kopi Senja
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Produk
          </Link>

          {session && (
            <Link href="/orders" className="text-sm text-muted hover:text-foreground transition-colors">
              Pesanan Saya
            </Link>
          )}

          {(session?.user as { role?: string })?.role === "ADMIN" && (
            <Link href="/admin" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
              Admin
            </Link>
          )}

          <Link href="/cart" className="relative text-sm text-muted hover:text-foreground transition-colors">
            Keranjang
            {mounted && totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-background">
                {totalItems}
              </span>
            )}
          </Link>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-surface-2 px-4 py-1.5 text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-background hover:bg-accent-dark transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
