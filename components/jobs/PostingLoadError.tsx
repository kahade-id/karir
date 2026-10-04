import { Alert, buttonClasses } from "@kahade/ui";

/**
 * Panel error saat fetch detail lowongan gagal (bukan 404).
 * Dipakai /lowongan/[slug] dan /lamar/[slug].
 */
export default function PostingLoadError({ retryHref }: { retryHref: string }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Alert variant="danger" title="Gagal memuat data lowongan.">
        Periksa koneksi internetmu lalu coba lagi. Bila terus gagal, kembali
        ke daftar lowongan.
      </Alert>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        {/* <a> biasa agar full reload dan fetch server diulang. */}
        <a href={retryHref} className={buttonClasses("primary", "md")}>
          Coba lagi
        </a>
        <a href="/#lowongan" className={buttonClasses("secondary", "md")}>
          Lihat semua lowongan
        </a>
      </div>
    </div>
  );
}
