import { createRouter, createWebHistory } from '@ionic/vue-router'

import HomePage from '@/views/HomePage.vue'
import MainPage from '@/views/MainPage.vue'
import SettingPage from '@/views/SettingPage.vue'

const routes = [
  {
    path: '/home',
    component: HomePage,
    children: [
      {
        path: '',
        component: MainPage
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
