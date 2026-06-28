import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, paidOrders, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalAmount: true } }),
  ]);

  const stats = [
    { label: "Total Produk", value: totalProducts },
    { label: "Total Pesanan", value: totalOrders },
    { label: "Pesanan Lunas", value: paidOrders },
    { label: "Total Pendapatan", value: formatRupiah(revenue._sum.totalAmount || 0) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-foreground">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-surface-2 bg-surface p-5">
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-2 font-mono text-xl text-accent">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
