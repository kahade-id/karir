"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { Alert, Button, Checkbox, FieldError, Input, Textarea } from "@kahade/ui";
import CvUpload, { type CvUploadState } from "@/components/apply/CvUpload";
import { useSubmission } from "@/components/apply/SubmissionStore";
import {
  ApiError,
  getCaptcha,
  submitApplication,
  type CaptchaChallenge,
  type JobPostingDetail,
} from "@/lib/api";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  cv?: string;
  portfolioUrl?: string;
  coverNote?: string;
  consent?: string;
  captcha?: string;
  submit?: string;
}

export default function ApplicationForm({ posting }: { posting: JobPostingDetail }) {
  const router = useRouter();
  const { setResult } = useSubmission();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — hidden
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [cv, setCv] = useState<CvUploadState>({ fileKey: null, fileName: null });
  const [cvError, setCvError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const submitErrorRef = useRef<HTMLDivElement>(null);

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    setCaptchaAnswer("");
    try {
      setCaptcha(await getCaptcha());
    } catch {
      setCaptcha(null);
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    void loadCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    // Samakan dengan backend: @MinLength(3) untuk nama, @Matches(/^\+?[0-9]{9,16}$/) untuk HP
    if (fullName.trim().length < 3)
      e.fullName = "Isi nama lengkap kamu (minimal 3 karakter).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Alamat email tidak valid.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 16)
      e.phone = "Nomor HP harus 9–16 digit.";
    if (!cv.fileKey) e.cv = cvError ?? "Unggah CV kamu (PDF, maksimal 5 MB).";
    if (portfolioUrl.trim() && !/^https?:\/\/.+\..+/.test(portfolioUrl.trim()))
      e.portfolioUrl = "URL portofolio harus diawali http:// atau https://.";
    if (coverNote.length > 2000)
      e.coverNote = "Cover note maksimal 2000 karakter.";
    if (!consent)
      e.consent =
        "Centang persetujuan dulu untuk melanjutkan.";
    if (captchaAnswer.trim().length === 0)
      e.captcha = "Isi jawaban verifikasi di atas.";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting) return;

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      const result = await submitApplication({
        postingId: posting.id,
        fullName: fullName.trim(),
        email: email.trim(),
        // Normalisasi: backend hanya terima digit (opsional + di depan).
        // Spasi/strip/tanda kurung dari input pengguna harus dibuang.
        phone: phone.trim().startsWith("+")
          ? "+" + phone.replace(/\D/g, "")
          : phone.replace(/\D/g, ""),
        coverNote: coverNote.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        cvFileKey: cv.fileKey as string,
        website: website || undefined, // honeypot
        captchaId: captcha?.challengeId ?? "",
        captchaAnswer: captchaAnswer.trim(),
      });
      setResult({ deletionToken: result.deletionToken });
      router.push("/sukses");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ submit: err.message });
      } else {
        setErrors({ submit: "Terjadi kesalahan. Silakan coba lagi." });
      }
      void loadCaptcha(); // soal baru setelah gagal
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Pindahkan fokus ke pesan error agar terbaca screen reader
      requestAnimationFrame(() => submitErrorRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.submit && (
        <div ref={submitErrorRef} tabIndex={-1} className="outline-none">
          <Alert variant="danger">{errors.submit}</Alert>
        </div>
      )}

      <Input
        id="fullName"
        label="Nama lengkap"
        required
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Nama kamu"
        autoComplete="name"
        error={errors.fullName}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="email"
          label="Email"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          autoComplete="email"
          error={errors.email}
        />
        <Input
          id="phone"
          label="Nomor HP"
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0812xxxxxxx"
          autoComplete="tel"
          error={errors.phone}
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-black">
          CV (PDF) <span className="text-red-600"> *</span>
        </span>
        <CvUpload
          onChange={(s) => {
            setCv(s);
            if (s.fileKey) setCvError(null);
          }}
          onError={setCvError}
          disabled={submitting}
        />
        {(errors.cv ?? cvError) && (
          <FieldError>{errors.cv ?? cvError}</FieldError>
        )}
      </div>

      <Input
        id="portfolio"
        label="Portofolio"
        hint="Opsional"
        type="url"
        value={portfolioUrl}
        onChange={(e) => setPortfolioUrl(e.target.value)}
        placeholder="https://…"
        error={errors.portfolioUrl}
      />

      <div>
        <Textarea
          id="coverNote"
          label="Cover note"
          hint="Opsional, maks 2000 karakter"
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Ceritakan singkat kenapa kamu cocok untuk posisi ini…"
          error={errors.coverNote}
        />
        <p className="mt-1.5 text-right text-xs text-neutral-500">
          {coverNote.length}/2000
        </p>
      </div>

      {/* Honeypot anti-bot — disembunyikan dari manusia */}
      <div aria-hidden="true" className="hidden" tabIndex={-1}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-black">
          Verifikasi <span className="text-red-600"> *</span>
        </span>
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          {captchaLoading ? (
            <p className="text-sm text-neutral-500">Memuat soal verifikasi…</p>
          ) : captcha ? (
            <>
              <p className="text-sm font-medium text-black">{captcha.question}</p>
              <div className="mt-3 flex gap-2">
                <Input
                  type="text"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Jawaban"
                  autoComplete="off"
                  aria-label="Jawaban verifikasi"
                  error={errors.captcha}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void loadCaptcha()}
                  aria-label="Muat soal baru"
                  title="Soal baru"
                  leftIcon={ArrowsClockwise}
                  className="shrink-0 self-center px-3"
                >
                  {""}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-neutral-500">
                Soal verifikasi gagal dimuat.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => void loadCaptcha()}
              >
                Coba lagi
              </Button>
            </div>
          )}
        </div>
      </div>

      <Checkbox
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        error={errors.consent}
        label={
          <span>
            Saya memahami skema kompensasi{" "}
            <strong className="text-black">tanpa gaji</strong> dengan{" "}
            <strong className="text-black">saham/equity</strong> dan kebijakan
            retensi data lamaran{" "}
            <strong className="text-black">90 hari</strong> setelah keputusan.{" "}
            <span className="text-red-600">*</span>
          </span>
        }
      />

      <Button type="submit" loading={submitting} className="w-full">
        {submitting ? "Mengirim lamaran…" : "Kirim lamaran"}
      </Button>
    </form>
  );
}
