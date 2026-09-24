<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useNotifications } from '../composables/useNotifications'

const router = useRouter()
const { cart, subtotal, deliveryFee, total, formatPrice, clearCart, showToast } = useCart()
const { addNotification } = useNotifications()

const serviceFee = 2000
const grandTotal = computed(() => (subtotal.value > 0 ? total.value + serviceFee : 0))

// Form state
const customerName = ref('')
const phoneNumber = ref('')
const deliveryAddress = ref('')
const addressNote = ref('')
const deliveryTime = ref('sekarang')
const paymentMethod = ref('qris')
const selectedBank = ref('BCA')

// Submission state
const isProcessing = ref(false)
const isPaid = ref(false)
const orderResult = ref(null)

const banks = [
  { id: 'BCA', name: 'Bank BCA', va: '88012 0812 8492 1109' },
  { id: 'Mandiri', name: 'Bank Mandiri', va: '89102 0812 8492 1109' },
  { id: 'BRI', name: 'Bank BRI', va: '10293 0812 8492 1109' },
  { id: 'BNI', name: 'Bank BNI', va: '99201 0812 8492 1109' },
]

const currentVa = computed(() => {
  const b = banks.find((item) => item.id === selectedBank.value)
  return b ? b.va : '88012 0812 8492 1109'
})

function copyVa() {
  navigator.clipboard.writeText(currentVa.value.replace(/\s+/g, ''))
  showToast('Nomor Virtual Account disalin!')
}

