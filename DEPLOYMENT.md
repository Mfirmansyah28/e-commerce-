# Panduan Deploy ke Vercel

## 1. Push ke GitHub

```bash
cd ecommerce-belajar
git init
git add .
git commit -m "Initial commit: Kopi Senja e-commerce"
```

Buat repo baru di GitHub (lewat web github.com/new), lalu:

```bash
git remote add origin https://github.com/USERNAME/kopi-senja.git
git branch -M main
git push -u origin main
```

## 2. Import ke Vercel

1. Buka https://vercel.com → login dengan GitHub
2. Klik **Add New → Project**
3. Pilih repo `kopi-senja` yang baru di-push
4. Framework Preset otomatis terdeteksi "Next.js" — biarkan default

## 3. Isi Environment Variables

Sebelum klik Deploy, scroll ke bagian **Environment Variables**, isi satu-satu (sama seperti isi `.env` lokal):

| Key | Value |
|---|---|
| `DATABASE_URL` | connection string dari Neon |
| `AUTH_SECRET` | hasil `openssl rand -base64 32` |
| `MIDTRANS_SERVER_KEY` | dari dashboard Midtrans (sandbox) |
| `MIDTRANS_CLIENT_KEY` | dari dashboard Midtrans (sandbox) |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | sama dengan `MIDTRANS_CLIENT_KEY` |
| `NEXT_PUBLIC_APP_URL` | isi sementara apa saja, akan diupdate di langkah 5 |

Klik **Deploy**.

## 4. Migrasi Database Production

Setelah deploy pertama selesai, jalankan migrasi dari laptopmu supaya tabel terbuat di database Neon production:

```bash
# pastikan .env lokal menunjuk ke DATABASE_URL yang SAMA dengan yang diisi di Vercel
npx prisma migrate deploy
npx prisma db seed
```

## 5. Update NEXT_PUBLIC_APP_URL

1. Setelah deploy sukses, Vercel akan beri URL seperti `https://kopi-senja.vercel.app`
2. Kembali ke **Project Settings → Environment Variables**, update `NEXT_PUBLIC_APP_URL` dengan URL asli ini
3. Klik **Redeploy** (di tab Deployments → ⋯ → Redeploy) supaya perubahan env var terpakai

## 6. Setup Webhook Midtrans ke URL Production

1. dashboard.midtrans.com (Sandbox) → Settings → Configuration
2. Payment Notification URL: `https://kopi-senja.vercel.app/api/midtrans/webhook`
3. Save

## 7. Test End-to-End

1. Buka situs production-nya
2. Register akun baru → login
3. Tambah produk ke keranjang → checkout → bayar dengan kartu test sandbox
4. Cek halaman "Pesanan Saya" — status harus berubah jadi "Sudah Dibayar" dalam beberapa detik

## Naik ke Mode Production (Uang Asli) — Opsional

Kalau nanti project ini dipakai jualan sungguhan:

1. Di dashboard Midtrans, lengkapi proses verifikasi bisnis untuk akses Production
2. Dapatkan Server Key & Client Key versi **Production** (bukan `SB-Mid-...`)
3. Ganti environment variable di Vercel dengan key production tersebut
4. Di `src/lib/midtrans.ts`, ganti `isProduction: false` menjadi `isProduction: true`
5. Di `src/app/checkout/page.tsx` dan `src/components/ContinuePaymentButton.tsx`, ganti URL Snap.js dari
   `https://app.sandbox.midtrans.com/snap/snap.js` menjadi `https://app.midtrans.com/snap/snap.js`
6. Update Payment Notification URL di dashboard Midtrans mode Production
