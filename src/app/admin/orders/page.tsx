import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  FAILED: "Gagal/Dibatalkan",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-foreground">Pesanan</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-surface-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-2 bg-surface text-left text-muted">
              <th className="px-4 py-3">No. Order</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-surface-2 last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-muted">{o.orderNumber}</td>
                <td className="px-4 py-3 text-foreground">{o.user.name}</td>
                <td className="px-4 py-3 font-mono text-muted">{formatRupiah(o.totalAmount)}</td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={o.id} currentStatus={o.status} statusLabel={statusLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
