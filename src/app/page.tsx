import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-surface-2 px-6 py-20 md:py-28">
        <div className="coffee-ring h-72 w-72 -right-20 -top-20" />
        <div className="coffee-ring h-40 w-40 left-10 bottom-0" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Diseduh sejak senja
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-foreground md:text-6xl">
            Kopi Nusantara, dari Kebun ke Cangkirmu
          </h1>
          <p className="mt-5 text-base text-muted md:text-lg">
            Biji kopi single origin, drip bag, dan alat seduh pilihan —
            dipanggang dalam batch kecil agar rasanya tetap jujur.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-medium text-foreground">Semua Produk</h2>
          <span className="font-mono text-sm text-muted">{products.length} item</span>
        </div>

        {products.length === 0 ? (
          <p className="text-muted">
            Belum ada produk. Jalankan <code className="text-accent">npx prisma db seed</code> untuk mengisi data contoh.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                price={p.price}
                imageUrl={p.imageUrl}
                stock={p.stock}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
