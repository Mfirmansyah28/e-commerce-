"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const editableFrom = ["PAID", "SHIPPED", "COMPLETED"];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  statusLabel,
}: {
  orderId: string;
  currentStatus: string;
  statusLabel: Record<string, string>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Status PENDING/FAILED dikontrol otomatis oleh webhook Midtrans, admin tidak boleh ubah manual.
  if (!editableFrom.includes(currentStatus)) {
    return <span className="text-muted">{statusLabel[currentStatus]}</span>;
  }

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className="rounded-lg border border-surface-2 bg-surface px-2 py-1 text-sm text-foreground outline-none focus:border-accent"
    >
      <option value="PAID">{statusLabel.PAID}</option>
      <option value="SHIPPED">{statusLabel.SHIPPED}</option>
      <option value="COMPLETED">{statusLabel.COMPLETED}</option>
    </select>
  );
}
