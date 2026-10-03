"use client";

import { useRef, useState } from "react";
import { FilePdf, UploadSimple, XCircle } from "@phosphor-icons/react/dist/ssr";
import { uploadCv, ApiError } from "@/lib/api";

const MAX_BYTES = 5 * 1024 * 1024;

export interface CvUploadState {
  fileKey: string | null;
  fileName: string | null;
}

interface Props {
  onChange: (state: CvUploadState) => void;
  onError: (message: string | null) => void;
  disabled?: boolean;
}

type Status = "idle" | "uploading" | "done";

export default function CvUpload({ onChange, onError, disabled }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startUpload = async (file: File) => {
    onError(null);

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      onError("File harus berformat PDF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      onError("Ukuran CV maksimal 5 MB.");
      return;
    }

    setStatus("uploading");
    setProgress(0);
    setFileName(file.name);
    try {
      const { fileKey } = await uploadCv(file, setProgress);
      setStatus("done");
      onChange({ fileKey, fileName: file.name });
    } catch (e) {
      setStatus("idle");
      setFileName(null);
      onChange({ fileKey: null, fileName: null });
      if (e instanceof ApiError) onError(e.message);
      else onError("Gagal mengunggah CV. Coba lagi.");
    }
  };

  const reset = () => {
    setStatus("idle");
    setProgress(0);
    setFileName(null);
    onChange({ fileKey: null, fileName: null });
    onError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        disabled={disabled || status === "uploading"}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void startUpload(f);
        }}
        className="sr-only"
        id="cv-upload"
        aria-label="Unggah CV (PDF, maksimal 5 MB)"
      />

      {status === "idle" && (
        <label
          htmlFor="cv-upload"
          className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-6 transition hover:border-neutral-500 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <UploadSimple size={24} weight="duotone" className="text-black" aria-hidden />
          <span className="text-sm">
            <span className="font-semibold text-black">Pilih file CV</span>
            <span className="block text-neutral-500">
              PDF, maksimal 5 MB
            </span>
          </span>
        </label>
      )}

      {status === "uploading" && (
        <div className="rounded-2xl border border-neutral-200 bg-white px-5 py-5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium text-black">{fileName}</span>
            <span className="shrink-0 font-semibold text-black">{progress}%</span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress unggah CV"
          >
            <div
              className="h-full rounded-full bg-black transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-neutral-500">Mengunggah CV…</p>
        </div>
      )}

      {status === "done" && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <FilePdf size={24} weight="fill" className="shrink-0 text-black" aria-hidden />
            <span className="truncate text-sm font-medium text-black">
              {fileName}
            </span>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={disabled}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-neutral-500 hover:text-black disabled:opacity-50"
          >
            <XCircle size={18} aria-hidden /> Ganti
          </button>
        </div>
      )}
    </div>
  );
}
