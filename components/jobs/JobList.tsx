import JobCard from "@/components/jobs/JobCard";
import type { JobPostingSummary } from "@/lib/api";

export default function JobList({ postings }: { postings: JobPostingSummary[] }) {
  if (postings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
        <p className="text-lg font-bold text-black">
          Belum ada lowongan terbuka
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
          Saat ini belum ada posisi yang dibuka. Cek kembali lain waktu — kami
          akan menambah posisi baru di sini.
        </p>
      </div>
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
