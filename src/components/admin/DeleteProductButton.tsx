"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Hapus produk ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Gagal menghapus produk.");
    }
    setLoading(false);
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-danger hover:underline disabled:opacity-50">
      Hapus
    </button>
  );
}
