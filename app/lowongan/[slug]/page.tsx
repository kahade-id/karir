import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "@phosphor-icons/react/dist/ssr";
import EquityNotice from "@/components/site/EquityNotice";
import { getPosting, getPostings, type JobPostingDetail } from "@/lib/api";
import { renderMarkdown } from "@/lib/markdown";

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
    return { title: "Lowongan tidak ditemukan" };
  }
  return {
    title: `${posting.title} — Lowongan`,
    description: posting.summary,
    alternates: { canonical: `/lowongan/${posting.slug}` },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let posting: JobPostingDetail | null = null;
  try {
    posting = await getPosting(slug);
  } catch {
    posting = null;
  }
  if (!posting) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href="/#lowongan"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-black"
      >
        <ArrowLeft size={16} aria-hidden /> Semua lowongan
      </Link>

      <header className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {posting.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {posting.location} · {posting.type}
        </p>
        <div className="mt-4">
          <span className="inline-block rounded-full bg-black px-4 py-1.5 text-sm font-bold text-white">
            {posting.equity}
          </span>
        </div>
      </header>

      <div className="mt-8">
        <EquityNotice />
      </div>

      <article
        className="prose-karir mt-10"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(posting.description) }}
      />

      {posting.requirements.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-black">
            Persyaratan
          </h2>
          <ul className="mt-4 space-y-2.5">
            {posting.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700">
                <Check
                  size={18}
                  weight="bold"
                  className="mt-0.5 shrink-0 text-black"
                  aria-hidden
                />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center sm:p-8">
        <p className="text-base font-bold text-black">
          Tertarik membangun Kahade bareng kami?
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          Isi formulir lamaran — butuh beberapa menit saja.
        </p>
        <Link
          href={`/lamar/${posting.slug}`}
          className="mt-5 inline-block rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800"
        >
          Lamar posisi ini
        </Link>
      </div>
    </div>
  );
}
