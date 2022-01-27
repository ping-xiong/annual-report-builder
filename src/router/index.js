import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/qq',
        name: 'QQ',
        component: () => import('../views/QQReport.vue')
    },
    {
        path: '/wechat',
        name: 'Wechat',
        component: () => import('../views/WechatReport.vue')
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('../views/Setting.vue')
    },
    {
        path: '/help',
        name: 'Help',
        component: () => import('../views/Help.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/qq/preview',
        name: 'QQPreview',
        component: () => import('../views/QQPreview.vue')
    },
    {
        path: '/wechat/preview',
        name: 'WechatPreview',
        component: () => import('../views/WechatPreview.vue')
    },
]

const router = new VueRouter({
    routes
})

export default router
