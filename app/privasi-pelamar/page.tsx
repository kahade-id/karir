import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Breadcrumb,
  Container,
  PageHeader,
  Prose,
  Toc,
  type TocItem,
} from "@kahade/ui";
import { LinkButton } from "@/components/ui/LinkButton";

export const metadata: Metadata = {
  title: "Kebijakan Privasi Pelamar",
  description:
    "Bagaimana Kahade mengumpulkan, menggunakan, dan menghapus data lamaran kerja — sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).",
  alternates: { canonical: "/privasi-pelamar" },
};

const SECTIONS: { id: string; title: string; body: ReactNode[] }[] = [
  {
    id: "data",
    title: "Data yang kami kumpulkan",
    body: [
      "Nama lengkap, alamat email, dan nomor HP yang kamu isi di formulir lamaran.",
      "File CV (PDF) yang kamu unggah, URL portofolio, dan cover note bila kamu isi.",
      "Kami tidak mengumpulkan data lain di luar formulir ini. Kami tidak menggunakan cookie pelacakan di situs ini.",
    ],
  },
  {
    id: "tujuan",
    title: "Tujuan penggunaan",
    body: [
      "Menilai kecocokan kamu dengan posisi yang dilamar.",
      "Menghubungi kamu mengenai proses rekrutmen (tahap wawancara dan keputusan).",
      "Data tidak digunakan untuk tujuan pemasaran dan tidak dibagikan ke pihak ketiga.",
    ],
  },
  {
    id: "dasar-hukum",
    title: "Dasar hukum",
    body: [
      "Persetujuan kamu saat mengirim formulir lamaran (Pasal 20 ayat (2) huruf a UU PDP).",
      "Kepentingan yang sah untuk menjalankan proses rekrutmen secara wajar dan transparan.",
    ],
  },
  {
    id: "retensi",
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
    id: "hak",
    title: "Hak kamu sebagai subjek data",
    body: [
      "Hak mengakses, memperbaiki, dan menghapus data pribadimu.",
      "Hak menarik kembali persetujuan kapan saja — penarikan tidak mempengaruhi pemrosesan yang sudah dilakukan.",
      "Hak mengajukan keberatan atas pemrosesan data tertentu.",
      "Bila token penghapusanmu hilang, hubungi kami manual melalui kontak di bawah; kami akan memverifikasi identitasmu sebelum menghapus data.",
    ],
  },
  {
    id: "keamanan",
    title: "Keamanan",
    body: [
      "File CV disimpan secara privat dan hanya dapat diakses melalui tautan bertanda tangan yang kedaluwarsa.",
      "Akses data pelamar di sistem internal dibatasi untuk peran yang berwenang dan tercatat (audit trail).",
    ],
  },
  {
    id: "kontak",
    title: "Kontak",
    body: [
      <>
        PT Kawal Hak Dengan Aman — situs{" "}
        <a href="https://kahade.id">https://kahade.id</a>. Untuk pertanyaan
        atau permintaan terkait data pribadimu, hubungi kami melalui kanal
        resmi Kahade dan sebutkan bahwa ini terkait lamaran kerja.
      </>,
    ],
  },
];

const TOC: TocItem[] = SECTIONS.map((s) => ({ id: s.id, label: s.title }));

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        size="h2"
        breadcrumb={
          <Breadcrumb
            items={[{ label: "Karir", href: "/" }, { label: "Kebijakan Privasi Pelamar" }]}
          />
        }
        title="Kebijakan Privasi Pelamar"
        lede="Halaman ini menjelaskan bagaimana Kahade memproses data pribadimu saat kamu melamar kerja, sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)."
        meta={[
          { label: "Terakhir diperbarui", value: "3 Oktober 2026" },
          { label: "Dasar hukum", value: "UU No. 27 Tahun 2022 (UU PDP)" },
          { label: "Penyelenggara", value: "PT Kawal Hak Dengan Aman" },
        ]}
      />

      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-4">
              <Toc items={TOC} />
            </div>
          </aside>
          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            <Toc items={TOC} title="Daftar isi" variant="disclosure" className="mb-10 lg:hidden" />
            <Prose className="max-w-reading">
              {SECTIONS.flatMap((s) => [
                <h2 key={`${s.id}-h`} id={s.id}>
                  {s.title}
                </h2>,
                s.body.length === 1 ? (
                  <p key={`${s.id}-p`}>{s.body[0]}</p>
                ) : (
                  <ul key={`${s.id}-l`}>
                    {s.body.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                ),
              ])}
            </Prose>
          </div>
        </div>
      </Container>

      <section className="bg-surface-inverse text-white" aria-labelledby="judul-hapus">
        <Container className="flex flex-col gap-8 py-14 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 id="judul-hapus" className="text-h3 text-white">
              Ingin menghapus lamaranmu?
            </h2>
            <p className="mt-3 text-body-lg text-white/70">
              Gunakan token penghapusan yang kamu terima setelah melamar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/hapus-lamaran" variant="inverse">
              Hapus lamaran
            </LinkButton>
            <LinkButton href="/#lowongan" variant="inverseSecondary">
              Lihat lowongan
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
