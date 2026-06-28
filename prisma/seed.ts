import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const products = [
  {
    name: "Kopi Arabika Gayo 200g",
    description: "Biji kopi arabika single origin dari dataran tinggi Gayo, Aceh. Cita rasa fruity dengan after taste manis.",
    price: 85000,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600",
    stock: 25,
  },
  {
    name: "Kopi Robusta Lampung 250g",
    description: "Robusta khas Lampung dengan body tebal dan rasa pahit yang kuat, cocok untuk kopi tubruk.",
    price: 55000,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    stock: 40,
  },
  {
    name: "Kopi Toraja Premium 200g",
    description: "Kopi toraja dengan keasaman rendah dan aroma earthy yang khas dari dataran tinggi Sulawesi.",
    price: 110000,
    imageUrl: "https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=600",
    stock: 15,
  },
  {
    name: "Drip Coffee Bag (isi 10)",
    description: "Praktis untuk diseduh kapan saja, cukup tuang air panas. Cocok untuk traveling atau kantor.",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600",
    stock: 60,
  },
  {
    name: "French Press 600ml",
    description: "Alat seduh kopi French Press kapasitas 600ml, bahan kaca tahan panas dan saringan stainless steel.",
    price: 175000,
    imageUrl: "https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=600",
    stock: 10,
  },
  {
    name: "Kopi Susu Gula Aren 250ml (Ready to Drink)",
    description: "Kopi susu kekinian dengan gula aren asli, dikemas botol siap minum.",
    price: 22000,
    imageUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600",
    stock: 50,
  },
];

async function main() {
  console.log("Mulai seeding...");

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: { ...p },
      create: { ...p, slug: slugify(p.name) },
    });
  }

  // Buat akun admin default. GANTI PASSWORD INI setelah login pertama kali di production.
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@kopisenja.com" },
    update: {},
    create: {
      name: "Admin Kopi Senja",
      email: "admin@kopisenja.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin dibuat -> email: admin@kopisenja.com / password: admin123");

  console.log(`Selesai. ${products.length} produk berhasil ditambahkan.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
