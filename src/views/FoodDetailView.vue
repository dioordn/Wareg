<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'

const route = useRoute()
const router = useRouter()
const { foods, formatPrice, addToCart } = useCart()

const foodId = computed(() => Number(route.params.id))
const food = computed(() => foods.find((item) => item.id === foodId.value))

const relatedFoods = computed(() => {
  if (!food.value) return []
  return foods.filter((item) => item.id !== foodId.value).slice(0, 3)
})

const quantity = ref(1)

// Reset state when navigating between different food details
watch(
  foodId,
  () => {
    quantity.value = 1
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  { immediate: true }
)

function increaseQty() {
  if (quantity.value < 99) {
    quantity.value += 1
  }
}

function decreaseQty() {
  if (quantity.value > 1) {
    quantity.value -= 1
  }
}

function handleAddToCart() {
  if (!food.value) return
  addToCart(food.value, quantity.value)
}
</script>

<template>
  <div class="page-container food-detail-page">
    <!-- Main Detail Layout -->
    <div v-if="food" class="food-detail-layout">
      <!-- Media Column -->
      <div class="detail-media-column">
        <div class="detail-image-card">
          <img :src="food.image" :alt="food.name" class="detail-main-img" />
        </div>

        <!-- Kitchen Quality Note -->
        <div class="culinary-guarantee-card">
          <div class="guarantee-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div class="guarantee-text">
            <strong>Standar Dapur Wareg</strong>
            <p>Setiap porsi dimasak langsung saat pesanan diterima untuk menjaga aroma dan kehangatan rasa rumahan asli.</p>
          </div>
        </div>
      </div>

      <!-- Info & Ordering Column -->
      <div class="detail-info-column">
        <!-- Category & Prep Time -->
        <div class="detail-meta-pill-row">
          <span class="food-category-tag">{{ food.category }}</span>
          <span class="detail-prep-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Waktu masak {{ food.prepTime }}</span>
          </span>
        </div>

        <h1 class="detail-title">{{ food.name }}</h1>

        <!-- Price Display -->
        <div class="detail-price-box">
          <span class="detail-price-label">Harga Satuan</span>
          <strong class="detail-price-value">{{ formatPrice(food.price) }}</strong>
        </div>

        <!-- Description -->
        <p class="detail-description">{{ food.description }}</p>

        <!-- Highlight Callout -->
        <div v-if="food.highlight" class="detail-highlight-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ food.highlight }}</span>
        </div>

        <!-- Composition & Ingredients -->
        <div v-if="food.ingredients?.length" class="detail-section-block">
          <h3 class="detail-section-heading">Komposisi & Bumbu Utama</h3>
          <div class="detail-ingredients-grid">
            <div v-for="ing in food.ingredients" :key="ing" class="detail-ingredient-item">
              <span class="ingredient-bullet">•</span>
              <span>{{ ing }}</span>
            </div>
          </div>
        </div>

        <!-- Order Action Block -->
        <div class="detail-action-card">
          <div class="action-top-row">
            <span class="action-label">Jumlah Pesanan</span>
            <div class="detail-stepper">
              <button
                class="stepper-action-btn"
                :disabled="quantity <= 1"
                aria-label="Kurangi 1"
                @click="decreaseQty"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span class="stepper-count">{{ quantity }}</span>
              <button
                class="stepper-action-btn"
                aria-label="Tambah 1"
                @click="increaseQty"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>

          <button class="primary-button detail-add-btn" @click="handleAddToCart">
            <span>Tambah ke Keranjang</span>
            <span class="btn-divider">•</span>
            <span class="btn-total-amount">{{ formatPrice(food.price * quantity) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="detail-not-found-box">
      <h2>Hidangan Tidak Ditemukan</h2>
      <p>Menu yang kamu cari mungkin sedang tidak tersedia atau sudah berganti.</p>
      <RouterLink to="/menu" class="primary-button">Kembali ke Daftar Menu</RouterLink>
    </div>

    <!-- Related Recommendations -->
    <section v-if="food && relatedFoods.length" class="related-foods-section">
      <div class="related-header">
        <div>
          <h2>Pilihan Hidangan Lainnya</h2>
          <p class="related-subtitle">Cita rasa khas nusantara lainnya yang patut kamu coba.</p>
        </div>
        <RouterLink to="/menu" class="explore-all-link">
          <span>Lihat Semua Menu</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </RouterLink>
      </div>

      <div class="food-grid">
        <article
          v-for="item in relatedFoods"
          :key="item.id"
          class="food-card"
          tabindex="0"
          role="button"
          :aria-label="`Buka detail ${item.name}`"
          @click="router.push(`/menu/${item.id}`)"
          @keydown.enter="router.push(`/menu/${item.id}`)"
        >
          <div class="food-card-thumb">
            <img :src="item.image" :alt="item.name" loading="lazy" />
          </div>
          <div class="food-card-body">
            <div class="food-meta-row">
              <span class="food-category-tag">{{ item.category }}</span>
            </div>
            <h3 class="food-title">{{ item.name }}</h3>
            <p class="food-desc">{{ item.description }}</p>
            <div class="food-card-footer">
              <div class="food-price-col">
                <span class="price-label">Harga</span>
                <strong class="food-price">{{ formatPrice(item.price) }}</strong>
              </div>
              <button
                class="add-cart-btn"
                aria-label="Tambah ke keranjang"
                title="Tambah langsung ke keranjang"
                @click.stop="addToCart(item)"
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
