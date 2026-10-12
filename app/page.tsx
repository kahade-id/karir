import type { Metadata } from "next";
import {
  Container,
  DescriptionList,
  PageHeader,
  Section,
  type PageHeaderMeta,
} from "@kahade/ui";
import EquityNotice from "@/components/site/EquityNotice";
import JobList from "@/components/jobs/JobList";
import { LinkButton } from "@/components/ui/LinkButton";
import { getPostings } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Karir di Kahade — Lowongan Kerja Startup Indonesia",
  description:
    "Lowongan kerja startup di Kahade, aplikasi jual-beli pengguna ke pengguna yang tampilannya seperti media sosial. Tim awal tanpa gaji, dengan saham/equity PT Kawal Hak Dengan Aman. Lihat posisi yang terbuka.",
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

/** Judul kelompok bernomor (kolom kiri) — pola indeks ekosistem. */
function GroupHeading({
  index,
  id,
  title,
  description,
}: {
  index: string;
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <>
      <p className="text-small tabular-nums text-fg-subtle">{index}</p>
      <h2 id={id} className="mt-3 text-h3 text-fg">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-xs text-small text-fg-muted">{description}</p>
      )}
    </>
  );
}

export default async function HomePage() {
  let postings: Awaited<ReturnType<typeof getPostings>> = [];
  let loadError = false;
  try {
    postings = await getPostings();
  } catch {
    postings = [];
    loadError = true;
  }

  // JSON-LD schema.org/Organization — identitas PT di homepage.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PT Kawal Hak Dengan Aman",
    url: "https://karir.kahade.id",
    logo: "https://karir.kahade.id/logo.svg",
    sameAs: [
      "https://kahade.id",
      "https://karir.kahade.id",
      "https://legal.kahade.id",
      "https://bantuan.kahade.id",
      "https://status.kahade.id",
      "https://investor.kahade.id",
      "https://artikel.kahade.id",
    ],
  };

  // Strip meta: hanya fakta dari data live / copy yang sudah ada.
  const locations = Array.from(new Set(postings.map((p) => p.location)));
  const meta: PageHeaderMeta[] = [];
  if (!loadError && postings.length > 0) {
    meta.push({ label: "Posisi terbuka", value: postings.length });
    if (locations.length === 1) meta.push({ label: "Lokasi kerja", value: locations[0] });
  }
  meta.push(
    { label: "Kompensasi", value: "Saham/equity" },
    { label: "Perusahaan", value: "PT Kawal Hak Dengan Aman" }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <PageHeader
        size="display"
        eyebrow="Karir di Kahade"
        title="Bangun Kahade dari nol, bersama tim awal."
        lede="Kahade adalah aplikasi jual-beli pengguna ke pengguna yang tampilannya seperti media sosial. Tim awal kami kecil — setiap orang memegang peran besar."
        actions={
          <>
            <LinkButton href="#lowongan" size="lg" icon="arrow-down">
              Lihat lowongan
            </LinkButton>
            <LinkButton href="#skema" size="lg" variant="secondary">
              Skema kompensasi
            </LinkButton>
          </>
        }
        meta={meta}
      />

      {/* 01 — Skema kompensasi tim awal: tampil sebelum daftar lowongan. */}
      <Section id="skema" spacing="sm" aria-labelledby="judul-skema">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <GroupHeading
              index="01"
              id="judul-skema"
              title="Skema tim awal"
              description="Baca ini sebelum melamar."
            />
          </div>
          <div className="lg:col-span-8">
            <EquityNotice className="max-w-reading" />
          </div>
        </div>
      </Section>

      {/* 02 — Daftar lowongan */}
      <Section id="lowongan" divider spacing="sm" aria-labelledby="judul-lowongan">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <GroupHeading index="02" id="judul-lowongan" title="Lowongan terbuka" />
          </div>
          {!loadError && postings.length > 0 && (
            <p className="text-small text-fg-muted tabular-nums">
              {postings.length} posisi
            </p>
          )}
        </div>
        <div className="mt-8 sm:mt-10">
          <JobList postings={postings} error={loadError} />
        </div>
      </Section>

      {/* 03 — Tanya jawab */}
      <Section
        id="tanya-jawab"
        tone="muted"
        divider
        spacing="sm"
        aria-labelledby="judul-tanya-jawab"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <GroupHeading
                index="03"
                id="judul-tanya-jawab"
                title="Sering ditanyakan"
                description="Soal gaji, saham, dokumen, dan data lamaranmu."
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <DescriptionList
              items={FAQS.map((f) => ({ key: f.q, term: f.q, detail: f.a }))}
            />
          </div>
        </div>
      </Section>

      {/* Ajakan penutup: kendali atas data lamaran. */}
      <section className="bg-surface-inverse text-white" aria-labelledby="judul-data">
        <Container className="flex flex-col gap-8 py-14 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 id="judul-data" className="text-h3 text-white">
              Lamaranmu bisa dihapus kapan saja.
            </h2>
            <p className="mt-3 text-body-lg text-white/70">
              Lamaran yang tidak lolos dihapus otomatis maksimal 90 hari setelah
              keputusan. Kamu juga bisa menghapusnya sendiri dengan token yang
              kami berikan setelah melamar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/privasi-pelamar" variant="inverse">
              Kebijakan privasi pelamar
            </LinkButton>
            <LinkButton href="/hapus-lamaran" variant="inverseSecondary">
              Hapus lamaran
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
