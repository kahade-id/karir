import { Briefcase } from "@phosphor-icons/react/dist/ssr";
import { EmptyState } from "@kahade/ui";
import JobCard from "@/components/jobs/JobCard";
import type { JobPostingSummary } from "@/lib/api";

export default function JobList({ postings }: { postings: JobPostingSummary[] }) {
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
