import { Info } from "@phosphor-icons/react/dist/ssr";

/**
 * Banner skema kompensasi tim awal — WAJIB tampil di /, /lowongan/[slug], /lamar/[slug].
 * Copy dari SPEC §6.1.
 */
export default function EquityNotice() {
  return (
    <section
      aria-label="Skema kompensasi tim awal"
      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
    >
      <div className="flex items-start gap-3">
        <Info
          size={22}
          weight="fill"
          className="mt-0.5 shrink-0 text-black"
          aria-hidden
        />
        <div className="text-sm leading-relaxed text-neutral-700">
          <p className="text-base font-bold text-black">
            Skema tim awal: tanpa gaji, dengan saham.
          </p>
          <p className="mt-2">
            Kahade dibangun oleh tim awal tanpa gaji. Sebagai gantinya, kamu
            mendapatkan <strong className="text-black">saham/equity PT Kawal Hak
            Dengan Aman</strong> dengan skema vesting yang transparan. Besaran
            saham tiap posisi tercantum jelas di setiap lowongan.
          </p>
          <p className="mt-2">
            Detail vesting, trigger gaji, dan dokumen legal dibahas terbuka
            sebelum kamu menandatangani apapun — tidak ada yang disembunyikan.
          </p>
        </div>
      </div>
    </section>
  );
}
