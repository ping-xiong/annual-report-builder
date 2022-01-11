import * as dayjs from 'dayjs'
import {readLine} from "lei-stream";

const parser = {}

parser.parse = async function (path, lineCount, setting, win, commonSetting) {
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

    // 判断是否是日期时间的内容
    let reg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}.*\)/;

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

    // 日志记录器
    const winston = require('winston');

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({filename: 'error.log', level: 'error'})
        ],
    });


    // 有些消息是多行的，需要拼接
    let fullContent = ''
    let hasNext = false

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
                    fullContent += data
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
                        let imgs = (fullContent.match(new RegExp("[图片]", "g")) || []).length

                        // 过滤地址: http
                        // 过滤艾特: @
                        dataWithoutPic = fullContent.replace('\r', '')
                            .replace('[图片]', '')
                            .replace('[表情]', '')
                            .replace(/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/, '')
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
                            members[memberIndex].imgs += imgs
                            // 增加艾特数
                            members[memberIndex].at += atArr.length
                            // 增加消息数
                            members[memberIndex].msgs += 1
                            // 增加字数
                            members[memberIndex].words += fullContent.length
                            // 计算最晚时间
                            let timeIndex = latestTimeArr.indexOf(dayjs('2022-01-01 ' + lastTime2).hour())
                            if (members[memberIndex].lateMsgTimeIndex > timeIndex) {
                                // 更新消息
                                members[memberIndex].lateMsgTimeIndex = timeIndex
                                members[memberIndex].lateMsgTime = lastTime2
                                members[memberIndex].lateMsgContent = fullContent
                            }

                        } else {
                            // 新成员
                            let newMember = JSON.parse(JSON.stringify(member))
                            newMember.qq = lastQQ2
                            newMember.name = lastName2
                            newMember.lastActive = lastDate2
                            newMember.actives += 1
                            // 发图数
                            newMember.imgs += imgs
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

                            members.push(newMember)
                        }

                        // 统计24小时每个时段消息



                        // 判断最长的内容
                        if (fullContent.length > longestContent.length){
                            longestContent = fullContent
                        }

                        fullContent = ''
                    }
                }


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
                            if (lastDateObj.month() !== dayjs(setting.month).month()) {
                                isSkip = true
                            }
                            break;
                        case 'ranger':
                            lastDateObj.isBetween(dayjs(setting.ranger[0]), dayjs(setting.ranger[1]))
                            break;
                    }

                    // 提取QQ和昵称
                    let qqName = dataWithoutPic.replace(dateTimeReg, '')
                    let nameReg = /[^\s].*(?=\()/
                    let qqReg = /(?<=\().+(?=\))/

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
        console.log('end');

        const TopCutWords = Object.fromEntries(
            Object.entries(cutWords).sort(([, a], [, b]) => a - b).slice(-commonSetting.maxKeywords)
        );

        win.webContents.send('update-percent', 100)
        win.webContents.send('report-finish')
        win.setProgressBar(1.0, {mode: 'none'})


        // console.log(TopCutWords)
        // console.log(members)
        console.log("群名称", groupName)
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