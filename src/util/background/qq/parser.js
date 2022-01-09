import * as dayjs from 'dayjs'

const parser = {}

parser.parse = async function (path, lineCount, setting, win, commonSetting){
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
    const customParseFormat = require('dayjs/plugin/customParseFormat');
    dayjs.extend(customParseFormat)

    const isBetween = require('dayjs/plugin/isBetween');
    dayjs.extend(isBetween)

    let cutWords = {}
    readLine(path).go(async function (data, next) {
        try {
            // 删除换行符和图片
            let dataWithoutPic = data.replace('[图片]', '').replace('\r', '')
            if (dataWithoutPic.length > 0){
                if (reg.test(dataWithoutPic)){
                    let dateTime = dateTimeReg.exec(dataWithoutPic)[0]
                    lastDate = dateReg.exec(dateTime)[0]
                    lastTime = timeReg.exec(dateTime)[0]

                    let dateObj = dayjs(dateTime, "YYYY-MM-DD HH-mm-ss")

                    // 判断时间是否需要跳过
                    switch (setting.type) {
                        case 'year':
                            if (dateObj.year() !== dayjs(setting.year).year()){
                                isSkip = true
                            }
                            break;
                        case 'month':
                            if (dateObj.month() !== dayjs(setting.month).month()){
                                isSkip = true
                            }
                            break;
                        case 'ranger':
                            dateObj.isBetween(dayjs(setting.ranger[0]), dayjs(setting.ranger[1]))
                            break;
                    }

                    // 提取QQ和昵称
                    let qqName = dataWithoutPic.replace(dateTimeReg, '')
                    let nameReg = /[^\s].*(?=\()/
                    let qqReg = /(?<=\().+(?=\))/

                    let nameArr = nameReg.exec(qqName)
                    if (nameArr == null){
                        lastName = '空'
                    }else{
                        lastName = nameArr[0]
                    }

                    lastQQ = qqReg.exec(qqName)[0]

                    // QQ 是 10000 的是撤回消息，不解析
                    if (lastQQ === '10000' || lastQQ === 10000){
                        isSkip = true
                    }
                }else{
                    // 需要跳过的消息: 系统消息，不符合时间范围的消息，不符合报告类型的消息
                    if (isSkip){
                        isSkip = false
                    }else{
                        // 其他内容
                        // 前面8条内容为备注，只提取群名称
                        if (curCount < 8){

                            if (data.indexOf('消息对象') !== -1){
                                let groupNameReg = /(?<=消息对象:).+/
                                groupName = groupNameReg.exec(data)[0]
                            }

                        }else{
                            // 提取艾特的人
                            let atArr = data.match(/(?<=@).*?(?<=\s)/g)

                            // 提取图片数量
                            let imgs = (data.match(new RegExp("[图片]", "g")) || []).length

                            // 过滤地址: http
                            // 过滤艾特: @
                            dataWithoutPic = dataWithoutPic.replace(/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/, '').replace(/@.*?(?<=\s)/, '')

                            let result = nodejieba.extract(dataWithoutPic, parseInt(commonSetting.extractNum))
                            // console.log(result)

                            // 空格，标点符号过滤，数字，不插入数据库
                            for (const resultKey in result) {
                                let value = result[resultKey].word

                                if (cutWords[value]){
                                    cutWords[value] += 1
                                }else{
                                    cutWords[value] = 1
                                }
                            }
                        }
                    }
                }
            }
        }catch (e) {
            console.log(e)
        }

        // 进度 + 1
        ++curCount

        // 计算百分比进度，每1000条计算一次
        if (curCount % 1000 === 0){
            win.webContents.send('update-percent', ((curCount/lineCount) * 100).toFixed(2))
        }

        next()
    }, function () {
        console.log('end');

        const sortable = Object.fromEntries(
            Object.entries(cutWords).sort(([,a],[,b]) => a-b).slice(-commonSetting.maxKeywords)
        );

        win.webContents.send('update-percent',100)
        win.webContents.send('report-finish')
        console.log(sortable)
    })
}

parser.countLine = function (filePath){
    return new Promise((resolve, reject) => {
        let fs = require('fs')
        let lineCount = 0;
        fs.createReadStream(filePath)
            .on("data", (buffer) => {
                let idx = -1;
                lineCount--; // Because the loop will run once for idx=-1
                do {
                    idx = buffer.indexOf(10, idx+1);
                    lineCount++;
                } while (idx !== -1);
            }).on("end", () => {
            resolve(lineCount);
        }).on("error", reject);
    })
}

export default parser