# FINTARA

**Financial Tracker & Awareness** — aplikasi web untuk membantu kamu (terutama Gen Z Indonesia) mengurangi **impulsive buying** dengan **budget bulanan** dan **timer cooling-off** yang disimpan di server.

Semua data **diinput manual** — tidak ada integrasi bank atau e-commerce.

- **Bahasa UI:** Bahasa Indonesia  
- **Timer cooling-off:** Tersimpan di database (`coolingOffEndsAt`), bukan hanya di browser.  
- **Peringatan saldo:** Dihitung ulang setiap kali menambah wishlist (sisa saldo negatif atau sisa di bawah 20% dari saldo awal).

---

## 1. Arsitektur sistem

| Aspek | Pilihan | Alasan |
|--------|---------|--------|
| **Gaya** | **Monolit** satu repo (Next.js) | MVP untuk solo dev: satu deploy, shared types, tanpa overhead jaringan antar layanan. |
| **Rendering** | **Hybrid SSR + API Route Handlers** | Halaman dashboard/budget/wishlist di-*render* di server (auth, Prisma). API REST di `app/api/*` untuk aksi CRUD. |
| **Auth** | **Auth.js (NextAuth v5)** dengan JWT | Tanpa tabel session DB; cukup untuk MVP; mudah dipindah ke DB session nanti. |
| **Data** | **SQLite** lokal (`prisma/dev.db`); produksi: **PostgreSQL** | Gratis & sederhana untuk development; Prisma sama untuk keduanya — ganti `DATABASE_URL` saja. |

Bukan microservice: skala personal/small team tidak butuh orkestrasi tambahan. Batasi kompleksitas dan biaya deploy.

---

## 2. Stack teknologi

| Teknologi | Peran | Kenapa dipilih |
|-----------|--------|----------------|
| **Next.js 16** (App Router) | UI + API dalam satu proyek | Deploy gratis di Vercel, routing modern, server components. |
| **React 19** | UI | Standar industri, banyak contoh & komunitas. |
| **TypeScript** | Tipe aman | Menguatkan kontrak API & model data. |
| **Tailwind CSS 4** | Styling cepat | Mobile-first, konsisten untuk Gen Z, minim CSS custom. |
| **Prisma 6** | ORM + schema | Migrasi jelas; SQLite/PostgreSQL mudah diganti. |
| **Zod** | Validasi input API | Pesan error terstruktur. |
| **bcryptjs** | Hash password | Tanpa native binding; portabel. |
| **Auth.js v5** | Login email/password | Terintegrasi Next.js, konfigurasi sederhana. |

Semuanya dapat dijalankan **gratis** untuk development; produksi: Vercel (frontend+API) + Neon/Supabase tier gratis (PostgreSQL) jika perlu.

---

## 3. Struktur folder

```
FINTARA/
├── prisma/
│   └── schema.prisma          # Model DB + enum
├── public/                    # Asset statis
├── src/
│   ├── app/
│   │   ├── (authenticated)/ # Route group: layout AppShell
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── budget/
│   │   │   │   ├── page.tsx
│   │   │   │   └── budget-client.tsx
│   │   │   └── wishlist/
│   │   │       ├── page.tsx
│   │   │       ├── wishlist-client.tsx
│   │   │       └── wishlist-item-card.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── budgets/route.ts
│   │   │   └── wishlist/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── login/
│   │   ├── register/
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Landing
│   │   └── globals.css
│   ├── auth.ts              # Konfigurasi Auth.js
│   ├── components/          # UI bersama (Providers, AppShell, dsb.)
│   ├── lib/                 # prisma, money, cooling-off, alerts, dsb.
│   ├── types/
│   └── middleware.ts
├── .env.example
├── package.json
└── README.md
```

---

## 4. Skema database

Relasi singkat:

- **User** 1—N **MonthlyBudget** (unik per `userId` + `monthYear`)
- **MonthlyBudget** 1—N **Necessity**
- **MonthlyBudget** 1—N **WishlistItem**
- **User** 1—N **AlertLog**; **WishlistItem** 0—N **AlertLog**

| Model | Field penting |
|--------|----------------|
| `User` | `email`, `passwordHash`, `name` |
| `MonthlyBudget` | `monthYear` (`"YYYY-MM"`), `totalIncome` (integer IDR) |
| `Necessity` | `name`, `amount` |
| `WishlistItem` | `name`, `price`, `coolingOffEndsAt`, `status` |
| `AlertLog` | `alertType` (WARNING \| CAUTION), `message`, opsional `wishlistItemId` |

Detail lengkap: `prisma/schema.prisma`.

---

## 5. Endpoint API REST

