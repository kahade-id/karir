/**
 * Renderer markdown minimal & aman untuk deskripsi lowongan: escape HTML
 * dulu, lalu dukung heading (##/###), bold, list (-/*), dan paragraf.
 * Tanpa dependensi tambahan.
 *
 * Deskripsi dari API sering berupa teks polos hasil salin dokumen: judul
 * bagian ("Tentang peran", "Tanggung jawab", …) berdiri sebagai baris biasa
 * dan kalimat panjang terpotong di tengah (hard wrap). Renderer ini hanya
 * merapikan PRESENTASI — tidak ada kata yang ditambah atau dibuang:
 * - baris yang persis sama dengan judul bagian yang dikenal → <h2>;
 * - di bawah judul daftar (tanggung jawab, kualifikasi, …) tiap baris → <li>;
 * - baris lanjutan (huruf kecil di awal, atau baris sebelumnya berakhir
 *   dengan "/", "-", ",", "(") disambung ke baris sebelumnya.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  // bold **teks**
  return escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Judul bagian polos yang dikenal → mode isi di bawahnya. */
const PLAIN_HEADINGS: Record<string, "paragraph" | "list"> = {
  "tentang peran": "paragraph",
  "tentang posisi": "paragraph",
  "tanggung jawab": "list",
  kualifikasi: "list",
  persyaratan: "list",
  "skema kompensasi": "list",
  "skema kompensasi (transparan)": "list",
  "yang kami tawarkan": "list",
};

/** Satukan potongan baris yang terbungkus paksa. */
function joinWrapped(prev: string, next: string): string {
  // "K-" + "pop" → "K-pop" (tanda hubung menempel huruf, tanpa spasi).
  if (/\p{L}-$/u.test(prev)) return prev + next;
  return `${prev} ${next}`;
}

function isContinuation(prev: string, line: string): boolean {
  if (/^\p{Ll}/u.test(line)) return true;
  return /[\/,(\-–]$/.test(prev);
}

export function renderMarkdown(src: string): string {
  const lines = src.split("\n").map((l) => l.trim());
  const out: string[] = [];
  let mode: "paragraph" | "list" = "paragraph";
  let para: string | null = null;
  let items: string[] | null = null;

  const flushPara = () => {
    if (para !== null) {
      out.push(`<p>${inline(para)}</p>`);
      para = null;
    }
  };
  const flushList = () => {
    if (items !== null) {
      out.push(`<ul>${items.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`);
      items = null;
    }
  };
  const flush = () => {
    flushPara();
    flushList();
  };

  for (const line of lines) {
    if (line === "") {
      flush();
      continue;
    }

    // Markdown eksplisit.
    if (line.startsWith("### ")) {
      flush();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
      mode = "paragraph";
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
      mode = "paragraph";
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushPara();
      items = items ?? [];
      items.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Judul bagian polos.
    const heading = PLAIN_HEADINGS[line.toLowerCase()];
    if (heading) {
      flush();
      out.push(`<h2>${inline(line)}</h2>`);
      mode = heading;
      continue;
    }

    if (items !== null && items.length > 0) {
      const last = items[items.length - 1];
      if (isContinuation(last, line)) {
        items[items.length - 1] = joinWrapped(last, line);
        continue;
      }
      if (mode === "list") {
        items.push(line);
        continue;
      }
      flushList();
    }

    if (mode === "list") {
      flushPara();
      items = [line];
      continue;
    }

    // Mode paragraf: baris berurutan = satu paragraf.
    para = para === null ? line : joinWrapped(para, line);
  }
  flush();
  return out.join("");
}

/**
 * Rapikan daftar persyaratan dari API: hapus awalan "- ", sambungkan item
 * yang terpotong ke baris berikutnya, dan pisahkan dua item yang tergabung
 * dalam satu baris (" - " diikuti huruf kapital). Isi teks tidak diubah.
 */
export function cleanList(raw: string[]): string[] {
  const lines = raw.map((l) => l.trim()).filter(Boolean);
  const dashed = lines.some((l) => /^[-*•]\s+/.test(l));
  const items: string[] = [];
  for (const line of lines) {
    const isItem = /^[-*•]\s+/.test(line);
    const text = line.replace(/^[-*•]\s+/, "");
    const last = items[items.length - 1];
    const continues =
      last !== undefined &&
      ((dashed && !isItem) || (!isItem && /^\p{Ll}/u.test(text)));
    if (continues) items[items.length - 1] = joinWrapped(last, text);
    else items.push(text);
  }
  return items.flatMap((item) =>
    item
      .split(/\s+-\s+(?=\p{Lu})/u)
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

/** Ringkasan satu baris (API kadang menyisipkan baris baru di tengah kalimat). */
export function oneLine(s: string): string {
  return s.replace(/\s*\n\s*/g, " ").trim();
}

/** Tanggal publikasi → "4 Oktober 2026" (WIB). */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(d);
}

/** Bagian berjudul + daftar (mis. "Persyaratan") sebagai HTML ter-escape. */
export function renderListSection(title: string, items: string[]): string {
  if (items.length === 0) return "";
  return `<h2>${escapeHtml(title)}</h2><ul>${items
    .map((i) => `<li>${inline(i)}</li>`)
    .join("")}</ul>`;
}
