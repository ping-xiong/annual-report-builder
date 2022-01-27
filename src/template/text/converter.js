import {getSelectedTime, getTopData, getTopActiveDate, getTopActiveTime, getBookCount} from "@/util/tool"

/**
 *
 * @param content 模板内容
 * @param data 数据
 * @returns {*}
 */
export default function (content, data){

    let topData = getTopData(data.members)

    let totalWords = topData.totalWords
    let totalMsg = topData.totalMsg
    let totalImg = topData.totalImg

    let maxWords = topData.maxWords
    let maxWordName = topData.maxWordName

    let maxRepeat = topData.maxRepeat
    let maxRepeatName = topData.maxRepeatName

    let maxImg = topData.maxImg
    let maxImgName = topData.maxImgName

    let maxActive = topData.maxActive
    let maxActiveName = topData.maxActiveName

    let keywords = ''
    let maxKeywords = data.topCutWords.length
    if (maxKeywords > 20){
        maxKeywords = 20
    }
    // 提取前20个关键词
    for (let i = 0; i < maxKeywords; i++) {
        keywords += data.topCutWords[i][0] + '(' + data.topCutWords[i][1] + '次)'
        if (i < maxKeywords - 1){
            keywords += '，'
        }
    }

    // 获取最活跃月/日
    let activeDateResult = getTopActiveDate(data.chartData, data.setting)
    let activeDate = activeDateResult.activeDate
    let activeDateData = activeDateResult.activeDateData


    let activePeriodResult = getTopActiveTime(data.activePeriod)
    let activePeriod = activePeriodResult.activePeriod
    // let activePeriodData = activePeriodResult.activePeriodData

    let topRepeatContent = ''
    let topRepeatContentCount = ''
    if (data.sortRepeats.length > 0){
        topRepeatContent = data.sortRepeats[0].content.trim()
        topRepeatContentCount = data.sortRepeats[0].count
    }
    
    // 开始替换字符串
    content = content.replace('{{time}}', getSelectedTime(data.setting))
        .replace('{{name}}', data.groupName)
        .replace('{{totalMember}}', data.members.length)
        .replace('{{totalMsg}}', totalMsg)
        .replace('{{totalWords}}', totalWords)
        .replace('{{book}}', getBookCount(totalWords))
        .replace('{{totalImg}}', totalImg)
        .replace('{{keywords}}', keywords)
        .replace('{{topRepeatContent}}', topRepeatContent)
        .replace('{{topRepeatContentCount}}', topRepeatContentCount)
        .replace('{{topLengthContent}}', data.longestContent.trim())
        .replace('{{topLengthContentName}}', data.longestContentName.trim())
        .replace('{{maxMsgDate}}', activeDate)
        .replace('{{totalMsgDate}}', activeDateData)
        .replace('{{activeTime}}', activePeriod)
        .replace('{{topKeyword}}', data.topCutWords[0][0])
        .replace('{{topTalkativeMember}}', maxWordName)
        .replace('{{topTalkativeCount}}', maxWords)
        .replace('{{topRepeater}}', maxRepeatName)
        .replace('{{topRepeaterCount}}', maxRepeat)
        .replace('{{topImgMember}}', maxImgName)
        .replace('{{topImgCount}}', maxImg)
        .replace('{{topActiveDayMember}}', maxActiveName)
        .replace('{{topActiveDayCount}}', maxActive)


    return content
}