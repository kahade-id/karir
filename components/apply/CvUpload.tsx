"use client";

import { useRef, useState } from "react";
import { FilePdf, XCircle } from "@phosphor-icons/react";
import { Button, FieldError, FileUpload, Icon, Progress } from "@kahade/ui";
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
  /** Pesan error yang ditampilkan di bawah/di dalam kontrol. */
  error?: string;
}

type Status = "idle" | "uploading" | "done";

function FieldLabel() {
  return (
    <span className="mb-2 block text-small font-semibold text-fg">
      CV (PDF)
      <span aria-hidden="true" className="text-critical">
        {" "}
        *
      </span>
    </span>
  );
}

export default function CvUpload({ onChange, onError, disabled, error }: Props) {
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

  if (status === "idle") {
    return (
      <FileUpload
        ref={inputRef}
        id="cv-upload"
        label="CV (PDF)"
        required
        accept="application/pdf,.pdf"
        hint="PDF, maksimal 5 MB"
        error={error}
        disabled={disabled}
        aria-label="Unggah CV (PDF, maksimal 5 MB)"
        onFiles={(files) => {
          const f = files[0];
          // Kosongkan agar memilih file yang sama lagi tetap memicu unggah.
          if (inputRef.current) inputRef.current.value = "";
          if (f) void startUpload(f);
        }}
      />
    );
  }

  return (
    <div>
      <FieldLabel />

      {status === "uploading" && (
        <div className="rounded-panel border border-line bg-surface px-5 py-5">
          <div className="flex items-center justify-between gap-3 text-small">
            <span className="truncate font-medium text-fg">{fileName}</span>
            <span className="shrink-0 font-semibold text-fg tabular-nums">{progress}%</span>
          </div>
          <Progress value={progress} aria-label="Progres unggah CV" className="mt-3" />
          <p aria-live="polite" className="mt-2 text-caption text-fg-muted">
            Mengunggah CV…
          </p>
        </div>
      )}

      {status === "done" && (
        <div className="flex items-center justify-between gap-3 rounded-panel border border-line bg-surface-2 py-3 pr-3 pl-5">
          <div className="flex min-w-0 items-center gap-3">
            <Icon icon={FilePdf} size={24} className="shrink-0 text-fg" />
            <span className="truncate text-small font-medium text-fg">{fileName}</span>
          </div>
          <Button
            type="button"
            variant="secondary"
            leftIcon={XCircle}
            onClick={reset}
            disabled={disabled}
            className="shrink-0"
          >
            Ganti
          </Button>
        </div>
      )}

      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
