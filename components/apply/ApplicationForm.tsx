"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr";
import CvUpload, { type CvUploadState } from "@/components/apply/CvUpload";
import { useSubmission } from "@/components/apply/SubmissionStore";
import {
  ApiError,
  getCaptcha,
  submitApplication,
  type CaptchaChallenge,
  type JobPostingDetail,
} from "@/lib/api";

const inputCls =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-400 outline-none transition focus:border-black";

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
    if (fullName.trim().length < 2)
      e.fullName = "Isi nama lengkap kamu.";
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
        phone: phone.trim(),
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
    } finally {
      setSubmitting(false);
    }
  };

  const errText = (msg?: string) =>
    msg ? <p className="mt-1.5 text-xs text-red-600">{msg}</p> : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.submit && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {errors.submit}
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-black">
          Nama lengkap *
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nama kamu"
          autoComplete="name"
          className={inputCls}
        />
        {errText(errors.fullName)}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-black">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            className={inputCls}
          />
          {errText(errors.email)}
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-black">
            Nomor HP *
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812xxxxxxx"
            autoComplete="tel"
            className={inputCls}
          />
          {errText(errors.phone)}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-black">
          CV (PDF) *
        </span>
        <CvUpload
          onChange={(s) => {
            setCv(s);
            if (s.fileKey) setCvError(null);
          }}
          onError={setCvError}
          disabled={submitting}
        />
        {errText(errors.cv)}
        {cvError && !errors.cv && errText(cvError)}
      </div>

      <div>
        <label htmlFor="portfolio" className="mb-1.5 block text-sm font-semibold text-black">
          Portofolio <span className="font-normal text-neutral-500">(opsional)</span>
        </label>
        <input
          id="portfolio"
          type="url"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          placeholder="https://…"
          className={inputCls}
        />
        {errText(errors.portfolioUrl)}
      </div>

      <div>
        <label htmlFor="coverNote" className="mb-1.5 block text-sm font-semibold text-black">
          Cover note <span className="font-normal text-neutral-500">(opsional, maks 2000 karakter)</span>
        </label>
        <textarea
          id="coverNote"
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Ceritakan singkat kenapa kamu cocok untuk posisi ini…"
          className={`${inputCls} resize-y`}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <div>{errText(errors.coverNote)}</div>
          <span className="text-xs text-neutral-400">
            {coverNote.length}/2000
          </span>
        </div>
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
          Verifikasi *
        </span>
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          {captchaLoading ? (
            <p className="text-sm text-neutral-500">Memuat soal verifikasi…</p>
          ) : captcha ? (
            <>
              <p className="text-sm font-medium text-black">{captcha.question}</p>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Jawaban"
                  autoComplete="off"
                  className={inputCls}
                  aria-label="Jawaban verifikasi"
                />
                <button
                  type="button"
                  onClick={() => void loadCaptcha()}
                  className="shrink-0 rounded-xl border border-neutral-300 bg-white px-3 text-neutral-600 transition hover:text-black"
                  aria-label="Muat soal baru"
                  title="Soal baru"
                >
                  <ArrowsClockwise size={18} aria-hidden />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-neutral-500">
                Soal verifikasi gagal dimuat.
              </p>
              <button
                type="button"
                onClick={() => void loadCaptcha()}
                className="shrink-0 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                Coba lagi
              </button>
            </div>
          )}
        </div>
        {errText(errors.captcha)}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-black"
          />
          <span className="text-sm leading-relaxed text-neutral-700">
            Saya memahami skema kompensasi <strong className="text-black">tanpa
            gaji</strong> dengan <strong className="text-black">saham/equity</strong> dan
            kebijakan retensi data lamaran <strong className="text-black">90
            hari</strong> setelah keputusan. *
          </span>
        </label>
        {errText(errors.consent)}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Mengirim lamaran…" : "Kirim lamaran"}
      </button>
    </form>
  );
}
