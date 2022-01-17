import {getSelectedTime} from "@/util/tool"

export default function (content, data){

    let totalWords = 0
    let totalMsg = 0
    let totalImg = 0

    // 西游记总字数，来自百度百科
    let westWords = 870000

    for (const membersKey in data.members) {
        totalMsg += data.members[membersKey].msgs
        totalWords += data.members[membersKey].words
        totalImg += data.members[membersKey].imgs
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
    
    // 开始替换字符串
    content = content.replace('{{time}}', getSelectedTime(data.setting))
        .replace('{{name}}', data.groupName)
        .replace('{{totalMember}}', data.members.length)
        .replace('{{totalMsg}}', totalMsg)
        .replace('{{totalWords}}', totalWords)
        .replace('{{book}}', (totalWords / westWords).toFixed(2))
        .replace('{{totalImg}}', totalImg)
        .replace('{{keywords}}', keywords)
        .replace('{{topRepeatContent}}', data.sortRepeats[0].content)
        .replace('{{topRepeatContentCount}}', data.sortRepeats[0].count)
        .replace('{{topLengthContent}}', data.lateMsgContent)


    return content
}