import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /sukses: halaman konfirmasi pasca-submit (tak perlu diindeks).
      // /hapus-lamaran: sensitif — memakai token penghapusan di URL; sudah
      // noindex di halaman, blokir juga di robots sebagai pertahanan lapis dua.
      disallow: ["/sukses", "/hapus-lamaran"],
    },
    sitemap: "https://karir.kahade.id/sitemap.xml",
  };
}
