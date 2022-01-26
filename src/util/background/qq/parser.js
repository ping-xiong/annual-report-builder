import * as dayjs from 'dayjs'

const parser = {}

parser.parse = async function (path, lineCount, setting, win, commonSetting, logger) {
    // 显示进度条
    win.webContents.send('update-percent', 0)
    // 当前进度
    let curCount = 0

    const nodejieba = require("nodejieba")

    let readLine = require('lei-stream').readLine

    // 最后一次解析的QQ和昵称
    let lastQQ = ''
    let lastName = ''
    // 最后一次解析的时间和日期
    let lastDate = ''
    let lastTime = ''
    // 最后一次dayjs对象
    let lastDateObj = null

    // 最后一次解析的QQ和昵称
    let lastQQ2 = ''
    let lastName2 = ''
    // 最后一次解析的时间和日期
    let lastDate2 = ''
    let lastTime2 = ''
    // 最后一次dayjs对象
    let lastDateObj2 = null

    // 群名称
    let groupName = ''

    // 日期和昵称和QQ号码
    let dateTimeReg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}\s(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])/
    let dateReg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/
    let timeReg = /(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])/

    let linkReg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/

    // 判断是否是日期时间的内容，QQ号码有邮箱和数字格式，邮箱的括号为<>，数字的括号为()
    let reg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}.*[\)>]/;

    // 过滤标点符号
    // let filterReg1 = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/
    // let filterReg2 = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/

    let isSkip = false

    // 加载dayjs插件
    const customParseFormat = require('dayjs/plugin/customParseFormat');
    dayjs.extend(customParseFormat)
    const isBetween = require('dayjs/plugin/isBetween');
    dayjs.extend(isBetween)

    // 利用数组自定义顺序，来判断消息是不是最晚，这里规定凌晨5点为最晚
    let latestTimeArr = [5, 4, 3, 2, 1, 0, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6]

    // 分析数据临时储存
    let cutWords = {} // 分词
    let members = [] // 成员各项数据统计
    let member = {
        qq: '', // QQ
        name: '', // 昵称
        msgs: 0, // 消息数
        imgs: 0, // 发图数
        actives: 0, // 活跃天数
        lastActive: null, // 上一次活跃天数
        lateMsgTimeIndex: 23, // 自定义最晚时间数组索引
        lateMsgTime: null, // 最晚消息时间
        lateMsgContent: null, // 最晚消息内容
        beAt: 0, // 被艾特次数
        at: 0, // 艾特次数
        words: 0, // 消息字数
        repeats: 0, // 复读次数
    } // 成员具体数据
    let usedName = [] // 曾用名
    let chartData = {} // 线图数据
    let activePeriod = {} // 24小时聊天活跃时间表
    let atRecord = [] // 艾特记录
    let repeaters = [] // 复读机表, 记录内容
    let repeater = {
        sign: null, // 内容计算的唯一MD5值
        content: null, // 具体内容
        count: 0 // 复读次数
    } // 复读机具体
    let longestContent = '' // 最长的内容
    let longestContentName = '' // 说该最长的内容的昵称

    // 初始化24小时活跃时间表
    for (let i = 0; i < 24; i++) {
        activePeriod[i] = 0
    }

    // 初始化线图数据表，根据统计的年度，月份，天数对应不同的key
    let maxChartKey = 0
    switch (setting.type) {
        case 'year':{
            // 如果是今年，排除还没到的年份
            if (dayjs(setting.year) === dayjs().year()){
                maxChartKey = dayjs().month()
            }else{
                maxChartKey = 12
            }
            for (let i = 0; i < maxChartKey; i++) {
                chartData[i] = 0
            }
            break;
        }
        case 'month':{
            // 天数，如果是当前月，排除还没到的天数
            if (dayjs(setting.month).format('YYYY-MM') === dayjs().format('YYYY-MM')){
                maxChartKey = dayjs().date()
            }else{
                // 获取对应月份的天数
                maxChartKey = dayjs(setting.month).daysInMonth()
            }
            for (let i = 1; i <= maxChartKey; i++) {
                chartData[i] = 0
            }
            break;
        }
        case 'ranger': {
            let startDay = dayjs(setting.ranger[0])
            let diffDay = dayjs(setting.ranger[1]).diff(startDay, 'day')
            for (let i = 0; i <= diffDay; i++) {
                chartData[startDay.add(i, 'day').format('MM-DD')] = 0
            }
            break;
        }
    }

    // 有些消息是多行的，需要拼接
    let fullContent = ''
    let hasNext = false

    // 上一次内容，用于判断是否复读
    let lastFullContent = null
    // 连续复读次数
    let repeatCount = 0

    let dataWithoutPic = ''
    // 一行一行读取文件
    readLine(path).go(async function (data, next) {
        try {
            // 单独提取群昵称
            if (curCount < 8) {
                if (data.indexOf('消息对象') !== -1) {
                    let groupNameReg = /(?<=消息对象:).+/
                    groupName = groupNameReg.exec(data)[0]
                }
            }

            dataWithoutPic = data.replace('\r', '')
            // 删除换行符和图片
            if (dataWithoutPic.length > 0) {
                dataWithoutPic = dataWithoutPic.replace('[图片]', '').replace('[表情]', '')

                if (reg.test(dataWithoutPic) && hasNext) {
                    hasNext = false
                    if (lastDateObj != null) {
                        lastDate2 = JSON.parse(JSON.stringify(lastDate))
                        lastTime2 = JSON.parse(JSON.stringify(lastTime))
                        lastName2 = JSON.parse(JSON.stringify(lastName))
                        lastQQ2 = JSON.parse(JSON.stringify(lastQQ))
                        lastDateObj2 = dayjs(lastDate2 + " " + lastTime2)
                    }
                }

                if (hasNext) {
                    // 拼接聊天内容
                    fullContent += data.replace('\r', '') + "\r\n"
                }

                // 处理消息
                if (!hasNext && fullContent.length > 0) {
                    // 需要跳过的消息: 系统消息，不符合时间范围的消息，不符合报告类型的消息
                    if (isSkip) {
                        isSkip = false
                    } else {
                        // 其他内容

                        // 提取艾特的人
                        let atArr = fullContent.match(/(?<=@).*?(?<=\s)/g)
                        if (atArr == null) {
                            atArr = []
                        }

                        // 提取图片数量
                        let imgCount = (fullContent.match(new RegExp("[图片]", "g")) || []).length

                        // 过滤地址: http
                        // 过滤艾特: @
                        dataWithoutPic = fullContent.replace('\r', '')
                            .replace('[图片]', '')
                            .replace('[表情]', '')
                            .replace(linkReg, '')
                            .replace(/@.*?(?<=\s)/, '')

                        let result = nodejieba.extract(dataWithoutPic, parseInt(commonSetting.extractNum))
                        // console.log(result)
                        // 统计分词
                        for (const resultKey in result) {
                            let value = result[resultKey].word

                            if (cutWords[value]) {
                                cutWords[value] += 1
                            } else {
                                cutWords[value] = 1
                            }
                        }


                        // 查找成员是否已经存在
                        let memberIndex = members.findIndex(member => member.qq == lastQQ2)
                        if (memberIndex !== -1) {
                            // 已有成员，更新
                            // 更新昵称
                            members[memberIndex].name = lastName2
                            // 更新活跃时间
                            if (members[memberIndex].lastActive != lastDate2) {
                                members[memberIndex].actives += 1
                                members[memberIndex].lastActive = lastDate2
                            }
                            // 更新发图数
                            members[memberIndex].imgs += imgCount
                            // 增加艾特数
                            members[memberIndex].at += atArr.length
                            // 增加消息数
                            members[memberIndex].msgs += 1
                            // 增加字数
                            members[memberIndex].words += fullContent.length
                            // 计算最晚时间
                            let timeIndex = latestTimeArr.indexOf(dayjs('2022-01-01 ' + lastTime2).hour())
                            let needUpdate = false
                            if (members[memberIndex].lateMsgTimeIndex >= timeIndex) {
                                if (members[memberIndex].lateMsgTimeIndex === timeIndex){
                                    // 比较分钟和秒数，更大的继续更新
                                    if (dayjs('2022-01-01 ' + lastTime2).unix() > dayjs('2022-01-01 ' + members[memberIndex].lateMsgTime).unix()){
                                        // 更新消息
                                        needUpdate = true
                                    }
                                }else{
                                    // 更新消息
                                    needUpdate = true
                                }
                            }

                            if (needUpdate){
                                // 更新消息
                                members[memberIndex].lateMsgTimeIndex = timeIndex
                                members[memberIndex].lateMsgTime = lastTime2
                                members[memberIndex].lateMsgContent = fullContent
                            }

                            if (lastFullContent === fullContent && lastFullContent.indexOf('[图片]') === -1){
                                // 复读加一
                                members[memberIndex].repeats += 1
                            }

                        } else {
                            // 新成员
                            let newMember = JSON.parse(JSON.stringify(member))
                            newMember.qq = lastQQ2
                            newMember.name = lastName2
                            newMember.lastActive = lastDate2
                            newMember.actives += 1
                            // 发图数
                            newMember.imgs += imgCount
                            // 艾特数
                            newMember.at += atArr.length
                            // 消息数
                            newMember.msgs += 1
                            // 字数
                            newMember.words += fullContent.length
                            // 最晚消息
                            newMember.lateMsgTimeIndex = latestTimeArr.indexOf(dayjs('2022-01-01 ' + lastTime2).hour())
                            newMember.lateMsgTime = lastTime2
                            newMember.lateMsgContent = fullContent

                            if (lastFullContent === fullContent){
                                // 复读加一
                                newMember.repeats += 1
                            }

                            members.push(newMember)
                        }

                        // 统计24小时每个时段消息
                        activePeriod[dayjs('2022-01-01 ' + lastTime2).hour()] += 1

                        switch (setting.type) {
                            case 'year':{
                                chartData[lastDateObj2.month()] += 1
                                break
                            }
                            case 'month':{
                                chartData[lastDateObj2.date()] += 1
                                break
                            }
                            case 'ranger':{
                                chartData[lastDateObj2.format('MM-DD')] += 1
                                break
                            }
                        }

                        // 判断最长的内容，排除链接
                        if ((fullContent.replace(linkReg, '')).length > longestContent.length){
                            longestContent = fullContent
                            longestContentName = lastName2
                        }

                        // 记录复读次数，排除图片，因为不知道图片是否是同一张
                        if (lastFullContent === fullContent && lastFullContent.indexOf('[图片]') === -1){
                            repeatCount += 1
                        }else{
                            if (repeatCount > 0){
                                let newRepeater = JSON.parse(JSON.stringify(repeater))
                                newRepeater.content = lastFullContent
                                newRepeater.count = repeatCount

                                repeaters.push(newRepeater)
                            }
                            repeatCount = 0
                        }

                        lastFullContent = fullContent
                        fullContent = ''
                    }
                }

                // 判断是否为时间行
                if (reg.test(dataWithoutPic) && !hasNext) {

                    hasNext = true
                    fullContent = ''

                    let dateTime = dateTimeReg.exec(dataWithoutPic)[0]
                    lastDate = dateReg.exec(dateTime)[0]
                    lastTime = timeReg.exec(dateTime)[0]

                    lastDateObj = dayjs(dateTime)

                    // 判断时间是否需要跳过
                    switch (setting.type) {
                        case 'year':
                            if (lastDateObj.year() !== dayjs(setting.year).year()) {
                                isSkip = true
                            }
                            break;
                        case 'month':
                            if (lastDateObj.format('YYYY-MM') !== dayjs(setting.month).format('YYYY-MM')) {
                                isSkip = true
                            }
                            break;
                        case 'ranger':
                            if (!lastDateObj.isBetween(dayjs(setting.ranger[0]), dayjs(setting.ranger[1]))){
                                isSkip = true
                            }
                            break;
                    }

                    // 提取QQ和昵称
                    let qqName = dataWithoutPic.replace(dateTimeReg, '')
                    let nameReg = /[^\s].*(?=[\(<])/
                    let qqReg = /(?<=[\(<]).+(?=[\)>])/

                    let nameArr = nameReg.exec(qqName)
                    if (nameArr == null) {
                        lastName = '空'
                    } else {
                        lastName = nameArr[0]
                    }

                    lastQQ = qqReg.exec(qqName)[0].toString()

                    // 排除QQ号，不进行统计
                    if (commonSetting.excludeQQ.indexOf(lastQQ) !== -1) {
                        isSkip = true
                    }

                    // 个人报告更高优先级，无视排除列表
                    if (setting.report === 'person') {
                        isSkip = setting.targetQQ !== lastQQ;
                    }
                }
            }
        } catch (e) {
            console.log(e)
            logger.error(JSON.stringify(e))
        }

        // 进度 + 1
        ++curCount

        // 计算百分比进度，每1000条计算一次
        if (curCount % 1000 === 0) {
            win.webContents.send('update-percent', ((curCount / lineCount) * 100).toFixed(2))
            // 任务栏图标进度条
            win.setProgressBar(parseFloat(curCount / lineCount))
        }

        dataWithoutPic = ''

        next()
    }, function () {
        // console.log('end');
        // 截取TOP N数据并降序
        const topCutWords = (Object.entries(cutWords).sort(([, a], [, b]) => a - b).slice(-commonSetting.maxKeywords)).reverse()
        const sortRepeats = repeaters.sort( (a,b) => a.count > b.count ? 1 : -1 ).slice(-commonSetting.maxRepeaters).reverse()

        win.webContents.send('update-percent', 100)
        // 发送完成的数据到渲染进程
        win.webContents.send('qq-report-finish', {
            groupName,
            members,
            chartData,
            activePeriod,
            topCutWords,
            sortRepeats,
            longestContent,
            longestContentName,
            setting,
            commonSetting
        })
        win.setProgressBar(1.0, {mode: 'none'})


        // console.log(topCutWords)
        // console.log(members)
        // console.log("群名称", groupName)
        // console.log(activePeriod)
        // console.log(chartData)
        // console.log(longestContent)
        // console.log(sortRepeats)
    })
}

parser.countLine = function (filePath) {
    return new Promise((resolve, reject) => {
        let fs = require('fs')
        let lineCount = 0;
        fs.createReadStream(filePath)
            .on("data", (buffer) => {
                let idx = -1;
                lineCount--; // Because the loop will run once for idx=-1
                do {
                    idx = buffer.indexOf(10, idx + 1);
                    lineCount++;
                } while (idx !== -1);
            }).on("end", () => {
            resolve(lineCount);
        }).on("error", reject);
    })
}

export default parser