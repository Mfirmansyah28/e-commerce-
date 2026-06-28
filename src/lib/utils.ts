export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function generateOrderNumber(): string {
  // Format: ORDER-<timestamp>-<random4digit>, dijamin unik untuk dipakai sebagai order_id Midtrans
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORDER-${Date.now()}-${random}`;
}
