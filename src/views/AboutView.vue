<script setup>
import { RouterLink } from 'vue-router'

const values = [
  {
    title: 'Keberlanjutan Pangan Lokal',
    desc: 'Kami bermitra dengan pasar tradisional dan petani lokal untuk memastikan rantai pasok bahan segar yang adil dan berkesinambungan.',
  },
  {
    title: 'Ketulusan Resep Tradisional',
    desc: 'Setiap bumbu diracik mengikuti pakem masakan tradisional nusantara. Tidak ada kompromi jalan pintas untuk rasa otentik.',
  },
  {
    title: 'Kenyamanan yang Sampai ke Rumah',
    desc: 'Kami percaya momen santap di rumah adalah saat berharga. Makanan kami hadir untuk memberi kehangatan di tengah hari-harimu.',
  },
]
</script>

<template>
  <div class="page-container about-page">
    <div class="page-header text-center">
      <h1>Tentang Wareg</h1>
      <p class="page-subtitle">
        Lahir dari kerinduan akan masakan rumah yang hangat, dimasak dari bahan jujur, dan dinikmati bersama orang-orang tercinta.
      </p>
    </div>

    <!-- Main Story Split -->
    <div class="about-hero-split">
      <div class="about-hero-image">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
          alt="Dapur dan tim koki Wareg menyiapkan makanan segar"
        />
        <div class="about-image-caption">
          <span>Dapur Mitra Wareg • Jakarta & Sekitarnya</span>
        </div>
      </div>

      <div class="about-hero-story">
        <h2>Menghubungkan Meja Makan dengan Dapur Terbaik</h2>
        <p class="lead-para">
          Di tengah hiruk pikuk kehidupan kota yang serba cepat, seringkali kita kehilangan rasa hangat dari masakan rumahan yang dimasak perlahan dengan rasa kasih.
        </p>
        <p>
          Wareg dibangun untuk menjadi jembatan antara kamu dengan para juru masak dan dapur lokal pilihan. Kami tidak membuat makanan cepat saji massal; kami mengurasi hidangan berkualitas yang dibuat oleh orang-orang yang mencintai masakannya.
        </p>
        <p>
          Dari racikan Nasi Goreng Kampung dengan telur setengah matang hingga kuah Soto Lamongan yang kaya koya gurih, setiap resep disajikan apa adanya: jujur, kaya rempah, dan menenangkan.
        </p>
      </div>
    </div>

    <!-- Value Cards -->
    <section class="about-values-section">
      <div class="values-header">
        <h2>Prinsip yang Kami Pegang</h2>
        <p>Tiga komitmen yang selalu kami jaga di setiap porsi yang keluar dari dapur.</p>
      </div>

      <div class="values-grid">
        <article
          v-for="val in values"
          :key="val.title"
          class="value-card"
        >
          <h3 class="value-title">{{ val.title }}</h3>
          <p class="value-desc">{{ val.desc }}</p>
        </article>
      </div>
    </section>

    <!-- Call to action -->
    <div class="page-cta-banner">
      <h2>Mari Mencicipi Kehangatan Rasa</h2>
      <p>Coba menu pilihan kami hari ini dan rasakan bedanya.</p>
      <RouterLink to="/menu" class="primary-button">
        <span>Eksplorasi Menu</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
