const edit = {}

edit.newMember = function (db, qq, name){
    const stmt = db.prepare('INSERT INTO `members` (' +
        '`qq`, ' +
        '`name` ' +
        ') ' +
        'VALUES (?, ?);')
    stmt.run(qq, name)
    stmt.finalize()
}

edit.memberMsgCount = function (db, qq){
    const stmt = db.prepare('UPDATE `members` SET `msg_count` = `msg_count` + 1 WHERE `qq` = ?;')
    stmt.run(qq)
    stmt.finalize()
}

edit.memberImgCount = function (db, qq){
    const stmt = db.prepare('UPDATE `members` SET `img_count` = `img_count` + 1 WHERE `qq` = ?;')
    stmt.run(qq)
    stmt.finalize()
}

edit.memberActiveDay = function (db, qq){
    const stmt = db.prepare('UPDATE `members` SET `active_days` = `active_days` + 1 WHERE `qq` = ?;')
    stmt.run(qq)
    stmt.finalize()
}

edit.memberLateNight = function (db, qq, late_night_time, late_night_msg){
    const stmt = db.prepare('UPDATE `members` SET `late_night_time` = ?, `late_night_msg` = ? WHERE `qq` = ?;')
    stmt.run(late_night_time, late_night_msg, qq)
    stmt.finalize()
}

edit.memberAtCount = function (db, qq){
    const stmt = db.prepare('UPDATE `members` SET `at_count` = `at_count` + 1 WHERE `qq` = ?;')
    stmt.run(qq)
    stmt.finalize()
}

edit.memberBeAtCount = function (db, qq){
    const stmt = db.prepare('UPDATE `members` SET `be_at_count` = `be_at_count` + 1 WHERE `qq` = ?;')
    stmt.run(qq)
    stmt.finalize()
}

edit.memberWordCount = function (db, qq, count){
    const stmt = db.prepare('UPDATE `members` SET `word_count` = `word_count` + ? WHERE `qq` = ?;')
    stmt.run(count, qq)
    stmt.finalize()
}

edit.memberWordCount = function (db, qq){
    const stmt = db.prepare('UPDATE `members` SET `repeat_count` = `repeat_count` + 1 WHERE `qq` = ?;')
    stmt.run(qq)
    stmt.finalize()
}

edit.activePeriod = function (db, period, msg_count){
    const stmt = db.prepare('INSERT INTO `active_period` (' +
        '`period`, ' +
        '`msg_count` ' +
        ') ' +
        'VALUES (?, ?);')
    stmt.run(period, msg_count)
    stmt.finalize()
}

edit.atRecord = function (db, qq, target_name){
    const stmt = db.prepare('INSERT INTO `at_record` (' +
        '`qq`, ' +
        '`target_name` ' +
        ') ' +
        'VALUES (?, ?);')
    stmt.run(qq, target_name)
    stmt.finalize()
}

edit.base = function (db, group_name){
    const stmt = db.prepare('INSERT INTO `at_record` (' +
        '`qq` ' +
        ') ' +
        'VALUES (?);')
    stmt.run(group_name)
    stmt.finalize()
}

edit.charts = function (db, period, msg_count){
    const stmt = db.prepare('INSERT INTO `charts` (' +
        '`period`, ' +
        '`msg_count` ' +
        ') ' +
        'VALUES (?, ?);')
    stmt.run(period, msg_count)
    stmt.finalize()
}

edit.repeater = function (db, content, count){
    const stmt = db.prepare('INSERT INTO `repeater` (' +
        '`content`, ' +
        '`count` ' +
        ') ' +
        'VALUES (?, ?);')
    stmt.run(content, count)
    stmt.finalize()
}

edit.usedName = function (db, qq, name, time){
    const stmt = db.prepare('INSERT INTO `used_name` (' +
        '`qq`, ' +
        '`name`, ' +
        '`time` ' +
        ') ' +
        'VALUES (?, ?);')
    stmt.run(qq, name, time)
    stmt.finalize()
}

edit.checkWord = function (db, word){
    return new Promise((resolve, reject) => {
        const exist = db.prepare('SELECT * FROM `words` where `word` = ?')
        exist.get(word, function (err, row) {
            resolve(row)
        })
        exist.finalize()
    })
}

edit.words = async function (db, word){
    let row = await edit.checkWord(db, word)
    return new Promise( (resolve, reject) => {
        if (row) {
            // 更新
            const stmt = db.prepare('UPDATE `words` SET `count` = `count` + 1 WHERE `word` = ?;')
            stmt.run(word, function (){
                resolve()
            })
            stmt.finalize()
        } else {
            // 插入
            const stmt = db.prepare('INSERT INTO `words` (' +
                '`word` ' +
                ') ' +
                'VALUES (?);')
            stmt.run(word, function (){
                resolve()
            })
            stmt.finalize()
        }
    })
}

export default edit