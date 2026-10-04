import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Badge, Card, Icon } from "@kahade/ui";
import type { JobPostingSummary } from "@/lib/api";

export default function JobCard({ posting }: { posting: JobPostingSummary }) {
  return (
    <Link
      href={`/lowongan/${posting.slug}`}
      className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <Card interactive className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-black">
              {posting.title}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              {posting.location} · {posting.type}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-black">
            Detail
            <Icon
              icon={ArrowRight}
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {posting.summary}
        </p>
        <div className="mt-4">
          <Badge>{posting.equity}</Badge>
        </div>
      </Card>
    </Link>
  );
}
