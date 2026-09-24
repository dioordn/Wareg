import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenuView from '../views/MenuView.vue'
import FoodDetailView from '../views/FoodDetailView.vue'
import HowItWorksView from '../views/HowItWorksView.vue'
import AboutView from '../views/AboutView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import NotificationDetailView from '../views/NotificationDetailView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/menu', name: 'menu', component: MenuView },
  { path: '/menu/:id', name: 'food-detail', component: FoodDetailView },
  { path: '/cara-kerja', name: 'how-it-works', component: HowItWorksView },
  { path: '/tentang', name: 'about', component: AboutView },
  { path: '/pembayaran', name: 'checkout', component: CheckoutView },
  { path: '/notifikasi', name: 'notifications', component: NotificationDetailView },
  { path: '/notifikasi/:id', name: 'notification-detail', component: NotificationDetailView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
