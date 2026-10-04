import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@kahade/ui";
import EquityNotice from "@/components/site/EquityNotice";
import ApplicationForm from "@/components/apply/ApplicationForm";
import { getPosting, getPostings, type JobPostingDetail } from "@/lib/api";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const postings = await getPostings();
    return postings.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let posting: JobPostingDetail | null = null;
  try {
    posting = await getPosting(slug);
  } catch {
    posting = null;
  }
  if (!posting) {
    return { title: "Lamar — posisi tidak ditemukan" };
  }
  return {
    title: `Lamar: ${posting.title}`,
    description: `Kirim lamaran untuk posisi ${posting.title} di Kahade.`,
    alternates: { canonical: `/lamar/${posting.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function ApplyPage({ params }: PageProps) {
  const { slug } = await params;
  let posting: JobPostingDetail | null = null;
  try {
    posting = await getPosting(slug);
  } catch {
    posting = null;
  }
  if (!posting) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link
        href={`/lowongan/${posting.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded"
      >
        <Icon icon={ArrowLeft} size={16} /> Kembali ke detail lowongan
      </Link>

      <header className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
          Lamar: {posting.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {posting.location} · {posting.type} · {posting.equity}
        </p>
      </header>

      <div className="mt-6">
        <EquityNotice />
      </div>

      <div className="mt-8">
        <ApplicationForm posting={posting} />
      </div>
    </div>
  );
}
