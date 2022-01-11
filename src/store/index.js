import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import createPersistedState from "vuex-persistedstate"

export default new Vuex.Store({
    state: {
        // 激活的菜单 index
        selectedItem: 0,
        // 当前处理数据的百分比进度数据
        percent: 0,
        // 是否显示进度条
        showLoadingBar: false,
        // 通用设置
        setting: {
            // 提取TOP N个关键词
            maxKeywords: 100,
            // 每个句子提取的关键词数量
            extractNum: 2,
            // 排除的QQ号码
            excludeQQ: ['10000', '1000000'],
            // 输出报告成品类型, web 网页， txt 纯文本, img 长图版
            product: 'web'
        }
    },
    mutations: {
        updateSelectedItem(state, index){
            state.selectedItem = index
        },
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
        },
        updateSettingExcludeQQ(state, qqStr){
            try {
                if (qqStr.length === 0){
                    state.setting.excludeQQ = []
                }else{
                    state.setting.excludeQQ = qqStr.trim().replace('，', ',').split(',')
                }
            }catch (e) {
                // 忽略
            }
        },
        updateSettingProduct(state, product){
            state.setting.product = product
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
