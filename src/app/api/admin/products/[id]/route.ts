import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") return null;
  return session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });

  const { id } = await params;
  try {
    const { name, description, price, stock, imageUrl } = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price, stock, imageUrl, slug: slugify(name) },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });

  const { id } = await params;
  try {
    // Hapus order item terkait dulu kalau ada (atau cukup cegah hapus produk yang sudah pernah dipesan
    // -- di sini kita pilih cara sederhana: tolak hapus kalau produk masih punya riwayat order).
    const hasOrders = await prisma.orderItem.findFirst({ where: { productId: id } });
    if (hasOrders) {
      return NextResponse.json(
        { error: "Produk tidak bisa dihapus karena sudah memiliki riwayat pesanan. Set stok ke 0 sebagai gantinya." },
        { status: 400 }
      );
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Produk dihapus" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}
