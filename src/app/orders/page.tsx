import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  FAILED: "Gagal / Dibatalkan",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
};

const statusColor: Record<string, string> = {
  PENDING: "text-accent",
  PAID: "text-green-400",
  FAILED: "text-danger",
  SHIPPED: "text-accent",
  COMPLETED: "text-green-400",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-2xl font-medium text-foreground">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-muted">Belum ada pesanan.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-2xl border border-surface-2 bg-surface p-5 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted">{order.orderNumber}</span>
                <span className={`text-sm font-medium ${statusColor[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {order.items.length} item · {new Date(order.createdAt).toLocaleDateString("id-ID")}
              </p>
              <p className="mt-1 font-mono text-foreground">{formatRupiah(order.totalAmount)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