function handlePay() {
  if (!customerName.value.trim()) {
    showToast('Silakan masukkan nama penerima')
    return
  }
  if (!phoneNumber.value.trim()) {
    showToast('Silakan masukkan nomor telepon / WhatsApp')
    return
  }
  if (!deliveryAddress.value.trim()) {
    showToast('Silakan masukkan alamat pengantaran')
    return
  }

  isProcessing.value = true

  setTimeout(() => {
    const orderId = 'WRG-' + Math.floor(100000 + Math.random() * 900000)
    orderResult.value = {
      orderId,
      name: customerName.value,
      phone: phoneNumber.value,
      address: deliveryAddress.value,
      note: addressNote.value,
      method: paymentMethod.value.toUpperCase(),
      total: grandTotal.value,
      items: [...cart.value],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }

    addNotification({
      category: 'Konfirmasi Pesanan',
      title: `Pesanan #${orderId} Berhasil!`,
      message: `Pesanan sebesar ${formatPrice(grandTotal.value)} sedang dimasak hangat oleh Dapur Wareg.`,
      detail: `Pesanan dengan nomor #${orderId} atas nama ${customerName.value} telah diterima sistem. Koki Dapur Wareg saat ini sedang mengolah hidangan pesananmu dengan bahan segar. Estimasi pengantaran adalah 25–35 menit menuju ke ${deliveryAddress.value}. Pembayaran via ${paymentMethod.value.toUpperCase()} telah terverifikasi aman.`,
      actionText: 'Lihat Pilihan Menu Lain',
      actionLink: '/menu',
    })

    clearCart()
    isProcessing.value = false
    isPaid.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 1000)
}
</script>

<template>
  <div class="page-container checkout-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1>Pembayaran & Pengantaran</h1>
      <p class="page-subtitle">
        Selesaikan detail pesananmu agar hidangan segera dimasak hangat di dapur Wareg.
      </p>
    </div>

    <!-- Success State: Order Paid -->
    <div v-if="isPaid && orderResult" class="order-success-card">
      <div class="success-icon-wrap">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <div class="success-badge">Pembayaran Berhasil Dikonfirmasi</div>
      <h2 class="success-title">Pesanan Sedang Dimasak!</h2>
      <p class="success-subtitle">
        Terima kasih, <strong>{{ orderResult.name }}</strong>. Dapur Wareg sedang mengolah hidanganmu dari bahan segar.
      </p>

      <!-- Receipt Box -->
      <div class="receipt-summary-box">
        <div class="receipt-row">
          <span>Nomor Pesanan</span>
          <strong>{{ orderResult.orderId }}</strong>
        </div>
        <div class="receipt-row">
          <span>Estimasi Tiba</span>
          <strong class="receipt-highlight">25 - 35 Menit (Hangat)</strong>
        </div>
        <div class="receipt-row">
          <span>Metode Pembayaran</span>
          <strong>{{ orderResult.method }}</strong>
        </div>
        <div class="receipt-row">
          <span>Alamat Pengantaran</span>
          <span class="receipt-address">{{ orderResult.address }}</span>
        </div>
        <div class="receipt-row-total">
          <span>Total Dibayar</span>
          <strong class="receipt-total-value">{{ formatPrice(orderResult.total) }}</strong>
        </div>
      </div>

      <div class="success-cta-group">
        <RouterLink to="/menu" class="primary-button">
          Pesan Menu Lainnya
        </RouterLink>
        <RouterLink to="/" class="secondary-button">
          Kembali ke Beranda
        </RouterLink>
      </div>
    </div>

    <!-- Empty Cart Notice -->
    <div v-else-if="!cart.length" class="empty-checkout-box">
      <div class="empty-icon-wrap">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      </div>
      <h2>Keranjang Masih Kosong</h2>
      <p>Pilih hidangan nusantara favoritmu terlebih dahulu untuk melanjutkan ke pembayaran.</p>
      <RouterLink to="/menu" class="primary-button">
        Lihat Pilihan Menu
      </RouterLink>
    </div>

    <!-- Checkout Form Layout -->
    <div v-else class="checkout-grid">
      <!-- Left Column: Forms -->
      <div class="checkout-forms-column">
        <!-- 1. Alamat & Kontak -->
        <section class="checkout-card">
          <div class="checkout-card-header">
            <span class="section-number">1</span>
            <h2>Informasi Penerima & Alamat</h2>
          </div>

          <div class="checkout-fields">
            <div class="form-row-2">
              <div class="form-group">
                <label for="checkout-name">Nama Penerima</label>
                <input
                  id="checkout-name"
                  v-model="customerName"
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  autocomplete="off"
                  required
                />
              </div>

              <div class="form-group">
                <label for="checkout-phone">Nomor WhatsApp / HP</label>
                <input
                  id="checkout-phone"
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  autocomplete="off"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="checkout-address">Alamat Pengantaran Lengkap</label>
              <textarea
                id="checkout-address"
                v-model="deliveryAddress"
                rows="3"
                placeholder="Nama jalan, nomor rumah/kantor, RT/RW, kelurahan..."
                autocomplete="off"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="checkout-note">Patokan / Catatan Kurir (Opsional)</label>
              <input
                id="checkout-note"
                v-model="addressNote"
                type="text"
                placeholder="Contoh: Pagar hitam nomor 14, titip di pos satpam"
                autocomplete="off"
              />
            </div>
          </div>
        </section>

        <!-- 2. Waktu Pengantaran -->
        <section class="checkout-card">
          <div class="checkout-card-header">
            <span class="section-number">2</span>
            <h2>Waktu Pengantaran</h2>
          </div>

          <div class="delivery-time-options">
            <label class="time-radio-card" :class="{ selected: deliveryTime === 'sekarang' }">
              <input v-model="deliveryTime" type="radio" value="sekarang" />
              <div class="time-radio-content">
                <strong>Kirim Sekarang</strong>
                <span>Dimasak langsung, estimasi sampai 20–30 menit</span>
              </div>
            </label>

            <label class="time-radio-card" :class="{ selected: deliveryTime === 'jadwal' }">
              <input v-model="deliveryTime" type="radio" value="jadwal" />
              <div class="time-radio-content">
                <strong>Jadwalkan Jam Makan</strong>
                <span>Pesan untuk diantar tepat waktu jam santap nanti</span>
              </div>
            </label>
          </div>
        </section>

        <!-- 3. Metode Pembayaran -->
        <section class="checkout-card">
          <div class="checkout-card-header">
            <span class="section-number">3</span>
            <h2>Metode Pembayaran</h2>
          </div>

          <div class="payment-method-selector">
            <button
              class="payment-tab-btn"
              :class="{ active: paymentMethod === 'qris' }"
              type="button"
              @click="paymentMethod = 'qris'"
            >
              <span>QRIS</span>
            </button>
            <button
              class="payment-tab-btn"
              :class="{ active: paymentMethod === 'va' }"
              type="button"
              @click="paymentMethod = 'va'"
            >
              <span>Transfer VA Bank</span>
            </button>
            <button
              class="payment-tab-btn"
              :class="{ active: paymentMethod === 'cod' }"
              type="button"
              @click="paymentMethod = 'cod'"
            >
              <span>Tunai di Tempat (COD)</span>
            </button>
          </div>

          <!-- QRIS Panel -->
          <div v-if="paymentMethod === 'qris'" class="payment-method-panel">
            <div class="qris-simulator-box">
              <div class="qris-logo-header">
                <strong>QRIS Standar Nasional</strong>
                <span class="qris-apps-tag">GoPay • OVO • ShopeePay • Dana • BCA Mobile</span>
              </div>
              <div class="qris-qr-frame">
                <!-- Clean Vector SVG QR Matrix Representation -->
                <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="#FFFFFF"/>
                  <rect x="8" y="8" width="28" height="28" fill="#092B35"/>
                  <rect x="12" y="12" width="20" height="20" fill="#FFFFFF"/>
                  <rect x="16" y="16" width="12" height="12" fill="#06715F"/>
                  <rect x="64" y="8" width="28" height="28" fill="#092B35"/>
                  <rect x="68" y="12" width="20" height="20" fill="#FFFFFF"/>
                  <rect x="72" y="16" width="12" height="12" fill="#06715F"/>
                  <rect x="8" y="64" width="28" height="28" fill="#092B35"/>
                  <rect x="12" y="68" width="20" height="20" fill="#FFFFFF"/>
                  <rect x="16" y="72" width="12" height="12" fill="#06715F"/>
                  <rect x="42" y="12" width="8" height="16" fill="#092B35"/>
                  <rect x="42" y="34" width="16" height="8" fill="#06715F"/>
                  <rect x="20" y="44" width="16" height="8" fill="#092B35"/>
                  <rect x="42" y="48" width="16" height="16" fill="#092B35"/>
                  <rect x="64" y="44" width="12" height="8" fill="#06715F"/>
                  <rect x="80" y="44" width="12" height="16" fill="#092B35"/>
                  <rect x="44" y="72" width="16" height="8" fill="#092B35"/>
                  <rect x="68" y="68" width="24" height="8" fill="#06715F"/>
                  <rect x="68" y="82" width="12" height="10" fill="#092B35"/>
                </svg>
              </div>
              <p class="qris-hint">
                Pindai kode QRIS di atas dengan aplikasi e-wallet atau mobile banking favoritmu saat konfirmasi.
              </p>
            </div>
          </div>

          <!-- VA Panel -->
          <div v-else-if="paymentMethod === 'va'" class="payment-method-panel">
            <div class="bank-pill-row">
              <button
                v-for="b in banks"
                :key="b.id"
                type="button"
                class="bank-select-btn"
                :class="{ selected: selectedBank === b.id }"
                @click="selectedBank = b.id"
              >
                {{ b.name }}
              </button>
            </div>
            <div class="va-display-box">
              <span class="va-label">Nomor Virtual Account {{ selectedBank }}</span>
              <div class="va-number-row">
                <strong class="va-number">{{ currentVa }}</strong>
                <button type="button" class="copy-va-btn" @click="copyVa">
                  Salin
                </button>
              </div>
              <p class="va-note">Pembayaran otomatis terverifikasi tanpa perlu unggah bukti transfer.</p>
            </div>
          </div>

          <!-- COD Panel -->
          <div v-else class="payment-method-panel">
            <div class="cod-notice-box">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <div>
                <strong>Bayar Tunai saat Makanan Tiba</strong>
                <p>Siapkan uang pas sebesar {{ formatPrice(grandTotal) }} untuk diserahkan ke kurir saat hidangan sampai.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Order Summary & Pay Button -->
      <aside class="checkout-summary-column">
        <div class="summary-sticky-card">
          <h2>Ringkasan Pesanan</h2>

          <!-- Items List -->
          <div class="checkout-items-list">
            <div v-for="item in cart" :key="item.id + (item.note || '')" class="checkout-item-line">
              <img :src="item.image" :alt="item.name" class="checkout-item-thumb" />
              <div class="checkout-item-info">
                <h4 class="checkout-item-title">{{ item.name }}</h4>
                <span class="checkout-item-qty">{{ item.quantity }}x • {{ formatPrice(item.price) }}</span>
              </div>
              <strong class="checkout-item-total">{{ formatPrice(item.price * item.quantity) }}</strong>
            </div>
          </div>

          <!-- Cost Breakdown -->
          <div class="checkout-cost-breakdown">
            <div class="cost-row">
              <span>Subtotal Pesanan</span>
              <strong>{{ formatPrice(subtotal) }}</strong>
            </div>
            <div class="cost-row">
              <span>Biaya Pengantaran</span>
              <strong>{{ formatPrice(deliveryFee) }}</strong>
            </div>
            <div class="cost-row">
              <span>Biaya Layanan Dapur</span>
              <strong>{{ formatPrice(serviceFee) }}</strong>
            </div>
            <div class="cost-total-row">
              <span>Total Pembayaran</span>
              <strong class="grand-total-val">{{ formatPrice(grandTotal) }}</strong>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            class="primary-button checkout-submit-btn"
            :disabled="isProcessing"
            @click="handlePay"
          >
            <span v-if="isProcessing">Memproses Pesanan...</span>
            <span v-else>Konfirmasi & Bayar • {{ formatPrice(grandTotal) }}</span>
          </button>

          <p class="checkout-secure-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>Transaksi aman & garansi kehangatan makanan 100%</span>
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
