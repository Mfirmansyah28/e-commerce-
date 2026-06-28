import midtransClient from "midtrans-client";

// isProduction harus false untuk sandbox testing.
// Saat deploy production sungguhan, ganti jadi true DAN ganti server/client key ke yang production.
export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Core API dipakai untuk cek status transaksi (misalnya dari webhook handler)
export const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});
