"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { formatRupiah } from "@/lib/utils";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: unknown) => void;
          onPending: (result: unknown) => void;
          onError: (result: unknown) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [shipping, setShipping] = useState({
    recipientName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (session?.user?.name) {
      setShipping((s) => ({ ...s, recipientName: s.recipientName || session.user!.name! }));
    }
  }, [session]);

  function isShippingValid() {
    return (
      shipping.recipientName.trim() &&
      shipping.phone.trim() &&
      shipping.address.trim() &&
      shipping.city.trim() &&
      shipping.postalCode.trim()
    );
  }

  async function handlePay() {
    if (!isShippingValid()) {
      setError("Lengkapi alamat pengiriman terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shipping,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Gagal memulai pembayaran");
      setLoading(false);
      return;
    }

    window.snap.pay(data.token, {
      onSuccess: () => {
        clearCart();
        router.push(`/orders/${data.orderId}`);
      },
      onPending: () => {
        clearCart();
        router.push(`/orders/${data.orderId}`);
      },
      onError: () => {
        setError("Pembayaran gagal. Silakan coba lagi.");
        setLoading(false);
      },
      onClose: () => {
        setLoading(false);
      },
    });
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-muted">Keranjang kosong, tidak ada yang bisa dibayar.</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-2xl font-medium text-foreground">Alamat Pengiriman</h1>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Nama Penerima"
            value={shipping.recipientName}
            onChange={(e) => setShipping({ ...shipping, recipientName: e.target.value })}
            className="rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent sm:col-span-2"
          />
          <input
            placeholder="Nomor HP"
            value={shipping.phone}
            onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
            className="rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent sm:col-span-2"
          />
          <textarea
            placeholder="Alamat lengkap (jalan, RT/RW, kecamatan)"
            value={shipping.address}
            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
            rows={3}
            className="rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent sm:col-span-2"
          />
          <input
            placeholder="Kota"
            value={shipping.city}
            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
            className="rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
          />
          <input
            placeholder="Kode Pos"
            value={shipping.postalCode}
            onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
            className="rounded-xl border border-surface-2 bg-surface px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <h2 className="mt-8 font-display text-xl font-medium text-foreground">Ringkasan Pesanan</h2>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-surface-2 bg-surface p-5">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.name} <span className="text-muted">x{item.quantity}</span>
              </span>
              <span className="font-mono text-muted">{formatRupiah(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-surface-2 pt-3">
            <span className="font-medium text-foreground">Total</span>
            <span className="font-mono text-lg text-accent">{formatRupiah(totalPrice())}</span>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-medium text-background hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Pembayaran diproses aman melalui Midtrans (mode sandbox/testing).
        </p>
      </div>
    </>
  );
}
