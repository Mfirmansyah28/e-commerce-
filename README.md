# Kopi Senja — E-Commerce Sederhana dengan Payment Integration

Project belajar full-stack: Next.js 15 (App Router) + Prisma + PostgreSQL (Neon) + Auth.js + Midtrans Snap.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- Prisma ORM + PostgreSQL (Neon)
- Auth.js v5 (Credentials provider)
- Zustand (cart state, persisted ke localStorage)
- Midtrans Snap (payment gateway, sandbox)
- Vercel (deployment)

## Setup Lokal

1. Install dependency:
   ```bash
   npm install
   ```

2. Isi file `.env` (sudah ada dari `.env.example`):
   ```
   DATABASE_URL="postgresql://...dari Neon..."
   AUTH_SECRET="hasil dari: openssl rand -base64 32"
   MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxx"
   MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxx"
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxx"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. Generate Prisma client & migrasi database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. Jalankan dev server:
   ```bash
   npm run dev
   ```

## Testing Pembayaran (Sandbox)

Kartu test: 4811 1111 1111 1114, exp bulan/tahun masa depan, CVV 123, OTP 112233.

## Setup Webhook Midtrans (WAJIB)

1. dashboard.midtrans.com (mode Sandbox) -> Settings -> Configuration
2. Isi Payment Notification URL: https://domain-kamu.vercel.app/api/midtrans/webhook
3. Untuk testing lokal sebelum deploy: `ngrok http 3000`, lalu isi URL ngrok-nya

Tanpa ini, status order tidak akan otomatis berubah jadi PAID.

## Deploy

Lihat DEPLOYMENT.md.
