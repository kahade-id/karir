import type { Metadata } from "next";
import EquityNotice from "@/components/site/EquityNotice";
import JobList from "@/components/jobs/JobList";
import { getPostings } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Karier di Kahade — Bangun Sosial Commerce Indonesia",
  description:
    "Bergabung dengan tim awal Kahade. Skema kompensasi transparan: tanpa gaji, dengan saham/equity PT Kawal Hak Dengan Aman. Lihat lowongan yang terbuka.",
  alternates: { canonical: "/" },
};

const FAQS = [
  {
    q: "Kenapa tanpa gaji?",
    a: "Kahade masih tahap awal dan didanai mandiri oleh founder. Kami memilih kompensasi saham agar insentif tim selaras dengan keberhasilan perusahaan.",
  },
  {
    q: "Kapan mulai ada gaji?",
    a: "Ada trigger yang disepakati di awal (mis. pendanaan masuk atau pendapatan mencapai target). Ditulis di dokumen kesepakatan, bukan janji lisan.",
  },
  {
    q: "Bagaimana vesting bekerja?",
    a: "Saham diberikan bertahap (vesting) selama kamu berkontribusi, umumnya dengan cliff 1 tahun. Detail di dokumen legal.",
  },
  {
    q: "Apakah dokumennya resmi?",
    a: "Ya. Kesepakatan saham dituangkan dalam dokumen legal (notaris/konsultan hukum) SEBELUM kamu mulai. Jangan terima tawaran saham tanpa dokumen tertulis — dari siapapun, termasuk kami.",
  },
  {
    q: "Data lamaran saya disimpan berapa lama?",
    a: "Lamaran yang tidak lolos dihapus otomatis maksimal 90 hari setelah keputusan. Kamu juga bisa menghapus lamaranmu kapan saja dengan token yang kami berikan setelah melamar.",
  },
];

export default async function HomePage() {
  let postings: Awaited<ReturnType<typeof getPostings>> = [];
  try {
    postings = await getPostings();
  } catch {
    postings = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      {/* Hero */}
      <section className="py-6 text-center sm:py-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Logo Kahade" className="mx-auto h-14 w-14" />
        <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Bangun Kahade bareng kami.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-neutral-600">
          Kahade adalah aplikasi jual-beli pengguna ke pengguna yang
          tampilannya seperti media sosial. Tim awal kami kecil — setiap orang
          memegang peran besar.
        </p>
      </section>

      <EquityNotice />

      {/* Daftar lowongan */}
      <section id="lowongan" className="mt-12 scroll-mt-20">
        <h2 className="text-xl font-bold tracking-tight text-black">
          Lowongan terbuka
        </h2>
        <div className="mt-5">
          <JobList postings={postings} />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-xl font-bold tracking-tight text-black">
          Sering ditanyakan
        </h2>
        <dl className="mt-5 space-y-3">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 transition-colors hover:border-neutral-300"
            >
              <dt className="text-sm font-bold text-black">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-600">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
