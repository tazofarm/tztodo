import { createRouter, createWebHistory } from '@ionic/vue-router'

import Home from '@/views/Home.vue'
import HomePage from '@/views/HomePage.vue'
import SettingPage from '@/views/SettingPage.vue'

const routes = [
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        component: HomePage
      },
      {
        path: 'settings',
        component: SettingPage
      }
    ]
  },
  {
    path: '/',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
