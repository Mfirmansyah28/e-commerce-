import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-foreground">Produk</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-dark transition-colors"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-surface-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-2 bg-surface text-left text-muted">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Stok</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-surface-2 last:border-0">
                <td className="px-4 py-3 text-foreground">{p.name}</td>
                <td className="px-4 py-3 font-mono text-muted">{formatRupiah(p.price)}</td>
                <td className="px-4 py-3 text-muted">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}/edit`} className="mr-3 text-accent hover:underline">
                    Edit
                  </Link>
                  <DeleteProductButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
