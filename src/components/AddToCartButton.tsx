"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";

interface Props {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function AddToCartButton({ id, name, price, imageUrl, stock }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  if (stock === 0) {
    return (
      <button disabled className="mt-6 w-full rounded-full bg-surface-2 py-3 text-sm font-medium text-muted">
        Stok habis
      </button>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-surface-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2 text-foreground hover:text-accent"
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            className="px-4 py-2 text-foreground hover:text-accent"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          addItem({ productId: id, name, price, imageUrl, stock }, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="w-full rounded-full bg-accent py-3 text-sm font-medium text-background transition-colors hover:bg-accent-dark"
      >
        {added ? "Ditambahkan ✓" : "Tambah ke Keranjang"}
      </button>

      <button
        onClick={() => {
          addItem({ productId: id, name, price, imageUrl, stock }, qty);
          router.push("/cart");
        }}
        className="w-full rounded-full border border-surface-2 py-3 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
      >
        Beli Sekarang
      </button>
    </div>
  );
}
