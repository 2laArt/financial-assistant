import {
  createRouter, createWebHashHistory
} from 'vue-router'

import FaMain from "../components/fa-main/fa-main-page.vue"
import FaCrypto from "../components/fa-crypto/fa-crypto.vue"
import FaCurrency from "../components/fa-currency/fa-currency.vue"
import FaTraining from "../components/fa-training/fa-training.vue"

const routes = [
  {
    path: '/',
    name: 'main',
    component: FaMain
  },
  {
    path: '/crypto',
    name: 'crypto',
    component: FaCrypto
  },
  {
    path: '/currency',
    name: 'currency',
    component: FaCurrency
  },
  {
    path: '/training',
    name: 'training',
    component: FaTraining
  },

]

const router = createRouter({
  history: createWebHashHistory('main'),
  mode: 'history',
  hash: false,
  routes
})

export default router
