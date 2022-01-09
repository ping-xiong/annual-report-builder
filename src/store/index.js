import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import createPersistedState from "vuex-persistedstate"

export default new Vuex.Store({
    state: {
        // 当前处理数据的百分比进度数据
        percent: 0,
        // 是否显示进度条
        showLoadingBar: false,
        // 通用设置
        setting: {
            // 提取TOP N个关键词
            maxKeywords: 50,
            // 每个句子提取的关键词数量
            extractNum: 5,
        }
    },
    mutations: {
        updatePercent(state, percent){
            state.percent = percent
            state.showLoadingBar = true
        },
        hideLoadingBar(state){
            state.showLoadingBar = false
        },
        updateSettingMaxKeywords(state, num){
            state.setting.maxKeywords = num
        },
        updateSettingExtractNum(state, num){
            state.setting.extractNum = num
        }
    },
    actions: {},
    modules: {},
    plugins: [
        createPersistedState({
            paths: ['setting']
        })
    ],
})
