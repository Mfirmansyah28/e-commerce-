"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload gagal");
      onChange(data.secure_url);
    } catch {
      setError("Gagal upload gambar. Cek koneksi atau konfigurasi Cloudinary.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-sm text-muted">Gambar Produk</label>

      {value && (
        <div className="mt-2 relative h-40 w-40 overflow-hidden rounded-xl border border-surface-2">
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="mt-2 block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-background hover:file:bg-accent-dark"
      />

      {uploading && <p className="mt-1 text-sm text-accent">Mengunggah...</p>}
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
