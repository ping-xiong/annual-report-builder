import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import createPersistedState from "vuex-persistedstate"

export default new Vuex.Store({
    state: {
        // 当前处理数据的百分比进度数据
        percent: 0,
        // 是否显示进度条
        showLoadingBar: false
    },
    mutations: {
        updatePercent(state, percent){
            state.percent = percent
            state.showLoadingBar = true
        },
        hideLoadingBar(state){
            state.showLoadingBar = false
        }
    },
    actions: {},
    modules: {},
    plugins: [
        createPersistedState({
            paths: []
        })
    ],
})
