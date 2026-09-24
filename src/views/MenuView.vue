<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'

const router = useRouter()
const { foods, formatPrice, addToCart } = useCart()

const categories = [
  { id: 'Semua', name: 'Semua' },
  { id: 'Sarapan', name: 'Sarapan' },
  { id: 'Makanan', name: 'Makanan' },
  { id: 'Minuman', name: 'Minuman' },
  { id: 'Cemilan', name: 'Cemilan' },
]

const activeCategory = ref('Semua')
const search = ref('')

const filteredFoods = computed(() => {
  const query = search.value.toLowerCase().trim()
  return foods.filter((food) => {
    const matchesCategory = activeCategory.value === 'Semua' || food.category === activeCategory.value
    const matchesSearch = !query || `${food.name} ${food.description}`.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <div class="page-container menu-page">
    <div class="page-header">
      <h1>Menu Makanan</h1>
      <p class="page-subtitle">
        Pilihan hidangan tradisional nusantara, minuman segar, dan cemilan yang diolah dengan bahan terbaik.
      </p>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="menu-toolbar">
      <div class="category-filter-row">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-pill"
          :class="{ selected: activeCategory === cat.name }"
          @click="activeCategory = cat.name"
        >
          {{ cat.name }}
        </button>
      </div>

      <div class="search-input-wrapper">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="search"
          type="search"
          placeholder="Cari hidangan favoritmu..."
          aria-label="Cari menu makanan"
        />
        <button v-if="search" class="clear-search-btn" aria-label="Hapus pencarian" @click="search = ''">×</button>
      </div>
    </div>

    <!-- Food Grid -->
    <div class="food-grid">
      <article
        v-for="food in filteredFoods"
        :key="food.id"
        class="food-card"
        tabindex="0"
        role="button"
        :aria-label="`Buka detail ${food.name}`"
        @click="router.push(`/menu/${food.id}`)"
        @keydown.enter="router.push(`/menu/${food.id}`)"
      >
        <div class="food-card-thumb">
          <img :src="food.image" :alt="food.name" loading="lazy" />
        </div>

        <div class="food-card-body">
          <div class="food-meta-row">
            <span class="food-category-tag">{{ food.category }}</span>
          </div>

          <h3 class="food-title">{{ food.name }}</h3>
          <p class="food-desc">{{ food.description }}</p>

          <div class="food-card-footer">
            <div class="food-price-col">
              <span class="price-label">Harga</span>
              <strong class="food-price">{{ formatPrice(food.price) }}</strong>
            </div>

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

    <!-- Empty State -->
    <div v-if="!filteredFoods.length" class="empty-state-box">
      <div class="empty-icon-wrap">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <h3>Menu belum ditemukan</h3>
      <p>Tidak ada hidangan yang cocok dengan kata kunci "{{ search }}". Coba cari menu lainnya.</p>
      <button class="secondary-button" @click="search = ''; activeCategory = 'Semua'">Tampilkan Semua Menu</button>
    </div>
  </div>
</template>
