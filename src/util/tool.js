import * as dayjs from "dayjs";

/**
 * 获取年度报告的时间
 * @param setting
 * @returns {string}
 */
export function getSelectedTime(setting){
    switch ( setting.type ) {
        case 'year':
            return dayjs(setting.year).year() + '年'
        case 'month':
            return dayjs(setting.month).format('YYYY-MM')
        case 'ranger':
            return dayjs(setting.ranger[0]).format('MM-DD') + '至' + dayjs(setting.ranger[1]).format('MM-DD')
        default:
            return ''
    }
}

/**
 * 获取年度报告名字和格式化
 * @param setting
 * @returns {{}|{name: string, time: string}}
 */
export function getSelectedTimeDetail(setting){
    switch (setting.type) {
        case 'year':
            return {
                name: '年度',
                time: dayjs(setting.year).year() + '年'
            }
        case 'month':
            return {
                name: '月度',
                time: dayjs(setting.month).format('YYYY-MM')
            }
        case 'ranger':
            return {
                name: '自定义范围',
                time: dayjs(setting.ranger[0]).format('MM-DD') + '至' + dayjs(setting.ranger[1]).format('MM-DD')
            }
        default:
            return {}
    }
}

/**
 * 统计各种排名第一的成员
 * 统计总字数，总消息数，总图片数
 * @param members
 * @returns {{maxImg: number, maxRepeatName: string, totalWords: number, maxWords: number, maxActiveName: string, totalImg: number, maxWordName: string, totalMsg: number, maxRepeat: number, maxImgName: string, maxActive: number}}
 */
export function getTopData(members){

    let totalWords = 0
    let totalMsg = 0
    let totalImg = 0

    let maxWords = 0
    let maxWordName = ''

    let maxRepeat = 0
    let maxRepeatName = ''

    let maxImg = 0
    let maxImgName = ''

    let maxActive = 0
    let maxActiveName = ''

    for (const membersKey in members) {
        totalMsg += members[membersKey].msgs
        totalWords += members[membersKey].words
        totalImg += members[membersKey].imgs

        if (members[membersKey].words > maxWords){
            maxWords = members[membersKey].words
            maxWordName = members[membersKey].name
        }

        if(members[membersKey].repeats > maxRepeat){
            maxRepeat = members[membersKey].repeats
            maxRepeatName = members[membersKey].name
        }

        if(members[membersKey].imgs > maxImg){
            maxImg = members[membersKey].imgs
            maxImgName = members[membersKey].name
        }

        if(members[membersKey].actives > maxActive){
            maxActive = members[membersKey].actives
            maxActiveName = members[membersKey].name
        }
    }

    return {
        memberCount: members.length,
        totalWords,
        totalMsg,
        totalImg,
        maxWords,
        maxWordName,
        maxRepeat,
        maxRepeatName,
        maxImg,
        maxImgName,
        maxActive,
        maxActiveName
    }
}

/**
 * 获取最活跃的时间（月份或者日）
 * @param chartData
 * @param setting
 * @returns {{activeDateData: number, activeDate: string}}
 */
export function getTopActiveDate(chartData, setting) {
    // 获取最活跃月/日
    let activeDate = ''
    let activeDateData = 0
    for (const chartDataKey in chartData) {
        if (chartData[chartDataKey] > activeDateData){
            activeDateData = chartData[chartDataKey]
            activeDate = parseInt(chartDataKey) + 1
        }
    }

    if (setting.type === 'year'){
        activeDate += '月'
    }else{
        activeDate += '日'
    }

    return {
        activeDate,
        activeDateData
    }
}

/**
 * 获取24小时中最活跃的时段
 * @param data
 * @returns {{activePeriod: string, activePeriodData: number}}
 */
export function getTopActiveTime(data) {

    let activePeriod = ''
    let activePeriodData = 0
    for (const activePeriodKey in data) {
        if (data[activePeriodKey] > activePeriodData){
            activePeriodData = data[activePeriodKey]
            activePeriod = activePeriodKey
        }
    }

    activePeriod += '点'

    return {
        activePeriod,
        activePeriodData
    }
}

/**
 * 计算字数
 * @param wordCount
 * @returns {string}
 */
export function getBookCount(wordCount){
    // 西游记总字数，来自百度百科
    let westWords = 870000

    return  (wordCount / westWords).toFixed(2)
}