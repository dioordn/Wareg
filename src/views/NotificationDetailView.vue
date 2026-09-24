<script setup>
import { computed, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { useNotifications } from '../composables/useNotifications'

const route = useRoute()
const router = useRouter()
const { showToast } = useCart()
const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  removeNotification,
} = useNotifications()

// Active notification based on route params :id or first notification
const activeId = computed(() => {
  if (route.params.id) {
    return route.params.id
  }
  return notifications.value.length ? notifications.value[0].id : null
})

const currentNotification = computed(() => {
  if (!activeId.value) return null
  return notifications.value.find((n) => String(n.id) === String(activeId.value)) || notifications.value[0] || null
})

// Automatically mark active notification as read when opened
watch(
  currentNotification,
  (val) => {
    if (val && val.unread) {
      markAsRead(val.id)
    }
  },
  { immediate: true }
)

function selectNotification(item) {
  markAsRead(item.id)
  router.push(`/notifikasi/${item.id}`)
}

function handleDeleteCurrent() {
  if (!currentNotification.value) return
  const idToDelete = currentNotification.value.id
  removeNotification(idToDelete)
  showToast('Notifikasi telah dihapus')
  if (notifications.value.length) {
    router.push(`/notifikasi/${notifications.value[0].id}`)
  } else {
    router.push('/notifikasi')
  }
}
</script>

<template>
  <div class="page-container notification-page">
    <!-- Page Header -->
    <div class="notification-nav-header">
      <div class="page-header text-left">
        <h1>Pusat Notifikasi</h1>
        <p class="page-subtitle">
          Informasi status pesanan hangat, kabar racikan dapur Wareg, dan pengumuman terbaru.
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!notifications.length" class="empty-notification-screen">
      <div class="empty-icon-circle">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </div>
      <h2>Tidak Ada Notifikasi</h2>
      <p>Kotak masukmu saat ini bersih. Kabar dapur dan konfirmasi pesananmu akan muncul di sini.</p>
      <RouterLink to="/menu" class="primary-button">
        Jelajahi Pilihan Menu
      </RouterLink>
    </div>

    <!-- Main Layout: Active Detail (Left) + List Sidebar (Right) -->
    <div v-else class="notification-layout-grid">
      <!-- Left Column: Detailed View -->
      <main class="notification-main-column">
        <article v-if="currentNotification" class="notification-detail-card">
          <!-- Card Meta Header -->
          <div class="detail-card-meta">
            <div class="meta-tag-group">
              <span class="category-pill-badge">{{ currentNotification.category || 'Pemberitahuan' }}</span>
              <span class="detail-timestamp">{{ currentNotification.date || currentNotification.time }}</span>
            </div>
            <button
              type="button"
              class="delete-notif-btn"
              title="Hapus notifikasi ini"
              aria-label="Hapus notifikasi"
              @click="handleDeleteCurrent"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>Hapus</span>
            </button>
          </div>

          <!-- Title -->
          <h2 class="detail-article-title">{{ currentNotification.title }}</h2>

          <!-- Short Callout Box -->
          <div class="detail-excerpt-callout">
            <div class="callout-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <p class="callout-text">{{ currentNotification.message }}</p>
          </div>

          <!-- Extended Story / Detail Content -->
          <div class="detail-narrative-section">
            <h3 class="narrative-heading">Informasi Rinci Dapur Wareg</h3>
            <p class="narrative-body">{{ currentNotification.detail || currentNotification.message }}</p>
          </div>

          <!-- Kitchen Guarantee Stamp -->
          <div class="culinary-trust-banner">
            <div class="trust-badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="trust-badge-text">
              <strong>Jaminan Mutu Sajian Rumahan</strong>
              <span>Dimasak bersih dari bahan segar nusantara tanpa bahan pengawet sintetik.</span>
            </div>
          </div>

          <!-- Action CTAs -->
          <div class="detail-action-footer">
            <RouterLink
              v-if="currentNotification.actionLink"
              :to="currentNotification.actionLink"
              class="primary-button detail-cta-btn"
            >
              <span>{{ currentNotification.actionText || 'Lihat Selengkapnya' }}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </RouterLink>

            <RouterLink to="/" class="secondary-button">
              Kembali ke Beranda
            </RouterLink>
          </div>
        </article>
      </main>

      <!-- Right Column: Sidebar Notification Switcher -->
      <aside class="notification-sidebar-column">
        <div class="sidebar-sticky-panel">
          <div class="sidebar-header-row">
            <div class="sidebar-title-wrap">
              <h3>Daftar Notifikasi</h3>
              <span class="count-pill">{{ notifications.length }}</span>
            </div>
            <button
              v-if="unreadCount > 0"
              type="button"
              class="mark-all-read-action"
              @click="markAllAsRead"
            >
              Tandai semua dibaca
            </button>
          </div>

          <div class="sidebar-items-list">
            <div
              v-for="item in notifications"
              :key="item.id"
              class="sidebar-notif-item"
              :class="{
                active: String(item.id) === String(currentNotification?.id),
                unread: item.unread,
              }"
              @click="selectNotification(item)"
            >
              <div class="sidebar-item-top">
                <span class="sidebar-item-cat">{{ item.category || 'Info' }}</span>
                <div class="sidebar-meta-right">
                  <span class="sidebar-item-time">{{ item.time }}</span>
                  <span v-if="item.unread" class="sidebar-unread-dot" title="Belum dibaca"></span>
                </div>
              </div>
              <h4 class="sidebar-item-title">{{ item.title }}</h4>
              <p class="sidebar-item-snippet">{{ item.message }}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
