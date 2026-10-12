import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Container, PageHeader } from "@kahade/ui";
import EquityNotice from "@/components/site/EquityNotice";
import ApplicationForm from "@/components/apply/ApplicationForm";
import PostingLoadError from "@/components/jobs/PostingLoadError";
import {
  ApiError,
  getPosting,
  getPostings,
  type JobPostingDetail,
} from "@/lib/api";

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
        <div className="max-w-narrow">
          <EquityNotice />
          <div className="mt-12">
            <ApplicationForm posting={posting} />
          </div>
        </div>
      </Container>
    </>
  );
}
