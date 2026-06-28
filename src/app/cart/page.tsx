"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { formatRupiah } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-foreground">Keranjang kosong</h1>
        <p className="mt-2 text-muted">Belum ada produk yang ditambahkan.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background hover:bg-accent-dark transition-colors"
        >
          Lihat Produk
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    if (!session) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-2xl font-medium text-foreground">Keranjang Belanja</h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-2xl border border-surface-2 bg-surface p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-foreground">{item.name}</h3>
              <p className="mt-1 font-mono text-sm text-accent">{formatRupiah(item.price)}</p>
            </div>

            <div className="flex items-center rounded-full border border-surface-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-3 py-1.5 text-foreground hover:text-accent"
              >
                −
              </button>
              <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-3 py-1.5 text-foreground hover:text-accent"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-muted hover:text-danger transition-colors"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-surface-2 pt-6">
        <span className="text-muted">Total</span>
        <span className="font-mono text-xl text-foreground">{formatRupiah(totalPrice())}</span>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-medium text-background hover:bg-accent-dark transition-colors"
      >
        Lanjut ke Pembayaran
      </button>
    </div>
  );
}
