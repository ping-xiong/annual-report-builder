import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import  { VSnackbar, VIcon } from 'vuetify/lib'

Vue.use(Vuetify);

Vue.component("v-snackbar", VSnackbar)
Vue.component("v-icon", VIcon)

import zhHans from 'vuetify/lib/locale/zh-Hans'

export default new Vuetify({
    lang:{
        locales: {zhHans},
        current: 'zhHans'
    }
});
