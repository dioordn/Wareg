import { computed, ref } from 'vue'

const notifications = ref([
  {
    id: 1,
    category: 'Sapaan Hangat',
    title: 'Selamat Datang di Wareg!',
    message: 'Nikmati hidangan khas nusantara yang dimasak segar dan diantar selalu hangat ke mejamu.',
    detail: 'Terima kasih telah berkunjung ke Wareg. Kami hadir membawa cita rasa masakan rumahan autentik dari berbagai pelosok nusantara. Seluruh hidangan kami diolah langsung oleh juru masak berpengalaman menggunakan bahan pangan lokal segar pilihan tanpa bahan pengawet. Selamat menjelajahi kekayaan rasa Indonesia di setiap hidangan kami.',
    time: 'Baru saja',
    date: '25 September 2026, 12:00 WIB',
    unread: true,
    actionText: 'Jelajahi Pilihan Menu',
    actionLink: '/menu',
  },
  {
    id: 2,
    category: 'Kabar Dapur',
    title: 'Dapur Wareg Siap Melayani',
    message: 'Semua bahan baku segar telah disiapkan koki untuk pesanan makan siang dan malammu.',
    detail: 'Dapur Wareg telah membuka sesi persiapan bahan baku segar hari ini. Rempah-rempah pilihan seperti serai wangi, lengkuas muda, cabai segar, dan racikan bumbu kuning khas nusantara telah diracik siap masak. Setiap pesanan dimasak langsung (made to order) agar kuah dan aroma rempah tetap prima saat tiba di meja makanmu.',
    time: '1 jam lalu',
    date: '25 September 2026, 11:00 WIB',
    unread: true,
    actionText: 'Lihat Menu Hari Ini',
    actionLink: '/menu',
  },
])

const showDropdown = ref(false)

export function useNotifications() {
  const unreadCount = computed(() => notifications.value.filter((n) => n.unread).length)

  function toggleDropdown() {
    showDropdown.value = !showDropdown.value
  }

  function closeDropdown() {
    showDropdown.value = false
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => {
      n.unread = false
    })
  }

  function markAsRead(id) {
    const item = notifications.value.find((n) => String(n.id) === String(id))
    if (item) {
      item.unread = false
    }
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter((n) => String(n.id) !== String(id))
  }

  function getNotification(id) {
    return notifications.value.find((n) => String(n.id) === String(id))
  }

  function addNotification({
    title,
    message,
    category = 'Pesanan',
    detail = '',
    actionText = 'Lihat Menu',
    actionLink = '/menu',
  }) {
    const id = Date.now()
    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`

    notifications.value.unshift({
      id,
      category,
      title,
      message,
      detail: detail || message,
      time: 'Baru saja',
      date: dateStr,
      unread: true,
      actionText,
      actionLink,
    })

    return id
  }

  return {
    notifications,
    showDropdown,
    unreadCount,
    toggleDropdown,
    closeDropdown,
    markAllAsRead,
    markAsRead,
    removeNotification,
    getNotification,
    addNotification,
  }
}
