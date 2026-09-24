<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import BrandLogo from './components/BrandLogo.vue'
import { useCart } from './composables/useCart'
import { useNotifications } from './composables/useNotifications'

const router = useRouter()
const route = useRoute()
const {
  cart,
  showCart,
  toastMessage,
  cartCount,
  subtotal,
  deliveryFee,
  total,
  formatPrice,
  changeQuantity,
  removeFromCart,
} = useCart()

const mobileMenuOpen = ref(false)
const navRef = ref(null)

const indicatorStyle = ref({
  left: '0px',
  width: '0px',
  opacity: 0,
})

function updateIndicatorToElement(el) {
  if (!el || !navRef.value) return
  const navRect = navRef.value.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  indicatorStyle.value = {
    left: `${elRect.left - navRect.left}px`,
    width: `${elRect.width}px`,
    opacity: 1,
  }
}

function updateActiveIndicator() {
  nextTick(() => {
    if (!navRef.value) return
    const activeEl = navRef.value.querySelector('a.active')
    if (activeEl) {
      updateIndicatorToElement(activeEl)
    } else {
      indicatorStyle.value.opacity = 0
    }
  })
}

function onNavHover(e) {
  updateIndicatorToElement(e.currentTarget)
}

function onNavLeave() {
  updateActiveIndicator()
}

const {
  notifications,
  showDropdown: notificationOpen,
  unreadCount,
  toggleDropdown: toggleNotification,
  closeDropdown: closeNotification,
  markAllAsRead,
  markAsRead,
} = useNotifications()

const notificationWrapRef = ref(null)

function handleDocumentClick(e) {
  if (notificationWrapRef.value && !notificationWrapRef.value.contains(e.target)) {
    closeNotification()
  }
}

watch(() => route.path, () => {
  updateActiveIndicator()
  closeNotification()
  closeMobileMenu()
})

