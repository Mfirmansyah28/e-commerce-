import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });

  try {
    const { name, description, price, stock, imageUrl } = await request.json();
    if (!name || !description || price == null || !imageUrl) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: { name, description, price, stock, imageUrl, slug: slugify(name) },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Gagal membuat produk" }, { status: 500 });
  }
}
