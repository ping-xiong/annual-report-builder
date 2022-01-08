import config from "@/util/background/db/config";

const create = {}

// 初始化
create.init = async function (){
    await create.removeDb()
    const sqlite3 = require('sqlite3').verbose()
    const db = new sqlite3.Database(config.name)

    db.serialize(function() {
        create.tables(db)
    });

    return db
}

// 创建数据表
create.tables = function (db){
    db.run("CREATE TABLE IF NOT EXISTS `active_period` (" +
        "`period` TEXT NOT NULL," +
        "`msg_count` INTEGER NOT NULL DEFAULT '0'" +
        ");")

    db.run("CREATE TABLE IF NOT EXISTS `at_record`" +
        "(" +
        "    `qq`          TEXT    NOT NULL," +
        "    `target_name` TEXT    NOT NULL" +
        ");")

    db.run("CREATE TABLE IF NOT EXISTS `base`" +
        "(" +
        "    `group_name` TEXT    NOT NULL" +
        ");")

    db.run("CREATE TABLE IF NOT EXISTS `charts`" +
        "(" +
        "    `period`    TEXT    NOT NULL," +
        "    `msg_count` INTEGER NOT NULL DEFAULT '0'" +
        ");")

    db.run("CREATE TABLE IF NOT EXISTS `members`" +
        "(" +
        "    `qq`              TEXT    NOT NULL," +
        "    `name`            TEXT    NOT NULL," +
        "    `msg_count`       INTEGER NOT NULL DEFAULT '0'," +
        "    `img_count`       INTEGER NOT NULL DEFAULT '0'," +
        "    `active_days`     INTEGER NOT NULL DEFAULT '0'," +
        "    `late_night_time` TEXT," +
        "    `late_night_msg`  text," +
        "    `be_at_count`     INTEGER NOT NULL DEFAULT '0'," +
        "    `at_count`        INTEGER NOT NULL DEFAULT '0'," +
        "    `word_count`      INTEGER NOT NULL DEFAULT '0'," +
        "    `repeat_count`    INTEGER NOT NULL DEFAULT '0'" +
        ")")

    db.run("CREATE TABLE IF NOT EXISTS `repeater`" +
        "(" +
        "    `content` text    NOT NULL," +
        "    `count`   INTEGER NOT NULL DEFAULT '0'" +
        ")")

    db.run("CREATE TABLE IF NOT EXISTS `used_name`" +
        "(" +
        "    `qq`   TEXT    NOT NULL," +
        "    `name` TEXT    NOT NULL," +
        "    `time` TEXT    NOT NULL" +
        ")")

    db.run("CREATE TABLE IF NOT EXISTS `words`" +
        "(" +
        "    `word`  TEXT    NOT NULL," +
        "    `count` INTEGER NOT NULL DEFAULT '0'" +
        ")")

    db.run("CREATE INDEX IF NOT EXISTS `at_record_qq` ON `at_record` (`qq`);")
    db.run("CREATE INDEX IF NOT EXISTS `members_qq` ON `members` (`qq`);")
    db.run("CREATE INDEX IF NOT EXISTS `used_name_qq` ON `used_name` (`qq`);")
}

// 删除数据库
create.removeDb = function (){
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        fs.unlink(config.name, function (err){
            resolve()
        })
    })

}


export default create