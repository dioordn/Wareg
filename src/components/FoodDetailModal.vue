<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useCart } from '../composables/useCart'

const { selectedFood, closeFoodDetail, addToCart, formatPrice } = useCart()

const quantity = ref(1)
const orderNote = ref('')

// Reset state whenever a new food is opened
watch(selectedFood, (newFood) => {
  if (newFood) {
    quantity.value = 1
    orderNote.value = ''
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

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

function handleSubmit() {
  if (!selectedFood.value) return
  addToCart(selectedFood.value, quantity.value, orderNote.value)
  closeFoodDetail()
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && selectedFood.value) {
    closeFoodDetail()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <transition name="food-modal-fade">
    <div
      v-if="selectedFood"
      class="food-modal-overlay"
      @click.self="closeFoodDetail"
    >
      <div
        class="food-modal-dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="`Detail hidangan ${selectedFood.name}`"
      >
        <!-- Close Button -->
        <button
          class="food-modal-close-btn"
          aria-label="Tutup jendela detail"
          @click="closeFoodDetail"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div class="food-modal-grid">
          <!-- Left Column: Photography & Portion Tag -->
          <div class="food-modal-media">
            <img
              :src="selectedFood.image"
              :alt="selectedFood.name"
              class="food-modal-img"
            />
            <div v-if="selectedFood.portion" class="food-modal-badge-row">
              <span class="food-modal-badge">{{ selectedFood.portion }}</span>
            </div>
          </div>

          <!-- Right Column: Culinary Details & Actions -->
          <div class="food-modal-body">
            <!-- Header Meta -->
            <div class="food-modal-top-row">
              <span class="food-category-tag">{{ selectedFood.category }}</span>
              <span class="food-modal-time">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{{ selectedFood.prepTime }}</span>
              </span>
            </div>

            <!-- Title & Price -->
            <h2 class="food-modal-title">{{ selectedFood.name }}</h2>
            <div class="food-modal-price-display">
              <span class="price-prefix">Harga Satuan</span>
              <strong class="price-value">{{ formatPrice(selectedFood.price) }}</strong>
            </div>

            <!-- Description -->
            <p class="food-modal-desc">{{ selectedFood.description }}</p>

            <!-- Authentic Highlight Callout -->
            <div v-if="selectedFood.highlight" class="food-modal-highlight-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>{{ selectedFood.highlight }}</span>
            </div>

            <!-- Authentic Ingredients -->
            <div v-if="selectedFood.ingredients?.length" class="food-modal-section">
              <h4 class="food-modal-section-title">Komposisi & Bumbu</h4>
              <div class="food-modal-ingredients">
                <span
                  v-for="ing in selectedFood.ingredients"
                  :key="ing"
                  class="ingredient-pill"
                >
                  {{ ing }}
                </span>
              </div>
            </div>

            <!-- Kitchen Notes -->
            <div class="food-modal-section">
              <label for="modal-order-note" class="food-modal-section-title-row">
                <span class="food-modal-section-title">Catatan untuk Dapur</span>
                <span class="optional-tag">Opsional</span>
              </label>
              <div class="modal-input-wrapper">
                <input
                  id="modal-order-note"
                  v-model="orderNote"
                  type="text"
                  placeholder="Contoh: kuah dipisah, jangan terlalu pedas, dll."
                  class="food-modal-note-input"
                  maxlength="120"
                />
              </div>
            </div>

            <!-- Action Bar: Stepper & Add Button -->
            <div class="food-modal-action-bar">
              <div class="food-modal-stepper">
                <button
                  class="modal-stepper-btn"
                  :disabled="quantity <= 1"
                  aria-label="Kurangi jumlah pesanan"
                  @click="decreaseQty"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span class="modal-stepper-val">{{ quantity }}</span>
                <button
                  class="modal-stepper-btn"
                  aria-label="Tambah jumlah pesanan"
                  @click="increaseQty"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>

              <button
                class="primary-button food-modal-cta-btn"
                @click="handleSubmit"
              >
                <span>Tambah ke Keranjang</span>
                <span class="btn-price-bullet">•</span>
                <span class="btn-price-val">{{ formatPrice(selectedFood.price * quantity) }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