onMounted(() => {
  updateActiveIndicator()
  window.addEventListener('resize', updateActiveIndicator)
  window.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateActiveIndicator)
  window.removeEventListener('click', handleDocumentClick)
})

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="app-layout">
    <!-- Sticky Navigation Bar -->
    <header class="site-header">
      <div class="header-container">
        <!-- Logo Brand -->
        <RouterLink class="brand-link" to="/" aria-label="Wareg Beranda" @click="closeMobileMenu">
          <BrandLogo size="md" />
        </RouterLink>

        <!-- Desktop Navigation with Sliding Indicator -->
        <nav
          ref="navRef"
          class="main-nav"
          aria-label="Navigasi utama"
          @mouseleave="onNavLeave"
        >
          <RouterLink
            to="/"
            exact-active-class="active"
            @mouseenter="onNavHover"
          >
            Beranda
          </RouterLink>
          <RouterLink
            to="/menu"
            active-class="active"
            @mouseenter="onNavHover"
          >
            Menu
          </RouterLink>
          <RouterLink
            to="/cara-kerja"
            active-class="active"
            @mouseenter="onNavHover"
          >
            Cara kerja
          </RouterLink>
          <RouterLink
            to="/tentang"
            active-class="active"
            @mouseenter="onNavHover"
          >
            Tentang kami
          </RouterLink>

          <!-- Smooth Sliding Active Indicator -->
          <span class="nav-sliding-indicator" :style="indicatorStyle"></span>
        </nav>

        <!-- Top Right Actions -->
        <div class="top-actions">
          <!-- Notification Bell Button & Dropdown -->
          <div ref="notificationWrapRef" class="notification-wrap">
            <button
              class="notification-btn"
              :class="{ active: notificationOpen }"
              aria-label="Lihat notifikasi"
              @click.stop="toggleNotification"
            >
              <span class="notification-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </span>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>

            <!-- Dropdown Popover -->
            <transition name="dropdown-fade">
              <div v-if="notificationOpen" class="notification-dropdown" @click.stop>
                <div class="notification-dropdown-header">
                  <div class="dropdown-title-group">
                    <span class="dropdown-title">Notifikasi</span>
                    <span v-if="unreadCount > 0" class="unread-pill">{{ unreadCount }} baru</span>
                  </div>
                  <button
                    v-if="unreadCount > 0"
                    type="button"
                    class="mark-all-read-btn"
                    @click="markAllAsRead"
                  >
                    Tandai dibaca
                  </button>
                </div>

                <div class="notification-list">
                  <div v-if="!notifications.length" class="empty-notifications">
                    <p>Belum ada notifikasi saat ini.</p>
                  </div>
                  <div
                    v-for="item in notifications"
                    :key="item.id"
                    class="notification-item"
                    :class="{ unread: item.unread }"
                    @click="markAsRead(item.id); closeNotification(); router.push(`/notifikasi/${item.id}`)"
                  >
                    <div class="notification-item-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                    </div>
                    <div class="notification-item-content">
                      <div class="notification-item-header">
                        <h4 class="item-title">{{ item.title }}</h4>
                        <div class="item-meta-right">
                          <span class="item-time">{{ item.time }}</span>
                          <span v-if="item.unread" class="unread-dot" title="Belum dibaca"></span>
                        </div>
                      </div>
                      <p class="item-desc">{{ item.message }}</p>
                      <div class="item-action-row">
                        <span class="detail-link-text">
                          <span>Lihat detail</span>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dropdown Footer Action -->
                <div class="notification-dropdown-footer">
                  <button
                    type="button"
                    class="view-all-notifications-btn"
                    @click="closeNotification(); router.push('/notifikasi')"
                  >
                    <span>Buka Halaman Notifikasi</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Cart Button -->
          <button class="cart-button" aria-label="Buka keranjang belanja" @click="showCart = true">
            <span class="cart-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </span>
            <span class="cart-text">Keranjang</span>
            <span v-if="cartCount" class="cart-count-badge">{{ cartCount }}</span>
          </button>

          <!-- Mobile Hamburger Toggle -->
          <button
            class="menu-toggle-btn"
            :class="{ open: mobileMenuOpen }"
            aria-label="Buka menu navigasi"
            :aria-expanded="mobileMenuOpen"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span class="toggle-bar"></span>
            <span class="toggle-bar"></span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer -->
      <transition name="mobile-menu">
        <nav v-if="mobileMenuOpen" class="mobile-nav" aria-label="Navigasi mobile">
          <RouterLink to="/" exact-active-class="active" @click="closeMobileMenu">Beranda</RouterLink>
          <RouterLink to="/menu" active-class="active" @click="closeMobileMenu">Menu</RouterLink>
          <RouterLink to="/cara-kerja" active-class="active" @click="closeMobileMenu">Cara Kerja</RouterLink>
          <RouterLink to="/tentang" active-class="active" @click="closeMobileMenu">Tentang Kami</RouterLink>
        </nav>
      </transition>
    </header>

    <!-- Main View Content Router Shell -->
    <div class="app-shell">
      <main>
        <RouterView />
      </main>
    </div>

    <!-- Global Full-Width Footer -->
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand-wrap">
            <BrandLogo size="md" />
            <p class="footer-tagline">
              Ruang kurasi masakan rumahan dan nusantara. Dimasak dari bahan segar, diantar selalu hangat ke mejamu.
            </p>
          </div>
          <nav class="footer-nav" aria-label="Navigasi Footer">
            <RouterLink to="/" active-class="active">Beranda</RouterLink>
            <RouterLink to="/menu" active-class="active">Menu</RouterLink>
            <RouterLink to="/cara-kerja" active-class="active">Cara Kerja</RouterLink>
            <RouterLink to="/tentang" active-class="active">Tentang Kami</RouterLink>
          </nav>
        </div>
        <div class="footer-bottom">
          <p class="footer-copy">© 2026 Wareg Indonesia. Hak cipta dilindungi.</p>
          <span class="footer-note">Cita rasa autentik nusantara untuk setiap meja makan</span>
        </div>
      </div>
    </footer>

    <!-- Cart Drawer Modal (Accessible on all pages) -->
    <div v-if="showCart" class="cart-overlay" @click.self="showCart = false">
      <aside class="cart-drawer">
        <div class="drawer-header">
          <h2>Keranjang</h2>
          <button class="drawer-close-btn" aria-label="Tutup keranjang" @click="showCart = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Empty Cart -->
        <div v-if="!cart.length" class="cart-empty-state">
          <div class="empty-cart-illustration">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <h3>Keranjang masih kosong</h3>
          <p>Yuk pilih hidangan lezat favoritmu untuk mulai memesan.</p>
          <RouterLink to="/menu" class="primary-button" @click="showCart = false">
            Pilih Hidangan
          </RouterLink>
        </div>

        <!-- Filled Cart -->
        <template v-else>
          <div class="cart-items-list">
            <div v-for="item in cart" :key="item.id + (item.note || '')" class="cart-item-row">
              <img :src="item.image" :alt="item.name" class="cart-item-img" />
              <div class="cart-item-details">
                <h4 class="cart-item-name">{{ item.name }}</h4>
                <p v-if="item.note" class="cart-item-note">"{{ item.note }}"</p>
                <span class="cart-item-unit-price">{{ formatPrice(item.price) }}</span>
                <div class="cart-item-quantity-control">
                  <button
                    class="qty-btn"
                    aria-label="Kurangi 1"
                    @click="changeQuantity(item, -1)"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  <span class="qty-number">{{ item.quantity }}</span>
                  <button
                    class="qty-btn"
                    aria-label="Tambah 1"
                    @click="changeQuantity(item, 1)"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="cart-item-end">
                <button
                  class="cart-item-delete-btn"
                  aria-label="Hapus menu ini dari keranjang"
                  title="Hapus pesanan"
                  @click="removeFromCart(item.id, item.note)"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
                <span class="cart-item-subtotal">{{ formatPrice(item.price * item.quantity) }}</span>
              </div>
            </div>
          </div>

          <div class="cart-drawer-summary">
            <div class="summary-line">
              <span>Subtotal</span>
              <strong>{{ formatPrice(subtotal) }}</strong>
            </div>
            <div class="summary-line">
              <span>Biaya Antar</span>
              <strong>{{ formatPrice(deliveryFee) }}</strong>
            </div>
            <div class="summary-total-line">
              <span>Total Pembayaran</span>
              <strong class="total-amount">{{ formatPrice(total) }}</strong>
            </div>
            <button
              class="primary-button checkout-button"
              @click="showCart = false; router.push('/pembayaran')"
            >
              <span>Lanjut Pembayaran</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </button>
          </div>
        </template>
      </aside>
    </div>

    <!-- Global Toast Notification -->
    <transition name="toast-slide">
      <div v-if="toastMessage" class="toast-popup" role="status">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>
