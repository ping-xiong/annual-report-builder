import {getSelectedTime} from "@/util/tool"

export default function (content, data){

    let totalWords = 0
    let totalMsg = 0
    let totalImg = 0

    // 西游记总字数，来自百度百科
    let westWords = 870000

    let maxWords = 0
    let maxWordMemberName = ''

    let maxRepeat = 0
    let maxRepeatName = ''

    let maxImg = 0
    let maxImgName = ''

    let maxActive = 0
    let maxActiveName = ''

    for (const membersKey in data.members) {
        totalMsg += data.members[membersKey].msgs
        totalWords += data.members[membersKey].words
        totalImg += data.members[membersKey].imgs

        if (data.members[membersKey].words > maxWords){
            maxWords = data.members[membersKey].words
            maxWordMemberName = data.members[membersKey].name
        }

        if(data.members[membersKey].repeats > maxRepeat){
            maxRepeat = data.members[membersKey].repeats
            maxRepeatName = data.members[membersKey].name
        }

        if(data.members[membersKey].imgs > maxImg){
            maxImg = data.members[membersKey].imgs
            maxImgName = data.members[membersKey].name
        }

        if(data.members[membersKey].actives > maxActive){
            maxActive = data.members[membersKey].actives
            maxActiveName = data.members[membersKey].name
        }
    }

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
    let activeDate = ''
    let activeDateData = 0
    for (const chartDataKey in data.chartData) {
        if (data.chartData[chartDataKey] > activeDateData){
            activeDateData = data.chartData[chartDataKey]
            activeDate = chartDataKey
        }
    }

    if (data.setting.type === 'year'){
        activeDate += '月'
    }else{
        activeDate += '日'
    }

    let activePeriod = ''
    let activePeriodData = 0
    for (const activePeriodKey in data.activePeriod) {
        if (data.activePeriod[activePeriodKey] > activePeriodData){
            activePeriodData = data.activePeriod[activePeriodKey]
            activePeriod = activePeriodKey
        }
    }

    activePeriod += '点左右'
    
    // 开始替换字符串
    content = content.replace('{{time}}', getSelectedTime(data.setting))
        .replace('{{name}}', data.groupName)
        .replace('{{totalMember}}', data.members.length)
        .replace('{{totalMsg}}', totalMsg)
        .replace('{{totalWords}}', totalWords)
        .replace('{{book}}', (totalWords / westWords).toFixed(2))
        .replace('{{totalImg}}', totalImg)
        .replace('{{keywords}}', keywords)
        .replace('{{topRepeatContent}}', data.sortRepeats[0].content.trim())
        .replace('{{topRepeatContentCount}}', data.sortRepeats[0].count)
        .replace('{{topLengthContent}}', data.longestContent.trim())
        .replace('{{maxMsgDate}}', activeDate)
        .replace('{{totalMsgDate}}', activeDateData)
        .replace('{{activeTime}}', activePeriod)
        .replace('{{topKeyword}}', data.topCutWords[0][0])
        .replace('{{topTalkativeMember}}', maxWordMemberName)
        .replace('{{topRepeater}}', maxRepeatName)
        .replace('{{topImgMember}}', maxImgName)
        .replace('{{topActiveDayMember}}', maxActiveName)


    return content
}