"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";

export default function ContinuePaymentButton({ token }: { token: string; orderId: string }) {
  const router = useRouter();

  function handlePay() {
    window.snap.pay(token, {
      onSuccess: () => router.refresh(),
      onPending: () => router.refresh(),
      onError: () => alert("Pembayaran gagal, coba lagi."),
      onClose: () => router.refresh(),
    });
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />
      <button
        onClick={handlePay}
        className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-medium text-background hover:bg-accent-dark transition-colors"
      >
        Lanjutkan Pembayaran
      </button>
    </>
  );
}
