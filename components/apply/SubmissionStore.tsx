"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface SubmissionResult {
  /** token mentah — hanya hidup di memori sesi ini, tidak pernah di URL */
  deletionToken: string;
}

/**
 * Menyimpan hasil submit antar-halaman TANPA query param (token tidak boleh
 * masuk history/analytics). Refresh langsung → context kosong → pesan umum.
 */
const SubmissionContext = createContext<{
  result: SubmissionResult | null;
  setResult: (r: SubmissionResult | null) => void;
}>({ result: null, setResult: () => {} });

export function SubmissionProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const value = useMemo(() => ({ result, setResult }), [result]);
  return (
    <SubmissionContext.Provider value={value}>
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmission() {
  return useContext(SubmissionContext);
}
