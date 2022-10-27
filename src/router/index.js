import {
  createRouter, createWebHashHistory
} from 'vue-router'

import FaWelcom from "../components/fa/fa-welcom.vue"
import FaMain from "../components/fa-main/fa-main-page.vue"
import FaCrypto from "../components/fa-crypto/fa-crypto.vue"
import FaFiat from "../components/fa-fiat-currencies/fa-fiat.vue"
import FaTraining from "../components/fa-training/fa-training.vue"
import FaChart from "../components/fa-chart/fa-chart.vue"

const routes = [
  {
    path: '/',
    name: 'welcom',
    component: FaWelcom
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
  history: createWebHashHistory(),
  mode: 'history',
  hash: false,
  routes
})

export default router
