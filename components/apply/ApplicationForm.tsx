"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import {
  Alert,
  Button,
  Checkbox,
  FieldError,
  IconButton,
  Input,
  Textarea,
} from "@kahade/ui";
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

/** Kelompok field: nomor + judul kecil di atas hairline. */
function FormSection({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0 border-t border-line pt-6 sm:pt-8">
      <legend className="float-left w-full">
        <span className="flex items-baseline gap-3 text-h4 text-fg">
          <span className="text-small font-normal tabular-nums text-fg-subtle">{index}</span>
          {title}
        </span>
      </legend>
      {description && (
        <p className="clear-left pt-1.5 text-small text-fg-muted">{description}</p>
      )}
      <div className="clear-left space-y-6 pt-6">{children}</div>
    </fieldset>
  );
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
    if (captchaLoading)
      e.captcha = "Soal verifikasi masih dimuat — tunggu sebentar lalu coba lagi.";
    else if (!captcha)
      e.captcha =
        "Soal verifikasi gagal dimuat. Tekan “Coba lagi” di atas untuk memuat soal baru.";
    else if (captchaAnswer.trim().length === 0)
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
      // Tanpa animasi scroll bila user meminta reduced motion.
      const reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      // Pindahkan fokus ke pesan error agar terbaca screen reader
      requestAnimationFrame(() => submitErrorRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  };

  const cvMessage = errors.cv ?? cvError ?? undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10 sm:space-y-12">
      {errors.submit && (
        <div ref={submitErrorRef} tabIndex={-1} className="outline-none">
          <Alert variant="danger">{errors.submit}</Alert>
        </div>
      )}

      <FormSection
        index="01"
        title="Data diri"
        description="Kami menghubungimu lewat email atau nomor HP ini bila kamu lolos ke tahap berikutnya."
      >
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

        <div className="grid gap-6 sm:grid-cols-2">
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
      </FormSection>

      <FormSection index="02" title="CV & portofolio">
        <CvUpload
          onChange={(s) => {
            setCv(s);
            if (s.fileKey) {
              setCvError(null);
              setErrors((prev) => ({ ...prev, cv: undefined }));
            }
          }}
          onError={setCvError}
          disabled={submitting}
          error={cvMessage}
        />

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

        <div className="relative">
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
          {/* Penghitung sejajar label (kanan atas). */}
          <p className="absolute top-0 right-0 text-caption leading-[1.3125rem] text-fg-subtle tabular-nums">
            {coverNote.length}/2000
          </p>
        </div>
      </FormSection>

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

      <FormSection index="03" title="Verifikasi & persetujuan">
        <div>
          <span className="mb-2 block text-small font-semibold text-fg">
            Verifikasi
            <span aria-hidden="true" className="text-critical">
              {" "}
              *
            </span>
          </span>
          <div className="rounded-control border border-line bg-surface-2 p-4 sm:p-5">
            {captchaLoading ? (
              <div>
                <p className="text-small text-fg-muted">Memuat soal verifikasi…</p>
                {errors.captcha && <FieldError>{errors.captcha}</FieldError>}
              </div>
            ) : captcha ? (
              <>
                <p className="text-small font-semibold text-fg">{captcha.question}</p>
                <div className="mt-3 flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      type="text"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder="Jawaban"
                      autoComplete="off"
                      aria-label="Jawaban verifikasi"
                      error={errors.captcha}
                    />
                  </div>
                  <IconButton
                    icon={ArrowsClockwise}
                    label="Muat soal baru"
                    onClick={() => void loadCaptcha()}
                    className="mt-0.5"
                  />
                </div>
              </>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-small text-fg-muted">Soal verifikasi gagal dimuat.</p>
                  <Button type="button" variant="secondary" onClick={() => void loadCaptcha()}>
                    Coba lagi
                  </Button>
                </div>
                {errors.captcha && <FieldError>{errors.captcha}</FieldError>}
              </div>
            )}
          </div>
        </div>

        <Checkbox
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          error={errors.consent}
          label={
            <span className="text-fg-2">
              Saya memahami skema kompensasi{" "}
              <strong className="font-semibold text-fg">tanpa gaji</strong> dengan{" "}
              <strong className="font-semibold text-fg">saham/equity</strong> dan kebijakan
              retensi data lamaran{" "}
              <strong className="font-semibold text-fg">90 hari</strong> setelah keputusan.
              <span aria-hidden="true" className="text-critical">
                {" "}
                *
              </span>
            </span>
          }
        />
      </FormSection>

      <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
          {submitting ? "Mengirim lamaran…" : "Kirim lamaran"}
        </Button>
        <p className="text-small text-fg-muted">
          Baca{" "}
          <Link
            href="/privasi-pelamar"
            className="font-semibold text-fg underline decoration-line-control underline-offset-4 hover:decoration-fg"
          >
            Kebijakan Privasi Pelamar
          </Link>
        </p>
      </div>
    </form>
  );
}
