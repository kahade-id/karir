import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Card, Container, PageHeader, Prose } from "@kahade/ui";
import EquityNotice from "@/components/site/EquityNotice";
import PostingLoadError from "@/components/jobs/PostingLoadError";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  ApiError,
  getPosting,
  getPostings,
  type JobPostingDetail,
} from "@/lib/api";
import {
  cleanList,
  formatDate,
  oneLine,
  renderListSection,
  renderMarkdown,
} from "@/lib/markdown";

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
  const ogDescription = `Lowongan kerja startup di Kahade untuk posisi ${posting.title}. ${posting.summary}`;
  return {
    title: posting.title,
    description: ogDescription,
    alternates: { canonical: `/lowongan/${posting.slug}` },
    // WAJIB eksplisit: layout sudah men-set openGraph.title/description ke
    // homepage, dan merge metadata Next.js TIDAK menimpa field openGraph.*
    // dengan title/description halaman — tanpa ini og:title/og:description
    // (beserta turunan twitter:*) duplikat homepage di semua halaman lowongan.
    // og:image unik per lowongan berasal dari ./opengraph-image.tsx.
    openGraph: {
      title: posting.title,
      description: ogDescription,
      url: `/lowongan/${posting.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: posting.title,
      description: ogDescription,
    },
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

  const published = formatDate(posting.publishedAt);
  const applyHref = `/lamar/${posting.slug}`;
  const html =
    renderMarkdown(posting.description) +
    renderListSection("Persyaratan", cleanList(posting.requirements));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

      <PageHeader
        breadcrumb={
          <Breadcrumb
            items={[
              { label: "Karir", href: "/" },
              { label: "Lowongan", href: "/#lowongan" },
              { label: posting.title },
            ]}
          />
        }
        title={posting.title}
        lede={oneLine(posting.summary)}
        meta={[
          { label: "Lokasi", value: posting.location },
          { label: "Tipe kerja", value: posting.type },
          { label: "Kompensasi", value: posting.equity },
          ...(published ? [{ label: "Dipublikasikan", value: published }] : []),
        ]}
      />

      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-8">
            <Prose
              as="article"
              aria-label={`Deskripsi posisi ${posting.title}`}
              className="max-w-reading"
              dangerouslySetInnerHTML={{ __html: html }}
            >
              {null}
            </Prose>
            <EquityNotice className="mt-14 max-w-reading" />
          </div>

          {/* Panel lamar menempel (desktop). */}
          <aside aria-label="Lamar posisi ini" className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <Card className="p-6 xl:p-7">
                <h2 className="text-h4 text-fg">Tertarik membangun Kahade bareng kami?</h2>
                <dl className="mt-5 border-t border-line">
                  {[
                    { label: "Posisi", value: posting.title },
                    { label: "Kompensasi", value: posting.equity },
                    { label: "Tipe kerja", value: posting.type },
                    { label: "Lokasi", value: posting.location },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 border-b border-line py-3"
                    >
                      <dt className="shrink-0 text-caption text-fg-subtle">{row.label}</dt>
                      <dd className="text-right text-small font-semibold text-fg">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <LinkButton href={applyHref} size="lg" icon="arrow-right" className="mt-6 w-full">
                  Lamar posisi ini
                </LinkButton>
                <p className="mt-3 text-center text-caption text-fg-muted">
                  Isi formulir lamaran — butuh beberapa menit saja.
                </p>
              </Card>
            </div>
          </aside>
        </div>
      </Container>

      {/* Bar lamar menempel di bawah (seluler) — berhenti sebelum footer. */}
      <div className="sticky bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/80 lg:hidden">
        <Container className="flex items-center justify-between gap-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="min-w-0">
            <p className="truncate text-small font-semibold text-fg">{posting.title}</p>
            <p className="truncate text-caption text-fg-muted">{posting.equity}</p>
          </div>
          <LinkButton href={applyHref} className="shrink-0">
            Lamar posisi ini
          </LinkButton>
        </Container>
      </div>
    </div>
  );
}
