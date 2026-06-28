import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-surface-2">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" priority />
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-3xl font-semibold text-foreground">{product.name}</h1>
          <p className="mt-3 font-mono text-2xl text-accent">{formatRupiah(product.price)}</p>
          <p className="mt-5 leading-relaxed text-muted">{product.description}</p>
          <p className="mt-4 text-sm text-muted">
            Stok: <span className="text-foreground">{product.stock}</span>
          </p>

          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            stock={product.stock}
          />
        </div>
      </div>
    </div>
  );
}
