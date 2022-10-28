import {
  createRouter, createWebHashHistory
} from 'vue-router'

import FaWelcome from "../components/fa/fa-welcome.vue"
import FaMain from "../components/fa-main/fa-main-page.vue"
import FaCrypto from "../components/fa-crypto/fa-crypto.vue"
import FaFiat from "../components/fa-fiat-currencies/fa-fiat.vue"
import FaTraining from "../components/fa-training/fa-training.vue"
import FaChart from "../components/fa-chart/fa-chart.vue"

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: FaWelcome
  },
  {
    path: '/main',
    name: 'main',
    component: FaMain
  },
  {
    path: '/crypto',
    name: 'crypto',
    component: FaCrypto
  },
  {
    path: '/fiat',
    name: 'fiat',
    component: FaFiat
  },
  {
    path: '/training',
    name: 'training',
    component: FaTraining
  },
  {
    path: '/chart',
    name: 'chart',
    component: FaChart,
  },

]

const router = createRouter({
  history: createWebHashHistory('fa'),
  mode: 'history',
  // hash: false,
  routes
})

export default router
