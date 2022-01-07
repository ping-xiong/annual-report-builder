import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import  { VSnackbar, VIcon } from 'vuetify/lib'

Vue.use(Vuetify);

Vue.component("v-snackbar", VSnackbar)
Vue.component("v-icon", VIcon)

export default new Vuetify({});
