import { Briefcase } from "@phosphor-icons/react/dist/ssr";
import { Alert, buttonClasses, EmptyState } from "@kahade/ui";
import JobCard from "@/components/jobs/JobCard";
import type { JobPostingSummary } from "@/lib/api";

interface Props {
  postings: JobPostingSummary[];
  /** true bila fetch API gagal — tampilkan error, bukan empty state. */
  error?: boolean;
}

export default function JobList({ postings, error }: Props) {
  if (error) {
    return (
      <div>
        <Alert variant="danger" title="Gagal memuat daftar lowongan.">
          Periksa koneksi internetmu lalu muat ulang halaman.
        </Alert>
        {/* <a> biasa (bukan Link) agar full reload dan fetch server diulang. */}
        <a href="/" className={`${buttonClasses("secondary", "md")} mt-4 w-full`}>
          Muat ulang halaman
        </a>
      </div>
    );
  }

  if (postings.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Belum ada lowongan terbuka"
        description="Saat ini belum ada posisi yang dibuka. Cek kembali lain waktu — kami akan menambah posisi baru di sini."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {postings.map((posting) => (
        <JobCard key={posting.id} posting={posting} />
      ))}
    </div>
  );
}
