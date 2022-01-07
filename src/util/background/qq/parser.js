const parser = {}


parser.parse = function (path, lineCount, setting, win){

    win.webContents.send('update-percent', 0)

    // let readLine = require('lei-stream').readLine
    // readLine(path).go(function (data, next) {
    //     console.log(data);
    //     next();
    // }, function () {
    //     console.log('end');
    // })
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