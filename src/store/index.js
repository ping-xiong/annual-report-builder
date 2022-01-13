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
            maxKeywords: 150,
            // 每个句子提取的关键词数量
            extractNum: 2,
            // 排除的QQ号码
            excludeQQ: ['10000', '1000000'],
            // 提取TOP N个复读内容
            maxRepeaters: 10
        },
        // QQ 历史项目列表
        QQProject: [],
        // QQ分析数据预览
        QQPreviewData: null,
        // 微信历史项目列表
        WechatProject: [],
        // 微信分析数据预览
        WechatPreviewData: null
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
        },
        InsertQQProject(state, project){
            state.QQProject.push(project)
        },
        DelQQProject(state, index){
            state.QQProject.splice(index, 1)
        },
        InsertWechatProject(state, project){
            state.WechatProject.push(project)
        },
        DelWechatProject(state, index){
            state.WechatProject.splice(index, 1)
        },
        updateSettingMaxRepeaters(state, num){
            state.setting.maxRepeaters = num
        },
        updateQQPreviewData(state, data){
            state.QQPreviewData = data
        },
        updateWechatPreviewData(state, data){
            state.WechatPreviewData = data
        }
    },
    actions: {},
    modules: {},
    plugins: [
        createPersistedState({
            paths: ['setting', 'QQProject', 'WechatProject']
        })
    ],
})
