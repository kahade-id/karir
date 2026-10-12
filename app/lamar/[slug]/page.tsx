import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, Card, Container, PageHeader } from "@kahade/ui";
import EquityNotice from "@/components/site/EquityNotice";
import ApplicationForm from "@/components/apply/ApplicationForm";
import PostingLoadError from "@/components/jobs/PostingLoadError";
import {
  ApiError,
  getPosting,
  getPostings,
  type JobPostingDetail,
} from "@/lib/api";
import { oneLine } from "@/lib/markdown";

/** Urutan bagian formulir — cermin `ApplicationForm` (01–03). */
const FORM_STEPS = ["Data diri", "CV & portofolio", "Verifikasi & persetujuan"];

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
      return { title: "Lamar — posisi tidak ditemukan" };
    }
    loadFailed = true;
  }
  if (loadFailed) {
    return { title: "Lamar — gagal memuat" };
  }
  if (!posting) {
    return { title: "Lamar — posisi tidak ditemukan" };
  }
  const pageTitle = `Lamar: ${posting.title}`;
  const ogDescription = `Kirim lamaran untuk posisi ${posting.title} di Kahade.`;
  return {
    title: pageTitle,
    description: ogDescription,
    alternates: { canonical: `/lamar/${posting.slug}` },
    robots: { index: false, follow: true },
    // Sama seperti /lowongan/[slug]: openGraph.* harus eksplisit agar tidak
    // duplikat homepage (layout men-set openGraph.title/description sendiri).
    openGraph: {
      title: pageTitle,
      description: ogDescription,
      url: `/lamar/${posting.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: ogDescription,
    },
  };
}

export default async function ApplyPage({ params }: PageProps) {
  const { slug } = await params;
  let posting: JobPostingDetail | null = null;
  let loadFailed = false;
  try {
    posting = await getPosting(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    loadFailed = true;
  }
  if (loadFailed) return <PostingLoadError retryHref={`/lamar/${slug}`} />;
  if (!posting) notFound();

  return (
    <>
      <PageHeader
        size="h2"
        breadcrumb={
          <Breadcrumb
            items={[
              { label: "Karir", href: "/" },
              { label: posting.title, href: `/lowongan/${posting.slug}` },
              { label: "Lamar" },
            ]}
          />
        }
        eyebrow="Formulir lamaran"
        title={`Lamar: ${posting.title}`}
        lede="Isi formulir lamaran — butuh beberapa menit saja."
        meta={[
          { label: "Lokasi", value: posting.location },
          { label: "Tipe kerja", value: posting.type },
          { label: "Kompensasi", value: posting.equity },
        ]}
      />

      <Container className="py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="max-w-narrow min-w-0 lg:col-span-7">
            <EquityNotice />
            <div className="mt-12">
              <ApplicationForm posting={posting} />
            </div>
          </div>

          {/* Ringkasan posisi menempel (desktop) — konteks tetap terlihat selama mengisi. */}
          <aside aria-label="Ringkasan posisi" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <div className="sticky top-28">
              <Card className="p-6 xl:p-7">
                <p className="text-caption text-fg-subtle">Kamu melamar sebagai</p>
                <h2 className="mt-1 text-h4 text-fg">{posting.title}</h2>
                <p className="mt-3 line-clamp-3 text-small text-fg-muted">{oneLine(posting.summary)}</p>
                <dl className="mt-5 border-t border-line">
                  {[
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
                <p className="mt-6 text-caption font-semibold text-fg">Isi formulir</p>
                <ol className="mt-3 space-y-2.5">
                  {FORM_STEPS.map((step, i) => (
                    <li key={step} className="flex items-center gap-3 text-small text-fg-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-[11px] font-semibold text-fg tabular-nums">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <Link
                  href={`/lowongan/${posting.slug}`}
                  className="mt-6 inline-flex min-h-11 items-center text-small font-semibold text-fg underline decoration-line-control underline-offset-4 transition-colors hover:decoration-fg"
                >
                  Lihat detail posisi
                </Link>
              </Card>
              <p className="mt-4 px-1 text-caption text-fg-muted">
                Lamaran yang tidak lolos dihapus otomatis maksimal 90 hari setelah keputusan.{" "}
                <Link href="/privasi-pelamar" className="font-semibold text-fg underline decoration-line-control underline-offset-4 hover:decoration-fg">
                  Privasi pelamar
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
