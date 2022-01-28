import {ipcRenderer} from "electron"
import viewData from "@/template/viewData"
import {
    getBookCount,
    getSelectedTimeDetail,
    getTopActiveDate,
    getTopActiveTime,
    getTopData
} from "@/util/tool"

/**
 * 导出为web
 * @param path 模板路径
 * @param data 模板数据
 * @param selectedPath 下拉选择的模板路径
 * @param allWebTemplates 模板列表
 * @param chartData 图表数据
 */
export default function (path, data, selectedPath, allWebTemplates, chartData){

    return new Promise((resolve, reject) => {
        let template = null
        for (let i = 0; i < allWebTemplates.length; i++) {
            if (allWebTemplates[i].path === selectedPath){
                template = allWebTemplates[i]
            }
        }

        let webData = getData(data, chartData)

        ipcRenderer.invoke('copy-dir', selectedPath, path).then( res => {
            if (res){
                // 修改目录的index文件
                ipcRenderer.invoke('replace-str', (res + template.main), JSON.parse(JSON.stringify(webData))).then( res2 => {
                    ipcRenderer.invoke('open-dir', res)
                    resolve(res2)
                }).catch( e => {
                    alert(e.toString())
                })
            }else{
                reject(res)
            }
        }).catch( e => {
            alert(e.toString())
        })
    });
}

export function getData(data, chartData) {
    let webData = {}

    // 组装网页模板数据
    webData['{{wordcloudOption}}'] = chartData.wordcloudData
    webData['{{lineChartOption}}'] = chartData.activeHoursData
    webData['{{barChartOption}}'] = chartData.getAllTimeData

    let timeDetail = getSelectedTimeDetail(data.setting)
    viewData.title = timeDetail.name + "报告"
    if (data.setting.type === 'ranger'){
        viewData.title = '报告'
    }

    viewData.date = timeDetail.time

    viewData.name = data.groupName
    viewData.memberCount = data.members.length

    viewData.members = data.members

    let topData = getTopData(data.members)
    viewData.totalMsg = topData.totalMsg
    viewData.totalWords = topData.totalWords
    viewData.totalImg = topData.totalImg
    viewData.bookCount = getBookCount(topData.totalWords)

    viewData.maxWords = topData.maxWords
    viewData.maxWordName = topData.maxWordName

    viewData.maxRepeat = topData.maxRepeat
    viewData.maxRepeatName = topData.maxRepeatName

    if (data.sortRepeats.length > 0){
        viewData.topRepeat = data.sortRepeats[0].content.trim()
        viewData.topRepeatCount = data.sortRepeats[0].count
    }

    viewData.maxImg = topData.maxImg
    viewData.maxImgName = topData.maxImgName

    viewData.maxActive = topData.maxActive
    viewData.maxActiveName = topData.maxActiveName

    viewData.longestContent = data.longestContent
    viewData.longestContentName = data.longestContentName

    if (data.topCutWords.length > 0){
        viewData.topKeyword = data.topCutWords[0][0]
        viewData.topKeywordCount = data.topCutWords[0][1]
    }


    let activeDateResult = getTopActiveDate(data.chartData, data.setting)
    viewData.activeDate = activeDateResult.activeDate
    viewData.activeDateData = activeDateResult.activeDateData

    let activePeriodResult = getTopActiveTime(data.activePeriod)
    viewData.activePeriod = activePeriodResult.activePeriod


    webData['{{viewData}}'] = viewData

    return webData
}