| Method | Rute | Body (JSON) | Response | Deskripsi |
|--------|------|-------------|----------|-----------|
| `POST` | `/api/register` | `email`, `password`, `name?` | `{ ok: true }` | Daftar user (password di-hash). |
| `GET/POST` | `/api/auth/*` | — | — | Handler Auth.js (session, sign-in/out). |
| `GET` | `/api/budgets?month=YYYY-MM` | — | `budget`, `cleanBalance`, `totalNecessities` | Ambil budget bulan + hitung saldo aman. |
| `POST` | `/api/budgets` | `monthYear`, `totalIncome`, `necessities[]` | Budget baru + `cleanBalance` | Upsert budget + ganti daftar kebutuhan. |
| `GET` | `/api/wishlist?month=YYYY-MM` | — | `items`, `cleanBalance`, `budgetId` | Daftar wishlist + alert terkait; sinkron status cooling-off. |
| `POST` | `/api/wishlist` | `name`, `price`, `monthYear` | `item`, `evaluation` | Tambah item; hitung `coolingOffEndsAt`; tulis `AlertLog`. |
| `PATCH` | `/api/wishlist/:id` | `{ action: "bought" \| "skip" }` | `{ item }` | Tandai dibeli / dilewati (hanya jika timer selesai). |

Semua rute API di atas (kecuali register & auth) membutuhkan **sesi login**.

---

## 6. Struktur UI & alur halaman

| Halaman | Fungsi |
|---------|--------|
| `/` | Landing + CTA daftar/masuk |
| `/login`, `/register` | Autentikasi |
| `/dashboard` | Ringkasan saldo aman bulan ini + pintasan |
| `/budget` | Input pemasukan + kebutuhan pokok; tampil saldo aman |
| `/wishlist` | Tambah barang + pratinjau alert; daftar kartu + countdown + tandai beli/lewati |

**Alur user:** Landing → Daftar → Dashboard → **Budget** (wajib isi untuk bulan aktif) → **Wishlist** (tambah barang, lihat timer & peringatan).

Navigasi bawah (mobile-first): Beranda · Budget · Wishlist.

---

## 7. Menjalankan lokal

1. Salin env:

```bash
cp .env.example .env
```

Isi `AUTH_SECRET` dengan string acak panjang (mis. `openssl rand -base64 32`).

2. Database & dependency:

```bash
npm install
npx prisma db push
```

3. Dev server:

```bash
npm run dev
```

Buka `http://localhost:3000` — daftar akun, lalu atur **Budget** untuk bulan berjalan, kemudian **Wishlist**.

**Produksi:** `npm run build` lalu `npm start`; set environment `DATABASE_URL` PostgreSQL, `AUTH_SECRET`, dan `NEXT_PUBLIC_APP_URL`.

---

## Deploy ke Vercel

**Ya, aplikasi ini bisa di-deploy ke Vercel** — Next.js didukung penuh. Perhatikan hal berikut:

| Topik | Penjelasan |
|--------|------------|
| **Filesystem** | Vercel serverless **tidak menyimpan** `dev.db` secara permanen. **Jangan pakai SQLite di production** di Vercel. |
| **Database** | Pakai **PostgreSQL ter-hosting** (mis. [Neon](https://neon.tech), [Supabase](https://supabase.com), atau **Vercel Postgres**) dan dapatkan **connection string** `DATABASE_URL`. |
| **Prisma** | Di `prisma/schema.prisma`, ubah `provider = "sqlite"` menjadi **`provider = "postgresql"`**, lalu dari mesin lokal (dengan `DATABASE_URL` mengarah ke DB baru): `npx prisma db push` atau `npx prisma migrate dev` agar tabel terbentuk di PostgreSQL. |
| **Env di Vercel** | Di Project → Settings → Environment Variables, set minimal: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`, `NEXT_PUBLIC_APP_URL=https://<domain-kamu>.vercel.app` |

Alur singkat: push repo ke GitHub → **Import Project** di [vercel.com](https://vercel.com) → pasang env di atas → **Deploy**. Build memakai `npm run build` (sudah termasuk `prisma generate` lewat script `build`).

Untuk pengembangan lokal kamu bisa tetap pakai SQLite **atau** pakai satu database Neon yang sama supaya skema konsisten.

---

## Aturan bisnis (ringkas)

- **Saldo aman** = `totalIncome` − Σ kebutuhan pokok untuk bulan tersebut.
- **Cooling-off** (berdasarkan harga):
  - di bawah Rp50.000 → 10 menit  
  - Rp50.000 – Rp300.000 → 24 jam  
  - di atas Rp300.000 → 30 hari  
- **Alert:** sisa setelah pembelian negatif → peringatan keras; sisa di bawah 20% dari saldo awal (tetap tidak negatif) → hati-hati.

---

Lisensi proyek pribadi / sesuai kebutuhan kamu.
