import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
      <aside className="w-48 shrink-0">
        <p className="font-display text-lg text-foreground">Panel Admin</p>
        <nav className="mt-6 flex flex-col gap-1">
          <Link href="/admin" className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/admin/products" className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground">
            Produk
          </Link>
          <Link href="/admin/orders" className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground">
            Pesanan
          </Link>
          <Link href="/" className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground">
            ← Kembali ke Toko
          </Link>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
