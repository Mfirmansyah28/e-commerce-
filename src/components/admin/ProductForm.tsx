"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export default function ProductForm({ initialData }: { initialData?: ProductFormData }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    initialData || { name: "", description: "", price: 0, stock: 0, imageUrl: "" }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(initialData?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.imageUrl) {
      setError("Upload gambar produk terlebih dahulu.");
      return;
    }

    setLoading(true);
    const url = isEdit ? `/api/admin/products/${initialData!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan produk");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex max-w-lg flex-col gap-4">
      <div>
        <label className="text-sm text-muted">Nama Produk</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="text-sm text-muted">Deskripsi</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted">Harga (Rp)</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-sm text-muted">Stok</label>
          <input
            type="number"
            required
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-full bg-accent py-2.5 text-sm font-medium text-background hover:bg-accent-dark transition-colors disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
      </button>
    </form>
  );
}
