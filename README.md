# Kahade Karir

Halaman karir publik Kahade — **karir.kahade.id**. Repo Next.js terpisah (stack disamakan dengan repo `landing`).

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript 7 · Plus Jakarta Sans · Phosphor Icons

## Jalankan lokal

```bash
npm install
npm run dev          # http://localhost:3000
```

## Variabel environment

Salin `.env.example` ke `.env`:

```bash
cp .env.example .env
```

| Var | Nilai | Keterangan |
|-----|-------|------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.kahade.id/v1` | Base URL backend. Di-bake saat build — ganti nilai butuh redeploy. |

## Perintah

- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — build produksi (wajib lolos sebelum deploy)

## Kontrak API backend

| Method | Endpoint | Respons |
|--------|----------|---------|
| GET | `/v1/careers/postings` | `{ postings: [...] }` |
| GET | `/v1/careers/postings/:slug` | posting penuh |
| GET | `/v1/careers/captcha` | `{ challengeId, question }` |
| POST | `/v1/careers/upload-cv` (multipart `file`) | `{ fileKey, expiresIn }` |
| POST | `/v1/careers/applications` | `{ id, deletionToken }` |

Lihat `lib/api.ts` untuk tipe dan pemetaan pesan error Bahasa Indonesia.

## Deploy (Vercel)

1. Vercel Dashboard → Add New Project → Import `kahade-id/karir` (preset Next.js).
2. Env Production: `NEXT_PUBLIC_API_BASE_URL=https://api.kahade.id/v1`.
3. Domains → tambah `karir.kahade.id`.
4. DNS: bila DNS kahade.id sudah di Vercel, record dibuat otomatis; bila belum, buat `CNAME karir → cname.vercel-dns.com`.

## Aturan desain

Bersih minimalis (standar Apple): hitam `#000000` / putih `#FFFFFF`. Kuning `#FFD200` HANYA untuk mark logo zigzag, bukan aksen UI. Bahasa Indonesia saja.
