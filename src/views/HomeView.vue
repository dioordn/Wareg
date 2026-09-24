<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'

const router = useRouter()
const { foods, formatPrice, addToCart } = useCart()

// Highlight 3 featured items on the editorial home
const featuredFoods = foods.slice(0, 3)

const principles = [
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
  <div class="home-view">
    <!-- Editorial Hero Section -->
    <section class="home-hero">
      <div class="home-hero-grid">
        <div class="hero-editorial-wrap">
          <h1 class="hero-headline">
            Rasa yang<br />
            <span class="headline-green">mengingatkanmu</span><br />
            pada rumah.
          </h1>

          <div class="hero-lead-block">
            <p class="hero-lead-text">
              Wareg adalah ruang kurasi makanan rumahan dan nusantara.
              Dimasak dari rempah asli, diolah saat dipesan, dan diantar dalam keadaan selalu hangat.
            </p>

            <div class="hero-cta-group">
              <RouterLink to="/menu" class="primary-button">
                <span>Lihat Daftar Menu</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </RouterLink>

              <RouterLink to="/tentang" class="text-link-button">
                <span>Tentang Kami</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"/>
                  <polyline points="7 7 17 7 17 17"/>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="hero-image-wrap">
          <div class="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85"
              alt="Hidangan lezat Wareg dengan bahan segar nusantara"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Editorial Manifesto Section -->
    <section class="manifesto-section">
      <div class="manifesto-card">
        <blockquote class="manifesto-quote">
          “Makanan bukan sekadar kebutuhan santapan. Bagian terindah dari hidangan adalah bagaimana aromanya mampu mengembalikan ingatan kita ke meja makan rumah.”
        </blockquote>
        <div class="manifesto-author">
          <strong>Dapur Wareg</strong>
          <span>Dedikasi cita rasa autentik Indonesia</span>
        </div>
      </div>
    </section>

    <!-- Editorial Principles Section -->
    <section class="principles-section">
      <div class="principles-grid">
        <article
          v-for="p in principles"
          :key="p.title"
          class="principle-card"
        >
          <h3 class="principle-title">{{ p.title }}</h3>
          <p class="principle-desc">{{ p.desc }}</p>
        </article>
      </div>
    </section>

    <!-- Curated Tasting Preview -->
    <section class="curated-section">
      <div class="curated-header">
        <div>
          <h2>Pilihan Populer Hari Ini</h2>
          <p class="curated-sub">Cita rasa yang paling sering menemani makan siang dan malam para penikmat Wareg.</p>
        </div>
        <RouterLink to="/menu" class="explore-all-link">
          <span>Lihat Semua Menu</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </RouterLink>
      </div>

      <div class="curated-grid">
        <article
          v-for="food in featuredFoods"
          :key="food.id"
          class="curated-card"
          tabindex="0"
          role="button"
          :aria-label="`Buka detail ${food.name}`"
          @click="router.push(`/menu/${food.id}`)"
          @keydown.enter="router.push(`/menu/${food.id}`)"
        >
          <div class="curated-thumb">
            <img :src="food.image" :alt="food.name" loading="lazy" />
          </div>
          <div class="curated-content">
            <span class="curated-category">{{ food.category }}</span>
            <h3 class="curated-name">{{ food.name }}</h3>
            <p class="curated-desc">{{ food.description }}</p>
            <div class="curated-bottom">
              <strong class="curated-price">{{ formatPrice(food.price) }}</strong>
              <button
                class="add-cart-btn"
                aria-label="Tambah ke keranjang"
                title="Tambah langsung ke keranjang"
                @click.stop="addToCart(food)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
