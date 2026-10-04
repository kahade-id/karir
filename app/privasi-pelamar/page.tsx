import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi Pelamar",
  description:
    "Bagaimana Kahade mengumpulkan, menggunakan, dan menghapus data lamaran kerja — sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).",
  alternates: { canonical: "/privasi-pelamar" },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Data yang kami kumpulkan",
    body: [
      "Nama lengkap, alamat email, dan nomor HP yang kamu isi di formulir lamaran.",
      "File CV (PDF) yang kamu unggah, URL portofolio, dan cover note bila kamu isi.",
      "Kami tidak mengumpulkan data lain di luar formulir ini. Kami tidak menggunakan cookie pelacakan di situs ini.",
    ],
  },
  {
    title: "Tujuan penggunaan",
    body: [
      "Menilai kecocokan kamu dengan posisi yang dilamar.",
      "Menghubungi kamu mengenai proses rekrutmen (tahap wawancara dan keputusan).",
      "Data tidak digunakan untuk tujuan pemasaran dan tidak dibagikan ke pihak ketiga.",
    ],
  },
  {
    title: "Dasar hukum",
    body: [
      "Persetujuan kamu saat mengirim formulir lamaran (Pasal 20 ayat (2) huruf a UU PDP).",
      "Kepentingan yang sah untuk menjalankan proses rekrutmen secara wajar dan transparan.",
    ],
  },
  {
    title: "Penyimpanan & retensi",
    body: [
      "Data lamaran disimpan di server Kahade dan diakses hanya oleh pihak yang berwenang melakukan rekrutmen.",
      "Lamaran yang DITOLAK dihapus otomatis maksimal 90 hari setelah keputusan penolakan, beserta file CV-nya.",
      "Lamaran yang masih DALAM PROSES disimpan sampai ada keputusan, lalu mengikuti aturan 90 hari di atas bila tidak lolos.",
      "Lamaran yang DITERIMA disimpan sebagai arsip kepegawaian sesuai ketentuan ketenagakerjaan yang berlaku.",
      "Kamu dapat menghapus lamaranmu kapan saja dengan token penghapusan yang diberikan setelah melamar — tanpa perlu akun.",
    ],
  },
  {
    title: "Hak kamu sebagai subjek data",
    body: [
      "Hak mengakses, memperbaiki, dan menghapus data pribadimu.",
      "Hak menarik kembali persetujuan kapan saja — penarikan tidak mempengaruhi pemrosesan yang sudah dilakukan.",
      "Hak mengajukan keberatan atas pemrosesan data tertentu.",
      "Bila token penghapusanmu hilang, hubungi kami manual melalui kontak di bawah; kami akan memverifikasi identitasmu sebelum menghapus data.",
    ],
  },
  {
    title: "Keamanan",
    body: [
      "File CV disimpan secara privat dan hanya dapat diakses melalui tautan bertanda tangan yang kedaluwarsa.",
      "Akses data pelamar di sistem internal dibatasi untuk peran yang berwenang dan tercatat (audit trail).",
    ],
  },
  {
    title: "Kontak",
    body: [
      "PT Kawal Hak Dengan Aman — situs https://kahade.id. Untuk pertanyaan atau permintaan terkait data pribadimu, hubungi kami melalui kanal resmi Kahade dan sebutkan bahwa ini terkait lamaran kerja.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
        Kebijakan Privasi Pelamar
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-500">
        Terakhir diperbarui: 3 Oktober 2026. Halaman ini menjelaskan bagaimana
        Kahade memproses data pribadimu saat kamu melamar kerja, sesuai UU
        No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
      </p>

      <div className="mt-8 space-y-3">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            aria-label={s.title}
            className="rounded-2xl border border-neutral-200 bg-white px-6 py-5"
          >
            <h2 className="text-base font-bold text-black">{s.title}</h2>
            <ul className="mt-3 space-y-2">
              {s.body.map((p, i) => (
                <li
                  key={i}
                  className="text-sm leading-relaxed text-neutral-600"
                >
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-5 text-center">
        <p className="text-sm font-bold text-black">Ingin menghapus lamaranmu?</p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">
          Gunakan token penghapusan yang kamu terima setelah melamar.
        </p>
        <Link
          href="/hapus-lamaran"
          className="mt-3 inline-block rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Hapus lamaran
        </Link>
      </div>
    </div>
  );
}
