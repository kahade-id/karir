import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "@phosphor-icons/react/dist/ssr";
import { Badge, ButtonLink, Icon } from "@kahade/ui";
import EquityNotice from "@/components/site/EquityNotice";
import PostingLoadError from "@/components/jobs/PostingLoadError";
import {
  ApiError,
  getPosting,
  getPostings,
  type JobPostingDetail,
} from "@/lib/api";
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
  let loadFailed = false;
  try {
    posting = await getPosting(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return { title: "Lowongan tidak ditemukan" };
    }
    loadFailed = true;
  }
  if (loadFailed) {
    return { title: "Gagal memuat lowongan" };
  }
  if (!posting) {
    return { title: "Lowongan tidak ditemukan" };
  }
  return {
    title: posting.title,
    description: `Lowongan kerja startup di Kahade untuk posisi ${posting.title}. ${posting.summary}`,
    alternates: { canonical: `/lowongan/${posting.slug}` },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let posting: JobPostingDetail | null = null;
  let loadFailed = false;
  try {
    posting = await getPosting(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    loadFailed = true;
  }
  if (loadFailed) return <PostingLoadError retryHref={`/lowongan/${slug}`} />;
  if (!posting) notFound();

  // JSON-LD schema.org/JobPosting — syarat tampil di Google for Jobs.
  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: posting.title,
    description: posting.summary,
    employmentType: posting.type,
    jobLocation: {
      "@type": "Place",
      address: posting.location,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: "PT Kawal Hak Dengan Aman",
      sameAs: "https://kahade.id",
    },
    ...(posting.publishedAt ? { datePosted: posting.publishedAt } : {}),
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <Link
        href="/#lowongan"
        className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-neutral-500 transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black rounded"
      >
        <Icon icon={ArrowLeft} size={16} /> Semua lowongan
      </Link>

      <header className="mt-6">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-black sm:text-4xl">
          {posting.title}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {posting.location} · {posting.type}
        </p>
        <div className="mt-4">
          <Badge variant="dark">{posting.equity}</Badge>
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
                <Icon
                  icon={Check}
                  size={18}
                  className="mt-0.5 shrink-0 text-black"
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
        <ButtonLink href={`/lamar/${posting.slug}`} size="lg" className="mt-5">
          Lamar posisi ini
        </ButtonLink>
      </div>
    </div>
  );
}
