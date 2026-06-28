import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// Midtrans mengirim notifikasi ke endpoint ini setiap kali status transaksi berubah
// (pending -> settlement/capture -> dst). Endpoint ini HARUS public (tanpa auth session),
// karena yang memanggil adalah server Midtrans, bukan browser user.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type } = body;

    // 1. WAJIB verifikasi signature, supaya tidak ada orang lain yang bisa kirim
    // notifikasi palsu untuk "menandai" order sebagai sudah dibayar.
    // Formula resmi Midtrans: sha512(order_id + status_code + gross_amount + server_key)
    const expectedSignature = crypto
      .createHash("sha512")
      .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest("hex");

    if (expectedSignature !== signature_key) {
      console.error("Signature tidak valid, kemungkinan request palsu.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: order_id },
      include: { items: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    // 2. Map status Midtrans -> status order kita
    let newStatus = order.status;
    if (transaction_status === "capture" || transaction_status === "settlement") {
      newStatus = "PAID";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      newStatus = "FAILED";
    } else if (transaction_status === "pending") {
      newStatus = "PENDING";
    }

    // 3. Update status order. Kalau baru jadi PAID, kurangi stok produk sekalian
    // (pakai transaction supaya keduanya atomic — kalau satu gagal, semua di-rollback).
    if (newStatus === "PAID" && order.status !== "PAID") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: newStatus, paymentMethod: payment_type },
        }),
        ...order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ]);
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: newStatus, paymentMethod: payment_type },
      });
    }

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
