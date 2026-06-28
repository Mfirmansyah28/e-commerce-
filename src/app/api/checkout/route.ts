import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { snap } from "@/lib/midtrans";
import { generateOrderNumber } from "@/lib/utils";

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface ShippingInfo {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export async function POST(request: Request) {
  // 1. Pastikan user sudah login
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Silakan login dahulu" }, { status: 401 });
  }

  try {
    const { items, shipping }: { items: CheckoutItem[]; shipping: ShippingInfo } = await request.json();
    if (!items?.length) {
      return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
    }
    if (
      !shipping?.recipientName?.trim() ||
      !shipping?.phone?.trim() ||
      !shipping?.address?.trim() ||
      !shipping?.city?.trim() ||
      !shipping?.postalCode?.trim()
    ) {
      return NextResponse.json({ error: "Lengkapi alamat pengiriman" }, { status: 400 });
    }

    // 2. PENTING: Jangan percaya harga dari client. Ambil ulang harga & stok dari database
    // supaya orang tidak bisa memanipulasi harga lewat request langsung ke API ini.
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let totalAmount = 0;
    const orderItemsData: { productId: string; quantity: number; price: number }[] = [];
    const itemDetails: { id: string; price: number; quantity: number; name: string }[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Produk tidak ditemukan` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stok "${product.name}" tidak cukup` },
          { status: 400 }
        );
      }
      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price, // snapshot harga saat ini
      });
      itemDetails.push({
        id: product.id,
        price: product.price,
        quantity: item.quantity,
        name: product.name.slice(0, 50), // Midtrans membatasi panjang nama item
      });
    }

    const orderNumber = generateOrderNumber();

    // 3. Buat order dengan status PENDING dulu (belum dibayar)
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        totalAmount,
        status: "PENDING",
        shippingName: shipping.recipientName.trim(),
        shippingPhone: shipping.phone.trim(),
        shippingAddress: shipping.address.trim(),
        shippingCity: shipping.city.trim(),
        shippingPostal: shipping.postalCode.trim(),
        items: { create: orderItemsData },
      },
    });

    // 4. Minta Snap token ke Midtrans
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderNumber,
        gross_amount: totalAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email || undefined,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`,
      },
    });

    // Simpan token di order (opsional, untuk re-open Snap kalau user belum bayar)
    await prisma.order.update({
      where: { id: order.id },
      data: { midtransToken: transaction.token },
    });

    return NextResponse.json({
      orderId: order.id,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Gagal membuat transaksi" }, { status: 500 });
  }
}
