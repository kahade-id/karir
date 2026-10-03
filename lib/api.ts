import { API_BASE_URL } from "@/lib/config";

export interface JobPostingSummary {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  equity: string;
  summary: string;
  publishedAt: string | null;
}

export interface JobPostingDetail extends JobPostingSummary {
  description: string;
  requirements: string[];
}

export interface CaptchaChallenge {
  challengeId: string;
  question: string;
}

export interface ApplicationResult {
  id: string;
  deletionToken: string;
}

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(status: number, code: string | undefined, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** Peta kode error backend → pesan Bahasa Indonesia untuk pelamar. */
const ERROR_MESSAGES: Record<string, string> = {
  POSTING_NOT_FOUND: "Lowongan tidak ditemukan atau sudah ditutup.",
  ALREADY_APPLIED: "Email ini sudah melamar posisi tersebut.",
  CV_EXPIRED:
    "File CV sudah kedaluwarsa. Silakan unggah ulang CV lalu kirim lagi.",
  CV_NOT_FOUND:
    "File CV tidak ditemukan. Silakan unggah ulang CV lalu kirim lagi.",
  MIME_TYPE_MISMATCH: "File harus berformat PDF.",
  FILE_TOO_LARGE: "Ukuran CV maksimal 5 MB.",
  BOT_DETECTED: "Verifikasi gagal. Silakan muat ulang halaman dan coba lagi.",
  VALIDATION_ERROR: "Periksa kembali data yang kamu isi.",
  CAPTCHA_INVALID: "Jawaban CAPTCHA salah. Silakan coba lagi.",
};

function messageFor(status: number, code?: string): string {
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  if (status === 404) return "Data tidak ditemukan.";
  if (status === 409) return "Data sudah pernah dikirim sebelumnya.";
  if (status === 429)
    return "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.";
  if (status >= 500)
    return "Layanan sedang bermasalah. Coba lagi beberapa saat lagi.";
  return "Terjadi kesalahan. Silakan coba lagi.";
}

async function parseError(res: Response): Promise<ApiError> {
  let code: string | undefined;
  try {
    const body: unknown = await res.json();
    if (
      body !== null &&
      typeof body === "object" &&
      "error" in body &&
      typeof (body as { error: unknown }).error === "string"
    ) {
      code = (body as { error: string }).error;
    }
  } catch {
    // abaikan — respons bukan JSON
  }
  return new ApiError(res.status, code, messageFor(res.status, code));
}

async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

export async function getPostings(): Promise<JobPostingSummary[]> {
  const data = await getJson<{ postings: JobPostingSummary[] }>(
    "/careers/postings?active=true"
  );
  return Array.isArray(data.postings) ? data.postings : [];
}

export async function getPosting(slug: string): Promise<JobPostingDetail> {
  return getJson<JobPostingDetail>(
    `/careers/postings/${encodeURIComponent(slug)}`
  );
}

export async function getCaptcha(): Promise<CaptchaChallenge> {
  return getJson<CaptchaChallenge>("/careers/captcha");
}

export interface SubmitApplicationPayload {
  postingId: string;
  fullName: string;
  email: string;
  phone: string;
  coverNote?: string;
  portfolioUrl?: string;
  cvFileKey: string;
  website?: string;
  captchaId: string;
  captchaAnswer: string;
}

export async function submitApplication(
  payload: SubmitApplicationPayload
): Promise<ApplicationResult> {
  return getJson<ApplicationResult>("/careers/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Upload CV PDF via XMLHttpRequest agar bisa menampilkan progress bar.
 * Backend menerima multipart field `file` dan menjawab { fileKey, expiresIn }.
 */
export function uploadCv(
  file: File,
  onProgress: (percent: number) => void
): Promise<{ fileKey: string; expiresIn: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}/careers/upload-cv`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as {
            fileKey: string;
            expiresIn: number;
          });
        } catch {
          reject(new ApiError(xhr.status, undefined, messageFor(xhr.status)));
        }
      } else {
        let code: string | undefined;
        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          if (typeof body.error === "string") code = body.error;
        } catch {
          // abaikan
        }
        reject(new ApiError(xhr.status, code, messageFor(xhr.status, code)));
      }
    };

    xhr.onerror = () =>
      reject(new ApiError(0, undefined, "Tidak bisa terhubung ke server."));

    const form = new FormData();
    form.append("file", file, file.name);
    xhr.send(form);
  });
}
