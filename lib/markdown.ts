/**
 * Renderer markdown minimal & aman: escape HTML dulu, lalu dukung
 * heading (##/###), bold, list (-/*), dan paragraf/baris baru.
 * Cukup untuk deskripsi lowongan tanpa dependensi tambahan.
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
  return escapeHtml(s).replace(
    /\*\*([^*]+)\*\*/g,
    "<strong>$1</strong>"
  );
}

export function renderMarkdown(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("### ")) {
      closeList();
      out.push(`<h4>${inline(line.slice(4))}</h4>`);
    } else if (line.startsWith("## ")) {
      closeList();
      out.push(`<h3>${inline(line.slice(3))}</h3>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
    } else if (line === "") {
      closeList();
    } else {
      closeList();
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  closeList();
  return out.join("");
}
