import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import ContinuePaymentButton from "@/components/ContinuePaymentButton";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  FAILED: "Gagal / Dibatalkan",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="font-mono text-sm text-muted">{order.orderNumber}</p>
      <h1 className="mt-1 font-display text-2xl font-medium text-foreground">
        {statusLabel[order.status]}
      </h1>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-surface-2 bg-surface p-5">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-foreground">
              {item.product.name} <span className="text-muted">x{item.quantity}</span>
            </span>
            <span className="font-mono text-muted">{formatRupiah(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-surface-2 pt-3">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-mono text-lg text-accent">{formatRupiah(order.totalAmount)}</span>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 rounded-2xl border border-surface-2 bg-surface p-5">
          <h2 className="font-display text-base font-medium text-foreground">Alamat Pengiriman</h2>
          <p className="mt-2 text-sm text-foreground">{order.shippingName}</p>
          <p className="text-sm text-muted">{order.shippingPhone}</p>
          <p className="mt-1 text-sm text-muted">
            {order.shippingAddress}, {order.shippingCity} {order.shippingPostal}
          </p>
        </div>
      )}

      {order.status === "PENDING" && order.midtransToken && (
        <ContinuePaymentButton token={order.midtransToken} orderId={order.id} />
      )}
    </div>
  );
}
