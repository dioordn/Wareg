# Wareg — Cita Rasa Autentik Masakan Rumahan & Nusantara

Aplikasi web pemesanan dan eksplorasi masakan nusantara dengan kurasi resep rumahan autentik, dibangun menggunakan **Vue 3** dan **Vite**.

## Fitur Utama

- **Katalog Menu Lengkap**: Filter kategori (Semua, Sarapan, Makanan, Minuman, Cemilan), pencarian interaktif, sortir harga & rating, serta label hidangan populer.
- **Detail Hidangan Interaktif**: Informasi porsi, waktu penyajian, catatan rasa, dan rekomendasi menu pelengkap.
- **Keranjang Belanja (Cart Drawer)**: Tambah kuantitas, catatan khusus pesanan, ringkasan belanja, dan checkout instan.
- **Halaman Pembayaran (Checkout)**: Pilihan metode pembayaran modern (QRIS instan, Virtual Account Bank dengan tombol salin nomor VA, Bayar di Tempat/COD), detail pengiriman, dan layar konfirmasi bukti pesanan.
- **Pusat Notifikasi**: Popover notifikasi interaktif di navbar, badge unread count, serta halaman detail notifikasi lengkap.
- **Desain Responsif & Elegan**: Tipografi serif Playfair Display yang hangat, nuansa emerald green `#06715f`, transisi halus, dan mobile-friendly layout.

## Teknologi

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API & `<script setup>`)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Bundler / Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: Vanilla CSS modern dengan variabel CSS terstruktur

## Menjalankan Proyek Secara Lokal

1. Clone repositori:
   ```bash
   git clone https://github.com/dioordn/Wareg.git
   cd Wareg
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses di `http://localhost:5173`.

4. Build untuk produksi:
   ```bash
   npm run build
   ```
