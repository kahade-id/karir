import Link from "next/link";
import { ArrowRight, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { Alert, ButtonLink, EmptyState, Icon } from "@kahade/ui";
import type { JobPostingSummary } from "@/lib/api";
import { oneLine } from "@/lib/markdown";

interface Props {
  postings: JobPostingSummary[];
  /** true bila fetch API gagal — tampilkan error, bukan empty state. */
  error?: boolean;
}

const COLS = "md:grid-cols-12 md:gap-x-6";

/**
 * Daftar lowongan berupa tabel berhairline: posisi | tipe kerja | lokasi |
 * kompensasi. Seluruh baris adalah satu tautan. Di layar kecil kolom
 * tertumpuk: judul + ringkasan, lalu tipe · lokasi, lalu kompensasi.
 */
export default function JobList({ postings, error }: Props) {
  if (error) {
    return (
      <div className="max-w-reading">
        <Alert variant="danger" title="Gagal memuat daftar lowongan.">
          Periksa koneksi internetmu lalu muat ulang halaman.
        </Alert>
        {/* <a> biasa (bukan Link) agar full reload dan fetch server diulang. */}
        <ButtonLink href="/" variant="secondary" className="mt-5">
          Muat ulang halaman
        </ButtonLink>
      </div>
    );
  }

  if (postings.length === 0) {
    return (
      <div className="border-y border-line">
        <EmptyState
          icon={Briefcase}
          title="Belum ada lowongan terbuka"
          description="Saat ini belum ada posisi yang dibuka. Cek kembali lain waktu — kami akan menambah posisi baru di sini."
        />
      </div>
    );
  }

  return (
    <div>
      {/* Kepala kolom (visual). Pembaca layar mendapat label per sel. */}
      <div
        aria-hidden="true"
        className={`hidden border-b border-fg pb-3 text-caption font-semibold text-fg md:grid ${COLS}`}
      >
        <span className="col-span-5">Posisi</span>
        <span className="col-span-2">Tipe kerja</span>
        <span className="col-span-2">Lokasi</span>
        <span className="col-span-3">Kompensasi</span>
      </div>

      <ul aria-label="Lowongan terbuka" className="border-t border-line md:border-t-0">
        {postings.map((posting) => (
          <li key={posting.id} className="border-b border-line">
            <Link
              href={`/lowongan/${posting.slug}`}
              className={`group grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 rounded-tag py-6 sm:py-7 md:items-baseline ${COLS}`}
            >
              <div className="min-w-0 md:col-span-5">
                <h3 className="text-h4 text-fg decoration-1 underline-offset-[5px] group-hover:underline">
                  {posting.title}
                </h3>
                <p className="mt-1.5 max-w-[56ch] text-small text-fg-muted">
                  {oneLine(posting.summary)}
                </p>
              </div>

              {/* Panah (seluler) — kanan atas, sejajar judul. */}
              <span
                aria-hidden="true"
                className="col-start-2 row-start-1 pt-0.5 text-fg transition-transform duration-200 ease-out group-hover:translate-x-1 md:hidden"
              >
                <Icon icon={ArrowRight} size={20} />
              </span>

              <div className="col-span-2 mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-fg-2 md:contents">
                <p className="md:col-span-2">
                  <span className="sr-only">Tipe kerja: </span>
                  {posting.type}
                </p>
                <span aria-hidden="true" className="text-line-control md:hidden">
                  ·
                </span>
                <p className="md:col-span-2">
                  <span className="sr-only">Lokasi: </span>
                  {posting.location}
                </p>
              </div>

              <div className="col-span-2 mt-1.5 flex items-baseline justify-between gap-4 md:col-span-3 md:mt-0">
                <p className="text-small font-semibold text-fg">
                  <span className="sr-only">Kompensasi: </span>
                  {posting.equity}
                </p>
                <span
                  aria-hidden="true"
                  className="hidden shrink-0 self-start text-fg transition-transform duration-200 ease-out group-hover:translate-x-1 md:block"
                >
                  <Icon icon={ArrowRight} size={20} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
