"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatRupiah } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function ProductCard({ id, name, slug, price, imageUrl, stock }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-surface-2 bg-surface transition-colors hover:border-accent/50">
      <Link href={`/products/${slug}`} className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {stock === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-danger px-3 py-1 text-xs font-medium text-foreground">
            Stok habis
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${slug}`}>
          <h3 className="font-display text-base font-medium leading-snug text-foreground hover:text-accent transition-colors">
            {name}
          </h3>
        </Link>
        <span className="mt-auto font-mono text-sm text-accent">{formatRupiah(price)}</span>
        <button
          onClick={() => addItem({ productId: id, name, price, imageUrl, stock })}
          disabled={stock === 0}
          className="mt-2 w-full rounded-full border border-surface-2 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          {stock === 0 ? "Tidak tersedia" : "+ Keranjang"}
        </button>
      </div>
    </div>
  );
}
