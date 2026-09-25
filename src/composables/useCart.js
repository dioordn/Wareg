import { computed, ref } from 'vue'

export const foodsData = [
  {
    id: 1,
    name: 'Nasi Goreng Kampung',
    category: 'Makanan',
    description: 'Nasi goreng racikan bumbu khas dengan telur mata sapi, ayam suwir gurih, dan acar segar.',
    price: 28000,
    prepTime: '15-20 mnt',
    portion: '1 Porsi Lengkap',
    ingredients: ['Beras Pandan Wangi', 'Bumbu Ulek Bawang & Cabai', 'Telur Mata Sapi', 'Ayam Suwir Gurih', 'Acar Timun Wortel', 'Kerupuk Bawang'],
    highlight: 'Rempah tradisional nusantara, disajikan hangat saat dipesan',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Soto Ayam Lamongan',
    category: 'Sarapan',
    description: 'Kuah kaldu ayam kuning hangat dengan taburan koya gurih, suwiran ayam, dan bihun lembut.',
    price: 26000,
    prepTime: '10-15 mnt',
    portion: '1 Porsi Hangat',
    ingredients: ['Kaldu Ayam Kuning', 'Suwiran Daging Ayam', 'Bihun Beras Halus', 'Taburan Koya Gurih', 'Telur Rebus', 'Seledri & Jeruk Nipis'],
    highlight: 'Kuah kaldu direbus perlahan dengan rempah pilihan',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Sate Taichan Sambal Matah',
    category: 'Makanan',
    description: 'Daging ayam bakar empuk dan juicy ditemani sambal matah Bali yang harum dan pedas segar.',
    price: 32000,
    prepTime: '20-25 mnt',
    portion: '10 Tusuk + Lontong',
    ingredients: ['Fillet Dada Ayam Pilihan', 'Sambal Matah Iris Segar', 'Jeruk Limau Harum', 'Lontong Daun Pisang', 'Garam Laut & Bawang Putih'],
    highlight: 'Daging juicy tanpa lemak dipanggang kematangan pas',
    image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    name: 'Es Kopi Susu Gula Aren',
    category: 'Minuman',
    description: 'Espresso robusta & arabika pilihan, susu fresh creamy, dan manis legitnya gula aren organik.',
    price: 18000,
    prepTime: '5-10 mnt',
    portion: 'Gelas 16 oz (Dingin)',
    ingredients: ['House Blend Espresso', 'Fresh Milk Pasteurisasi', 'Gula Aren Organik Lebak', 'Es Kristal Higienis'],
    highlight: 'Kopi mantap seimbang dengan legit manis gula aren alami',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    name: 'Pisang Goreng Madu Keju',
    category: 'Cemilan',
    description: 'Pisang kepok manis renyah dengan lelehan madu hutan dan parutan keju cheddar melimpah.',
    price: 22000,
    prepTime: '10-15 mnt',
    portion: '1 Porsi (4 Potong)',
    ingredients: ['Pisang Kepok Kuning Matang Pohon', 'Tepung Crispy Renyah', 'Madu Hutan Murni', 'Keju Cheddar Parut'],
    highlight: 'Renyah gurih di luar, manis lumer legit di dalam',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    name: 'Matcha Oat Latte',
    category: 'Minuman',
    description: 'Matcha Uji Jepang berpadu foam oat milk yang lembut, sedikit manis dan menyegarkan.',
    price: 24000,
    prepTime: '5-10 mnt',
    portion: 'Gelas 16 oz (Dingin)',
    ingredients: ['Matcha Uji Premium', 'Susu Oat Nabati (Plant-Based)', 'Pemanis Tebu Alami', 'Es Kristal Higienis'],
    highlight: '100% plant-based, rasa creamy dengan aroma matcha otentik',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=85',
  },
]

// Global reactive cart & modal state
const cart = ref([])
const showCart = ref(false)
const selectedFood = ref(null)
const toastMessage = ref('')
let toastTimer = null

export function useCart() {
  const cartCount = computed(() => cart.value.reduce((total, item) => total + item.quantity, 0))
  const subtotal = computed(() => cart.value.reduce((total, item) => total + item.price * item.quantity, 0))
  const deliveryFee = computed(() => (subtotal.value > 0 ? 6000 : 0))
  const total = computed(() => subtotal.value + deliveryFee.value)

  function formatPrice(value) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function showToast() {
    // Toast notification telah dinonaktifkan di semua halaman
  }

  function openFoodDetail(food) {
    selectedFood.value = food
  }

  function closeFoodDetail() {
    selectedFood.value = null
  }

  function addToCart(food, quantity = 1, note = '') {
    const cleanNote = (note || '').trim()
    const existing = cart.value.find((item) => item.id === food.id && (item.note || '') === cleanNote)
    if (existing) {
      existing.quantity += quantity
    } else {
      cart.value.push({ ...food, quantity, note: cleanNote })
    }
    const countLabel = quantity > 1 ? ` (${quantity}x)` : ''
    showToast(`${food.name}${countLabel} ditambahkan ke keranjang`)
  }

  function changeQuantity(item, amount) {
    item.quantity += amount
    if (item.quantity <= 0) {
      cart.value = cart.value.filter((cartItem) => cartItem !== item)
    }
  }

  function removeFromCart(id, note = null) {
    cart.value = cart.value.filter((cartItem) => {
      if (note !== null) {
        return !(cartItem.id === id && (cartItem.note || '') === note)
      }
      return cartItem.id !== id
    })
    showToast('Menu dihapus dari keranjang')
  }

  function clearCart() {
    cart.value = []
    showToast('Keranjang dikosongkan')
  }

  return {
    cart,
    showCart,
    selectedFood,
    openFoodDetail,
    closeFoodDetail,
    toastMessage,
    cartCount,
    subtotal,
    deliveryFee,
    total,
    foods: foodsData,
    formatPrice,
    showToast,
    addToCart,
    changeQuantity,
    removeFromCart,
    clearCart,
  }
}
