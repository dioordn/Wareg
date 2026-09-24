<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const activeFaq = ref(null)

function toggleFaq(index) {
  activeFaq.value = activeFaq.value === index ? null : index
}

const steps = [
  {
    step: '01',
    title: 'Pilih Hidangan',
    desc: 'Buka katalog menu kami, temukan makanan dan minuman kesukaanmu. Kamu bisa menambahkan catatan khusus pada pesanan bila ada permintaan alergi atau tingkat kepedasan.',
    points: ['Pilihan makanan lokal otentik', 'Transparan tanpa biaya tersembunyi', 'Mudah disesuaikan selera'],
  },
  {
    step: '02',
    title: 'Dimasak Segar di Dapur',
    desc: 'Kami meneruskan pesananmu langsung ke dapur mitra terpilih. Setiap menu dimasak saat dipesan, bukan makanan sisa atau olahan cepat saji yang dipanaskan ulang.',
    points: ['Bahan segar setiap hari', 'Standar kebersihan terverifikasi', 'Dimasak oleh juru masak lokal'],
  },
  {
    step: '03',
    title: 'Pengantaran Cepat & Hangat',
    desc: 'Kurir kami mengambil pesanan dengan tas berinsulasi termal untuk menjaga suhu makanan. Makanan tiba di depan pintumu dalam kondisi tetap hangat dan nikmat.',
    points: ['Tas insulasi termal khusus', 'Segel kebersihan tertutup rapat', 'Estimasi 20–30 menit sampai'],
  },
]

const faqs = [
  {
    q: 'Berapa rata-rata waktu yang dibutuhkan sampai pesanan tiba?',
    a: 'Rata-rata waktu pengantaran berkisar antara 20 hingga 30 menit, tergantung jarak dari dapur mitra ke lokasimu.',
  },
  {
    q: 'Bagaimana Wareg memastikan makanan tetap hangat?',
    a: 'Kami menggunakan wadah makanan food-grade tahan panas dan tas pengantar berinsulasi khusus yang mengunci uap hangat sampai ke tanganmu.',
  },
  {
    q: 'Metode pembayaran apa saja yang didukung?',
    a: 'Kami menerima pembayaran melalui QRIS (GoPay, OVO, ShopeePay, Dana), Transfer Virtual Account Bank (BCA, Mandiri, BRI, BNI), serta Kartu Debit.',
  },
  {
    q: 'Apakah saya bisa memesan untuk jam pengantaran tertentu?',
    a: 'Tentu bisa! Kamu dapat menentukan jadwal pengantaran di muka pada saat melakukan pemesanan.',
  },
  {
    q: 'Bagaimana jika pesanan saya tidak sesuai atau mengalami kendala?',
    a: 'Layanan pelanggan kami siap membantu untuk penggantian menu langsung atau pengembalian dana 100% tanpa proses berbelit.',
  },
]
</script>

<template>
  <div class="page-container how-it-works-page">
    <div class="page-header text-center">
      <h1>Cara Kerja Wareg</h1>
      <p class="page-subtitle">
        Proses pemesanan transparan dan mudah, dirancang agar makanan terbaik sampai ke mejamu tanpa rasa khawatir.
      </p>
    </div>

    <!-- Step by Step Cards -->
    <div class="how-steps-list">
      <article
        v-for="s in steps"
        :key="s.title"
        class="how-step-item"
      >
        <div class="step-main-content">
          <h2>{{ s.title }}</h2>
          <p class="step-text">{{ s.desc }}</p>
          <ul class="step-point-list">
            <li v-for="point in s.points" :key="point">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{{ point }}</span>
            </li>
          </ul>
        </div>
      </article>
    </div>

    <!-- FAQ Dropdown / Accordion Section -->
    <section class="how-faq-section">
      <div class="faq-header">
        <h2>Pertanyaan yang Sering Diajukan</h2>
        <p>Klik pertanyaan di bawah untuk melihat rincian informasi.</p>
      </div>

      <div class="faq-accordion">
        <div
          v-for="(f, idx) in faqs"
          :key="f.q"
          class="faq-accordion-item"
          :class="{ open: activeFaq === idx }"
        >
          <button
            class="faq-question-btn"
            :aria-expanded="activeFaq === idx"
            @click="toggleFaq(idx)"
          >
            <span class="faq-question-text">{{ f.q }}</span>
            <span class="faq-icon-indicator">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </button>

          <div v-show="activeFaq === idx" class="faq-answer-pane">
            <p>{{ f.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA banner -->
    <div class="page-cta-banner">
      <h2>Siap Menikmati Makanan Hangat?</h2>
      <p>Jelajahi berbagai hidangan nusantara pilihan kami hari ini.</p>
      <RouterLink to="/menu" class="primary-button">
        <span>Buka Menu Sekarang</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
