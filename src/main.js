import '@mdi/font/css/materialdesignicons.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import VuetifyToast from 'vuetify-toast-snackbar'

Vue.use(VuetifyToast, {
    x: 'right', // default
    y: 'bottom', // default
    timeout: 2000, // default
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
