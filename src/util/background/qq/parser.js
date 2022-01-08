import create from "@/util/background/db/create"
import edit from "@/util/background/db/edit"
import nodejieba from "nodejieba";

const parser = {}

parser.parse = async function (path, lineCount, setting, win){
    // 显示进度条
    win.webContents.send('update-percent', 0)
    // 初始化数据库
    let db = await create.init()
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

    readLine(path).go(async function (data, next) {
        try {
            let dataWithoutPic = data.replace('[图片]', '').replace('\r', '')
            if (dataWithoutPic.length > 0){
                // 删除换行符

                // 过滤
                let reg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}.*\)/;
                let atReg = /(?<=@).*?(?<=\s)/

                if (reg.test(dataWithoutPic)){
                    // 日期和昵称和QQ号码
                    let dateTimeReg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}\s(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])/
                    let dateReg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/
                    let timeReg = /(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])/

                    let dateTime = dateTimeReg.exec(dataWithoutPic)[0]
                    lastDate = dateReg.exec(dateTime)[0]
                    lastTime = timeReg.exec(dateTime)[0]

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
                }else{
                    // 其他内容

                    // 过滤地址: http
                    // 过滤艾特: @
                    dataWithoutPic = dataWithoutPic.replace(/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/, '').replace(/@.*?(?<=\s)/, '')

                    // let result = nodejieba.cut(data2)
                    // console.log(result)

                    // 空格，标点符号过滤，不插入数据库

                    // for (const resultKey in result) {
                    //     edit.words(db, result[resultKey])
                    // }
                }
            }
        }catch (e) {
            console.log(e)
        }

        // 进度 + 1
        ++curCount
        // 计算百分比进度
        win.webContents.send('update-percent', ((curCount/lineCount) * 100).toFixed(2))
        next();
    }, function () {
        console.log('end');
        db.close()
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