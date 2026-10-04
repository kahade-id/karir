import { Alert } from "@kahade/ui";

/**
 * Banner skema kompensasi tim awal — WAJIB tampil di /, /lowongan/[slug], /lamar/[slug].
 * Copy dari SPEC §6.1.
 */
export default function EquityNotice() {
  return (
    <Alert variant="info" title="Skema tim awal: tanpa gaji, dengan saham.">
      <p className="mt-1">
        Kahade dibangun oleh tim awal tanpa gaji. Sebagai gantinya, kamu
        mendapatkan <strong>saham/equity PT Kawal Hak Dengan Aman</strong>{" "}
        dengan skema vesting yang transparan. Besaran saham tiap posisi
        tercantum jelas di setiap lowongan.
      </p>
      <p className="mt-2">
        Detail vesting, trigger gaji, dan dokumen legal dibahas terbuka sebelum
        kamu menandatangani apapun — tidak ada yang disembunyikan.
      </p>
    </Alert>
  );
}
